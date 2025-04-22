import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Bike, Check, ChevronLeft, ChevronRight, Clock, Image, Mail, MapPin, Phone, Store, User, X } from 'lucide-react';
import { useLoadScript } from '@react-google-maps/api';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

// Import Firebase app instance
import { app } from '../../../utils/firebaseFunctions';

// Import custom components
import Button from '../../atoms/Button';
import CountryCodeSelector from '../../atoms/CountryCodeSelector';
import MapComponent from '../../molecules/MapComponent';

// Define the libraries for Google Maps
const libraries = ['places'];

const RegistrationForm = ({ onSubmit, isLoading }) => {
  // Form state
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // User type selection state
  const [userType, setUserType] = useState('');
  
  // Personal details state
  const [personalDetails, setPersonalDetails] = useState({
    firstName: '',
    lastName: '',
    email: '',
    countryCode: '+94',
    mobile: '',
    nic: ''
  });
  
  // Restaurant details state
  const [restaurantDetails, setRestaurantDetails] = useState({
    name: '',
    address: '',
    city: '',
    openingTime: '08:00',
    closingTime: '22:00',
    coverImage: null,
    coverImageURL: '',
    coverImageProgress: 0,
    isUploading: false
  });
  
  // Rider details state
  const [riderDetails, setRiderDetails] = useState({
    vehicleType: 'motorcycle',
    vehicleNumber: '',
    licenseImage: null,
    licenseImageURL: '',
    licenseImageProgress: 0,
    isUploading: false
  });
  
  // Location state
  const [location, setLocation] = useState({
    latitude: 6.9271,
    longitude: 79.8612,
    address: ''
  });
  
  // Form validation errors
  const [errors, setErrors] = useState({});
  
  // Google Maps setup
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });
  const mapRef = useRef(null);
  const searchBoxRef = useRef(null);
  
  // Map state
  const [mapCenter, setMapCenter] = useState({ lat: 6.9271, lng: 79.8612 });
  const [markerPosition, setMarkerPosition] = useState({ lat: 6.9271, lng: 79.8612 });
  const [isLocating, setIsLocating] = useState(false);
  
  // Handle map click
  const handleMapClick = (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setMarkerPosition({ lat, lng });
    setLocation({
      ...location,
      latitude: lat,
      longitude: lng
    });
  };
  
  // Handle marker drag end
  const handleMarkerDragEnd = (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setMarkerPosition({ lat, lng });
    setLocation({
      ...location,
      latitude: lat,
      longitude: lng
    });
  };
  
  // Handle places changed
  const onPlacesChanged = () => {
    if (searchBoxRef.current) {
      const places = searchBoxRef.current.getPlaces();
      if (places && places.length > 0) {
        const place = places[0];
        const location = place.geometry.location;
        const lat = location.lat();
        const lng = location.lng();
        
        setMapCenter({ lat, lng });
        setMarkerPosition({ lat, lng });
        setLocation({
          latitude: lat,
          longitude: lng,
          address: place.formatted_address || ''
        });
      }
    }
  };
  
  // Get current location
  const getCurrentLocation = () => {
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setMapCenter({ lat, lng });
          setMarkerPosition({ lat, lng });
          setLocation({
            ...location,
            latitude: lat,
            longitude: lng
          });
          setIsLocating(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setIsLocating(false);
          alert("Could not get your location. Please ensure location services are enabled.");
        }
      );
    } else {
      setIsLocating(false);
      alert("Geolocation is not supported by this browser.");
    }
  };
  
  // Handle file change
  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    if (!allowedTypes.includes(file.type)) {
      setErrors({
        ...errors,
        [type]: 'Please upload a valid image file (JPEG, PNG)'
      });
      return;
    }
    
    if (file.size > maxSize) {
      setErrors({
        ...errors,
        [type]: 'Image size should be less than 5MB'
      });
      return;
    }
    
    // Clear any previous errors
    const newErrors = { ...errors };
    delete newErrors[type];
    setErrors(newErrors);
    
    // Update file state
    if (type === 'coverImage') {
      setRestaurantDetails({
        ...restaurantDetails,
        coverImage: file,
        isUploading: true
      });
      uploadImageToFirebase(file, 'restaurants', setRestaurantDetailsUploadProgress);
    } else if (type === 'licenseImage') {
      setRiderDetails({
        ...riderDetails,
        licenseImage: file,
        isUploading: true
      });
      uploadImageToFirebase(file, 'licenses', setRiderDetailsUploadProgress);
    }
  };
  
  // Upload image to Firebase
  const uploadImageToFirebase = (file, folder, progressCallback) => {
    if (!file) return;
    
    const storage = getStorage(app);
    const fileName = `${Date.now()}_${file.name}`;
    
    // Use a common uploads folder that might have permissions
    // instead of specific folders for restaurants/licenses
    const storageRef = ref(storage, `uploads/${fileName}`);
    
    const uploadTask = uploadBytesResumable(storageRef, file);
    
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        progressCallback(progress);
      },
      (error) => {
        console.error('Error uploading image:', error);
        progressCallback(0, null, true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          progressCallback(100, downloadURL);
        });
      }
    );
  };
  
  // Set restaurant details upload progress
  const setRestaurantDetailsUploadProgress = (progress, downloadURL = null, error = false) => {
    setRestaurantDetails((prev) => ({
      ...prev,
      coverImageProgress: progress,
      coverImageURL: downloadURL || prev.coverImageURL,
      isUploading: progress < 100 && !error
    }));
  };
  
  // Set rider details upload progress
  const setRiderDetailsUploadProgress = (progress, downloadURL = null, error = false) => {
    setRiderDetails((prev) => ({
      ...prev,
      licenseImageProgress: progress,
      licenseImageURL: downloadURL || prev.licenseImageURL,
      isUploading: progress < 100 && !error
    }));
  };
  
  // Remove uploaded image
  const removeUploadedImage = (type) => {
    if (type === 'coverImage') {
      setRestaurantDetails({
        ...restaurantDetails,
        coverImage: null,
        coverImageURL: '',
        coverImageProgress: 0
      });
    } else if (type === 'licenseImage') {
      setRiderDetails({
        ...riderDetails,
        licenseImage: null,
        licenseImageURL: '',
        licenseImageProgress: 0
      });
    }
  };
  
  // Validate current step
  const validateStep = () => {
    const newErrors = {};
    
    if (currentStep === 1) {
      if (!userType) newErrors.userType = 'Please select a user type';
    } 
    else if (currentStep === 2) {
      if (!personalDetails.firstName.trim()) newErrors.firstName = 'First name is required';
      if (!personalDetails.lastName.trim()) newErrors.lastName = 'Last name is required';
      if (!personalDetails.email.trim()) newErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(personalDetails.email)) newErrors.email = 'Email is invalid';
      
      // Updated mobile validation
      if (!personalDetails.mobile.trim()) {
        newErrors.mobile = 'Mobile number is required';
      } else {
        const mobileRegex = /^[1-9]\d{8}$/;  // 9 digits, not starting with 0
        if (!mobileRegex.test(personalDetails.mobile)) {
          newErrors.mobile = 'Mobile number must be 9 digits and not start with 0';
        }
      }
      
      if (!personalDetails.nic.trim()) newErrors.nic = 'NIC is required';
    } 
    else if (currentStep === 3) {
      if (userType === 'restaurant') {
        if (!restaurantDetails.name.trim()) newErrors.restaurantName = 'Restaurant name is required';
        if (!restaurantDetails.address.trim()) newErrors.restaurantAddress = 'Address is required';
        if (!restaurantDetails.city.trim()) newErrors.restaurantCity = 'City is required';
        if (!restaurantDetails.coverImageURL) newErrors.coverImage = 'Cover image is required';
      } else if (userType === 'rider') {
        if (!riderDetails.vehicleNumber.trim()) newErrors.vehicleNumber = 'Vehicle number is required';
        if (!riderDetails.licenseImageURL) newErrors.licenseImage = 'License image is required';
      }
    }
    else if (currentStep === 4) {
      if (!location.latitude || !location.longitude) newErrors.location = 'Please select a location';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Go to next step
  const goToNextStep = () => {
    if (validateStep()) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  // Go to previous step
  const goToPreviousStep = () => {
    setCurrentStep(currentStep - 1);
  };
  
  // Debug the input handling process
  const handlePersonalDetailsChange = (e) => {
    console.log('Input change detected:', e.target.name, e.target.value);
    const { name, value } = e.target;
    setPersonalDetails({
      ...personalDetails,
      [name]: value
    });
    console.log('Updated state:', { ...personalDetails, [name]: value });
  };
  
  // Handle restaurant details change
  const handleRestaurantDetailsChange = (e) => {
    const { name, value } = e.target;
    setRestaurantDetails({
      ...restaurantDetails,
      [name]: value
    });
  };
  
  // Handle rider details change
  const handleRiderDetailsChange = (e) => {
    const { name, value } = e.target;
    setRiderDetails({
      ...riderDetails,
      [name]: value
    });
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) {
      console.log("Form validation failed");
      return;
    }
    
    setIsSubmitting(true);
    console.log("Form validation passed, submitting...");
    
    // Prepare data for submission
    const formData = {
      userType,
      personalDetails,
      location,
      ...(userType === 'restaurant' ? { restaurantDetails } : {}),
      ...(userType === 'rider' ? { riderDetails } : {})
    };
    
    try {
      // If onSubmit prop is provided, call it with the form data
      if (typeof onSubmit === 'function') {
        console.log("Calling provided onSubmit function");
        await onSubmit(formData);
        console.log("onSubmit function completed");
        // No alerts, no navigation, no step changes
      } else {
        // Fallback for direct submission if no onSubmit prop
        console.log("No onSubmit function provided, form data:", formData);
        // No alerts, no navigation, no step changes
      }
      
      // Set submitting to false regardless
      setIsSubmitting(false);
      
    } catch (error) {
      console.error('Error submitting form:', error);
      // No alerts, just log the error
      setIsSubmitting(false);
    }
  };

  // Stepper animation variants
  const stepperVariants = {
    active: { scale: 1.1, backgroundColor: '#F57C00' },
    inactive: { scale: 1, backgroundColor: '#e2e8f0' },
    completed: { scale: 1, backgroundColor: '#4CAF50' }
  };
  
  // Form step animation variants
  const formVariants = {
    hidden: { opacity: 0, x: 100 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 }
  };

  // Render stepper component
  const renderStepper = () => (
    <div className="flex justify-center mb-8 px-4">
      <div className="flex items-center w-full max-w-3xl">
        {[1, 2, 3, 4].map((step) => (
          <React.Fragment key={step}>
            <motion.div
              className={`relative flex items-center justify-center w-10 h-10 rounded-full text-white font-medium
              ${step < currentStep ? 'bg-green-500' : step === currentStep ? 'bg-cartNumBg' : 'bg-gray-200 text-gray-600'}`}
              variants={stepperVariants}
              animate={step < currentStep ? 'completed' : step === currentStep ? 'active' : 'inactive'}
              transition={{ duration: 0.3 }}
            >
              {step < currentStep ? (
                <Check size={20} />
              ) : (
                step
              )}
            </motion.div>
            
            {step < 4 && (
              <div 
                className={`flex-1 h-1 mx-2 ${step < currentStep ? 'bg-green-500' : 'bg-gray-200'}`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
  
  // Render step title
  const renderStepTitle = () => {
    let title = "";
    
    switch(currentStep) {
      case 1:
        title = "Select User Type";
        break;
      case 2:
        title = "Personal Details";
        break;
      case 3:
        title = userType === "restaurant" ? "Restaurant Details" : "Vehicle Details";
        break;
      case 4:
        title = "Location";
        break;
      case 5:
        title = "Registration Complete";
        break;
      default:
        title = "Registration";
    }
    
    return (
      <h2 className="text-2xl font-bold text-textColor mb-6 text-center">
        {title}
      </h2>
    );
  };
  
  // Step 1: Select user type
  const renderSelectUserType = () => (
    <motion.div 
      className="w-full"
      variants={formVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col md:flex-row gap-6 justify-center">
        <div 
          className={`border-2 rounded-xl p-6 cursor-pointer transition-all duration-300 flex flex-col items-center
            ${userType === 'restaurant' ? 'border-cartNumBg bg-orange-50' : 'border-gray-200 hover:border-gray-300'}`}
          onClick={() => setUserType('restaurant')}
        >
          <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-4 
            ${userType === 'restaurant' ? 'bg-cartNumBg text-white' : 'bg-gray-100'}`}>
            <Store className="h-12 w-12" />
          </div>
          <h3 className="text-xl font-medium mb-2">Restaurant Owner</h3>
          <p className="text-gray-500 text-center">Register your restaurant and start receiving orders</p>
        </div>
        
        <div 
          className={`border-2 rounded-xl p-6 cursor-pointer transition-all duration-300 flex flex-col items-center
            ${userType === 'rider' ? 'border-cartNumBg bg-orange-50' : 'border-gray-200 hover:border-gray-300'}`}
          onClick={() => setUserType('rider')}
        >
          <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-4
            ${userType === 'rider' ? 'bg-cartNumBg text-white' : 'bg-gray-100'}`}>
            <Bike className="h-12 w-12" />
          </div>
          <h3 className="text-xl font-medium mb-2">Delivery Rider</h3>
          <p className="text-gray-500 text-center">Join as a delivery rider and start earning</p>
        </div>
      </div>
      
      {errors.userType && (
        <p className="mt-2 text-sm text-red-500 text-center">{errors.userType}</p>
      )}
    </motion.div>
  );
  
  // Step 2: Personal details - Replace all TextField components with native inputs
  const renderPersonalDetails = () => (
    <motion.div 
      className="w-full"
      variants={formVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ duration: 0.5 }}
    >
      {/* Remove debug input now that we've identified the issue */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* First Name - Native Input */}
        <div className="w-full">
          <label className="block text-sm font-medium text-textColor mb-1">
            First Name <span className="text-cartNumBg">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <User className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="firstName"
              value={personalDetails.firstName}
              onChange={handlePersonalDetailsChange}
              placeholder="Enter your first name"
              className="w-full h-11 pl-10 rounded-lg border border-gray-300 py-3 px-4 text-textColor 
                focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-200"
            />
            {errors.firstName && (
              <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>
            )}
          </div>
        </div>

        {/* Last Name - Native Input */}
        <div className="w-full">
          <label className="block text-sm font-medium text-textColor mb-1">
            Last Name <span className="text-cartNumBg">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <User className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="lastName"
              value={personalDetails.lastName}
              onChange={handlePersonalDetailsChange}
              placeholder="Enter your last name"
              className="w-full h-11 pl-10 rounded-lg border border-gray-300 py-3 px-4 text-textColor 
                focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-200"
            />
            {errors.lastName && (
              <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>
            )}
          </div>
        </div>
        
        {/* Email - Native Input */}
        <div className="w-full">
          <label className="block text-sm font-medium text-textColor mb-1">
            Email <span className="text-cartNumBg">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Mail className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="email"
              name="email"
              value={personalDetails.email}
              onChange={handlePersonalDetailsChange}
              placeholder="Enter your email"
              className="w-full h-11 pl-10 rounded-lg border border-gray-300 py-3 px-4 text-textColor 
                focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-200"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>
        </div>
        
        {/* Mobile Number - Combined with Country Code */}
        <div className="w-full">
          <label className="block text-sm font-medium text-textColor mb-1">
            Mobile Number <span className="text-cartNumBg">*</span>
          </label>
          <div className="flex">
            <div className="w-1/4">
              <CountryCodeSelector
                value={personalDetails.countryCode}
                onChange={(code) => setPersonalDetails({...personalDetails, countryCode: code})}
              />
            </div>
            <div className="w-3/4 ml-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Phone className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="tel"
                  name="mobile"
                  value={personalDetails.mobile}
                  onChange={handlePersonalDetailsChange}
                  placeholder="Mobile number"
                  className="w-full h-11 pl-10 rounded-lg border border-gray-300 py-3 px-4 text-textColor 
                    focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-200"
                />
                {errors.mobile && (
                  <p className="mt-1 text-sm text-red-500">{errors.mobile}</p>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* NIC - Native Input */}
        <div className="w-full">
          <label className="block text-sm font-medium text-textColor mb-1">
            National ID (NIC) <span className="text-cartNumBg">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              name="nic"
              value={personalDetails.nic}
              onChange={handlePersonalDetailsChange}
              placeholder="Enter your NIC number"
              className="w-full h-11 rounded-lg border border-gray-300 py-3 px-4 text-textColor 
                focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-200"
            />
            {errors.nic && (
              <p className="mt-1 text-sm text-red-500">{errors.nic}</p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );

  // Step 3 - Option 1: Restaurant details
  const renderRestaurantDetails = () => (
    <motion.div 
      className="w-full"
      variants={formVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ duration: 0.5 }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Restaurant Name - Native Input */}
        <div className="w-full">
          <label className="block text-sm font-medium text-textColor mb-1">
            Restaurant Name <span className="text-cartNumBg">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              name="name"
              value={restaurantDetails.name}
              onChange={handleRestaurantDetailsChange}
              placeholder="Enter restaurant name"
              className="w-full h-11 rounded-lg border border-gray-300 py-3 px-4 text-textColor 
                focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-200"
            />
            {errors.restaurantName && (
              <p className="mt-1 text-sm text-red-500">{errors.restaurantName}</p>
            )}
          </div>
        </div>
        
        {/* City - Native Input */}
        <div className="w-full">
          <label className="block text-sm font-medium text-textColor mb-1">
            City <span className="text-cartNumBg">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <MapPin className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="city"
              value={restaurantDetails.city}
              onChange={handleRestaurantDetailsChange}
              placeholder="Enter city"
              className="w-full h-11 pl-10 rounded-lg border border-gray-300 py-3 px-4 text-textColor 
                focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-200"
            />
            {errors.restaurantCity && (
              <p className="mt-1 text-sm text-red-500">{errors.restaurantCity}</p>
            )}
          </div>
        </div>
        
        {/* Address - Native Input (Spans two columns) */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-textColor mb-1">
            Address <span className="text-cartNumBg">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              name="address"
              value={restaurantDetails.address}
              onChange={handleRestaurantDetailsChange}
              placeholder="Enter restaurant address"
              className="w-full h-11 rounded-lg border border-gray-300 py-3 px-4 text-textColor 
                focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-200"
            />
            {errors.restaurantAddress && (
              <p className="mt-1 text-sm text-red-500">{errors.restaurantAddress}</p>
            )}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-textColor mb-1">
            Opening Time <span className="text-cartNumBg">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Clock className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="time"
              name="openingTime"
              value={restaurantDetails.openingTime}
              onChange={handleRestaurantDetailsChange}
              className="w-full h-11 pl-10 rounded-lg border border-gray-300 py-3 px-4 text-textColor 
                focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-200"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-textColor mb-1">
            Closing Time <span className="text-cartNumBg">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Clock className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="time"
              name="closingTime"
              value={restaurantDetails.closingTime}
              onChange={handleRestaurantDetailsChange}
              className="w-full h-11 pl-10 rounded-lg border border-gray-300 py-3 px-4 text-textColor 
                focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-200"
            />
          </div>
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-textColor mb-1">
            Restaurant Cover Image <span className="text-cartNumBg">*</span>
          </label>
          
          {!restaurantDetails.coverImageURL ? (
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed 
              border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-all duration-200"
              onClick={() => document.getElementById('restaurant-cover-image').click()}
            >
              <div className="space-y-1 text-center">
                <Image className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label htmlFor="restaurant-cover-image" className="relative cursor-pointer rounded-md font-medium text-blue-500 hover:text-blue-400">
                    <span>Upload a file</span>
                    <input
                      id="restaurant-cover-image"
                      name="coverImage"
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={(e) => handleFileChange(e, 'coverImage')}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
              </div>
            </div>
          ) : (
            <div className="relative mt-2">
              <img 
                src={restaurantDetails.coverImageURL}
                alt="Restaurant cover" 
                className="w-full h-48 object-cover rounded-lg"
              />
              <button
                type="button"
                className="absolute top-2 right-2 bg-red-500 rounded-full p-1 text-white hover:bg-red-600 transition-all"
                onClick={() => removeUploadedImage('coverImage')}
              >
                <X size={16} />
              </button>
            </div>
          )}
          
          {restaurantDetails.isUploading && (
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
              <div 
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
                style={{width: `${restaurantDetails.coverImageProgress}%`}}
              ></div>
            </div>
          )}
          
          {errors.coverImage && (
            <p className="mt-1 text-sm text-red-500">{errors.coverImage}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
  
  // Step 3 - Option 2: Rider details
  const renderRiderDetails = () => (
    <motion.div 
      className="w-full"
      variants={formVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ duration: 0.5 }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-textColor mb-1">
            Vehicle Type <span className="text-cartNumBg">*</span>
          </label>
          <select
            name="vehicleType"
            value={riderDetails.vehicleType}
            onChange={handleRiderDetailsChange}
            className="w-full h-11 rounded-lg border border-gray-300 py-3 px-4 text-textColor bg-white
              focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-200"
          >
            <option value="motorcycle">Motorcycle</option>
            <option value="bicycle">Bicycle</option>
            <option value="car">Car</option>
            <option value="van">Van</option>
          </select>
        </div>
        
        {/* Vehicle Number - Native Input */}
        <div className="w-full">
          <label className="block text-sm font-medium text-textColor mb-1">
            Vehicle Number <span className="text-cartNumBg">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              name="vehicleNumber"
              value={riderDetails.vehicleNumber}
              onChange={handleRiderDetailsChange}
              placeholder="Enter vehicle number"
              className="w-full h-11 rounded-lg border border-gray-300 py-3 px-4 text-textColor 
                focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-200"
            />
            {errors.vehicleNumber && (
              <p className="mt-1 text-sm text-red-500">{errors.vehicleNumber}</p>
            )}
          </div>
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-textColor mb-1">
            Driving License Image <span className="text-cartNumBg">*</span>
          </label>
          
          {!riderDetails.licenseImageURL ? (
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed 
              border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-all duration-200"
              onClick={() => document.getElementById('license-image').click()}
            >
              <div className="space-y-1 text-center">
                <Image className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label htmlFor="license-image" className="relative cursor-pointer rounded-md font-medium text-blue-500 hover:text-blue-400">
                    <span>Upload a file</span>
                    <input
                      id="license-image"
                      name="licenseImage"
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={(e) => handleFileChange(e, 'licenseImage')}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
              </div>
            </div>
          ) : (
            <div className="relative mt-2">
              <img 
                src={riderDetails.licenseImageURL}
                alt="License" 
                className="w-full h-48 object-cover rounded-lg"
              />
              <button
                type="button"
                className="absolute top-2 right-2 bg-red-500 rounded-full p-1 text-white hover:bg-red-600 transition-all"
                onClick={() => removeUploadedImage('licenseImage')}
              >
                <X size={16} />
              </button>
            </div>
          )}
          
          {riderDetails.isUploading && (
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
              <div 
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
                style={{width: `${riderDetails.licenseImageProgress}%`}}
              ></div>
            </div>
          )}
          
          {errors.licenseImage && (
            <p className="mt-1 text-sm text-red-500">{errors.licenseImage}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
  
  // Step 4: Location
  const renderLocationStep = () => (
    <motion.div 
      className="w-full"
      variants={formVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ duration: 0.5 }}
    >
      <div className="space-y-6">
        <p className="text-gray-600">
          Please select your {userType === 'restaurant' ? 'restaurant' : 'preferred service area'} location on the map.
          Use the search box or drag the map to find the exact location.
        </p>
        
        <div className="relative h-96 w-full border rounded-lg overflow-hidden">
          <MapComponent
            mapCenter={mapCenter}
            setMapCenter={setMapCenter}
            markerPosition={markerPosition}
            setMarkerPosition={setMarkerPosition}
            handleMapClick={handleMapClick}
            handleMarkerDragEnd={handleMarkerDragEnd}
            getCurrentLocation={getCurrentLocation}
            isLocating={isLocating}
            loadError={loadError}
            isLoaded={isLoaded}
            searchBoxRef={searchBoxRef}
            onPlacesChanged={onPlacesChanged}
            mapContainerStyle={{ height: '100%', width: '100%' }}
          />
        </div>
        
        {errors.location && (
          <p className="text-sm text-red-500">{errors.location}</p>
        )}
        
        <div>
          <p className="text-sm text-gray-600">
            <strong>Selected Coordinates:</strong> {location.latitude?.toFixed(6)}, {location.longitude?.toFixed(6)}
          </p>
          {location.address && (
            <p className="text-sm text-gray-600 mt-1">
              <strong>Address:</strong> {location.address}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
  
  // Step 5: Completion - Updated to remove navigation
  const renderCompletionStep = () => (
    <motion.div 
      className="w-full text-center"
      variants={formVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ duration: 0.5 }}
    >
      <div className="mb-8">
        <div className="flex justify-center">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
            <Check className="w-12 h-12 text-green-500" />
          </div>
        </div>
        <h3 className="text-2xl font-bold mt-4 mb-2">Registration Complete!</h3>
        <p className="text-gray-600 mb-4">
          Your registration has been submitted successfully.
        </p>
        {/* Login button removed */}
      </div>
    </motion.div>
  );
  
  // Render current step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderSelectUserType();
      case 2:
        return renderPersonalDetails();
      case 3:
        return userType === 'restaurant' ? renderRestaurantDetails() : renderRiderDetails();
      case 4:
        return renderLocationStep();
      case 5:
        return renderCompletionStep();
      default:
        return null;
    }
  };
  
  // Render navigation buttons
  const renderNavigationButtons = () => {
    if (currentStep === 5) return null;
    
    return (
      <div className="flex justify-between mt-8">
        {currentStep > 1 ? (
          <Button
            type="button"
            variant="outline"
            onClick={goToPreviousStep}
            className="px-6"
            icon={ChevronLeft}
          >
            Back
          </Button>
        ) : (
          <div /> // Empty div to maintain flex spacing
        )}
        
        {currentStep < 5 ? (
          <Button
            type="button"
            variant="primary"
            onClick={currentStep === 4 ? handleSubmit : goToNextStep}
            className="px-6"
            disabled={
              (currentStep === 3 && userType === 'restaurant' && restaurantDetails.isUploading) || 
              (currentStep === 3 && userType === 'rider' && riderDetails.isUploading) ||
              isSubmitting || isLoading
            }
            icon={currentStep === 4 ? null : ChevronRight}
          >
            {currentStep === 4 ? (isSubmitting || isLoading ? 'Submitting...' : 'Submit') : 'Next'}
          </Button>
        ) : null}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md p-6 md:p-8">
        {renderStepper()}
        {renderStepTitle()}
        
        {/* Replace <form> with <div> to avoid form submission issues */}
        <div>
          {renderStepContent()}
          {renderNavigationButtons()}
        </div>
      </div>
    </div>
  );
};

RegistrationForm.defaultProps = {
  onSubmit: null,
  isLoading: false
};

export default RegistrationForm;
