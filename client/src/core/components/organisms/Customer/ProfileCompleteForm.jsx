import React, { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  MapPin,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
} from "lucide-react";
import { useJsApiLoader } from "@react-google-maps/api";
import Button from "../../atoms/Button";
import CountryCodeSelector from "../../atoms/CountryCodeSelector";
import MapComponent from "../../molecules/MapComponent";
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const LIBRARIES = ["places"];

const mapContainerStyle = {
  width: "100%",
  height: "400px",
  minHeight: "400px",
  borderRadius: "0.375rem",
  backgroundColor: "#f1f1f1",
  position: "relative",
};

const ProfileCompleteForm = ({ initialData = {}, onSubmit, onSkip }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    name: initialData.name || "",
    email: initialData.email || "",
    countryCode: initialData.countryCode || "+94",
    phone: initialData.phone || "",
    mobile: initialData.mobile || "",
    address: initialData.address || "",
    postalCode: initialData.postalCode || "",
    location: initialData.location || { latitude: 6.9271, longitude: 79.8612 },
    secondaryAddresses: initialData.secondaryAddresses || [],
    paymentMethods: initialData.paymentMethods || [],
  });

  const [errors, setErrors] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState("");

  // Google Maps API loader
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: LIBRARIES,
  });

  // Map and marker state
  const [mapCenter, setMapCenter] = useState({
    lat: formData.location.latitude,
    lng: formData.location.longitude,
  });
  const [markerPosition, setMarkerPosition] = useState({
    lat: formData.location.latitude,
    lng: formData.location.longitude,
  });

  // SearchBox refs
  const searchBoxRef = useRef(null);

  // Update marker and center when formData.location changes
  React.useEffect(() => {
    if (formData.location) {
      setMapCenter({
        lat: formData.location.latitude,
        lng: formData.location.longitude,
      });
      setMarkerPosition({
        lat: formData.location.latitude,
        lng: formData.location.longitude,
      });
    }
  }, [formData.location]);

  // Show user's current location on initial mount
  useEffect(() => {
    if (
      initialData.location &&
      initialData.location.latitude &&
      initialData.location.longitude
    )
      return;
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setMapCenter({ lat: latitude, lng: longitude });
        setMarkerPosition({ lat: latitude, lng: longitude });
        setFormData((prev) => ({
          ...prev,
          location: { latitude, longitude },
        }));
      },
      () => {
        // If denied or failed, fallback to default (already set)
      }
    );
    // eslint-disable-next-line
  }, []);

  // Reverse geocode helper
  const fetchAddressFromCoordinates = useCallback((lat, lng) => {
    if (!window.google) return;
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === "OK" && results && results.length > 0) {
        setFormData((prev) => ({
          ...prev,
          address: results[0].formatted_address,
        }));
      }
    });
  }, []);

  // Map click handler
  const handleMapClick = useCallback(
    (event) => {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      setMarkerPosition({ lat, lng });
      setFormData((prev) => ({
        ...prev,
        location: { latitude: lat, longitude: lng },
      }));
      fetchAddressFromCoordinates(lat, lng);
    },
    [fetchAddressFromCoordinates]
  );

  // Marker drag handler
  const handleMarkerDragEnd = useCallback(
    (event) => {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      setMarkerPosition({ lat, lng });
      setFormData((prev) => ({
        ...prev,
        location: { latitude: lat, longitude: lng },
      }));
      fetchAddressFromCoordinates(lat, lng);
    },
    [fetchAddressFromCoordinates]
  );

  // Current location button handler
  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      return;
    }
    setIsLocating(true);
    setLocationError("");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setMapCenter({ lat: latitude, lng: longitude });
        setMarkerPosition({ lat, lng: longitude });
        setFormData((prev) => ({
          ...prev,
          location: { latitude, longitude },
        }));
        fetchAddressFromCoordinates(latitude, longitude);
        setIsLocating(false);
      },
      (error) => {
        setIsLocating(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError(
              "Location access was denied. Please enable location services in your browser settings."
            );
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError(
              "Location information is unavailable at this time."
            );
            break;
          case error.TIMEOUT:
            setLocationError(
              "Request to get location timed out. Please try again."
            );
            break;
          default:
            setLocationError(
              "An unknown error occurred while trying to retrieve your location."
            );
            break;
        }
        setTimeout(() => setLocationError(""), 6000);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, [fetchAddressFromCoordinates]);

  // SearchBox place select handler
  const onPlacesChanged = useCallback(() => {
    const places = searchBoxRef.current.getPlaces();
    if (places && places.length > 0) {
      const place = places[0];
      if (place.geometry && place.geometry.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        setMapCenter({ lat, lng });
        setMarkerPosition({ lat, lng });
        setFormData((prev) => ({
          ...prev,
          address: place.formatted_address || "",
          location: { latitude: lat, longitude: lng },
        }));
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Field ${name} changing to: ${value}`); // Debug log
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/[^0-9]/g, "");
    if (value.startsWith("0")) {
      value = value.substring(1);
    }

    if (value.length > 9) {
      value = value.slice(0, 9);
    }
    setFormData((prev) => ({
      ...prev,
      phone: value,
    }));
  };

  const handleCountryCodeChange = (code) => {
    setFormData((prev) => ({
      ...prev,
      countryCode: code,
    }));
  };

  const handleLocationChange = (lat, lng) => {
    setFormData((prev) => ({
      ...prev,
      location: {
        latitude: lat,
        longitude: lng,
      },
    }));
    // Fetch address when manually selecting a location
    fetchAddressFromCoordinates(lat, lng);
  };

  const searchLocation = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address: searchQuery }, (results, status) => {
        if (status === "OK" && results.length > 0) {
          setSearchResults(
            results.map((result) => ({
              id: result.place_id,
              place_name: result.formatted_address,
              geometry: result.geometry,
            }))
          );
        } else {
          setSearchResults([]);
        }
        setIsSearching(false);
      });
    } catch (error) {
      console.error("Error searching location:", error);
      setIsSearching(false);
    }
  };

  const selectSearchResult = (result) => {
    const location = result.geometry.location;
    const lat = location.lat();
    const lng = location.lng();

    setFormData((prev) => ({
      ...prev,
      address: result.place_name,
      location: { latitude: lat, longitude: lng },
    }));

    if (googleMapRef.current && markerRef.current) {
      const position = new window.google.maps.LatLng(lat, lng);
      googleMapRef.current.setCenter(position);
      googleMapRef.current.setZoom(15);
      markerRef.current.setPosition(position);
    }
    setSearchQuery("");
  };

  const addSecondaryAddress = () => {
    setFormData((prev) => ({
      ...prev,
      secondaryAddresses: [
        ...prev.secondaryAddresses,
        { id: Date.now(), name: "", address: "" },
      ],
    }));
  };

  const updateSecondaryAddress = (id, field, value) => {
    setFormData((prev) => ({
      ...prev,
      secondaryAddresses: prev.secondaryAddresses.map((addr) =>
        addr.id === id ? { ...addr, [field]: value } : addr
      ),
    }));
  };

  const removeSecondaryAddress = (id) => {
    setFormData((prev) => ({
      ...prev,
      secondaryAddresses: prev.secondaryAddresses.filter(
        (addr) => addr.id !== id
      ),
    }));
  };

  const addPaymentMethod = () => {
    setFormData((prev) => ({
      ...prev,
      paymentMethods: [
        ...prev.paymentMethods,
        {
          id: Date.now(),
          type: "card",
          cardNumber: "",
          cardName: "",
          expiry: "",
          cvv: "",
        },
      ],
    }));
  };

  const updatePaymentMethod = (id, field, value) => {
    setFormData((prev) => ({
      ...prev,
      paymentMethods: prev.paymentMethods.map((method) =>
        method.id === id ? { ...method, [field]: value } : method
      ),
    }));
  };

  const removePaymentMethod = (id) => {
    setFormData((prev) => ({
      ...prev,
      paymentMethods: prev.paymentMethods.filter((method) => method.id !== id),
    }));
  };

  const validateStep = (step) => {
    const newErrors = {};
    if (step === 0) {
      if (!formData.name) newErrors.name = "Name is required";
      if (!formData.phone) {
        newErrors.phone = "Phone number is required";
      } else if (formData.phone.length !== 9) {
        newErrors.phone = "Phone number must be exactly 9 digits";
      } else if (formData.phone.startsWith("0")) {
        newErrors.phone = "Phone number should not start with 0";
      }
      if (!formData.email) newErrors.email = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(formData.email))
        newErrors.email = "Email is invalid";
      if (!formData.address) newErrors.address = "Address is required";
      if (!formData.postalCode)
        newErrors.postalCode = "Postal code is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Define steps array first, before any references to it
  const steps = [
    {
      title: "Basic Info",
      icon: (
        <div className="w-6 h-6 rounded-full bg-cartNumBg text-white flex items-center justify-center text-xs">
          1
        </div>
      ),
      content: (
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-textColor mb-1">
              Full Name <span className="text-cartNumBg">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="w-full h-11 px-2 py-1.5 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cartNumBg focus:border-cartNumBg"
            />
            {errors.name && (
              <p className="mt-0.5 text-xs text-red-600">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-textColor mb-1">
              Phone Number <span className="text-cartNumBg">*</span>
            </label>
            <div className="flex gap-1">
              <div className="w-32 h-11">
                <CountryCodeSelector
                  value={formData.countryCode}
                  onChange={handleCountryCodeChange}
                />
              </div>
              <div className="flex-1">
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  placeholder="Phone number"
                  className="w-full h-11 px-2 py-1.5 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cartNumBg focus:border-cartNumBg"
                />
                {errors.phone && (
                  <p className="mt-0.5 text-xs text-red-600">{errors.phone}</p>
                )}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-textColor mb-1">
              Email Address <span className="text-cartNumBg">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full h-11 px-2 py-1.5 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cartNumBg focus:border-cartNumBg"
            />
            {errors.email && (
              <p className="mt-0.5 text-xs text-red-600">{errors.email}</p>
            )}
          </div>

          <div className="flex gap-2">
            <div className="w-2/3">
              <label className="block text-xs font-medium text-textColor mb-1">
                Address <span className="text-cartNumBg">*</span>
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter your address"
                className="w-full h-11 px-2 py-1.5 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cartNumBg focus:border-cartNumBg"
              />
              {errors.address && (
                <p className="mt-0.5 text-xs text-red-600">{errors.address}</p>
              )}
            </div>

            <div className="w-1/3">
              <label className="block text-xs font-medium text-textColor mb-1">
                Postal Code <span className="text-cartNumBg">*</span>
              </label>
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                placeholder="Postal code"
                className="w-full h-11 px-2 py-1.5 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cartNumBg focus:border-cartNumBg"
              />
              {errors.postalCode && (
                <p className="mt-0.5 text-xs text-red-600">
                  {errors.postalCode}
                </p>
              )}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Location",
      icon: <MapPin className="w-4 h-4 text-white" />,
      content: (
        <div className="space-y-3" key="location-step">
          {locationError && (
            <div className="p-2 bg-red-50 text-red-700 rounded-md mb-2 text-xs">
              {locationError}
            </div>
          )}
          <div className="h-[320px] rounded-lg overflow-hidden border border-gray-300 relative">
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
              mapContainerStyle={{
                ...mapContainerStyle,
                height: "320px",
                minHeight: "320px",
              }}
            />
          </div>
          <div className="p-2 bg-blue-50 rounded-md text-xs">
            <p className="text-gray-700">
              <strong>Coordinates:</strong> Lat:{" "}
              {(formData.location?.latitude || 0).toFixed(6)}, Lng:{" "}
              {(formData.location?.longitude || 0).toFixed(6)}
            </p>
            <p className="text-gray-500 mt-1">
              Drag pin, click map, search, or use "Current Location" button
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "Details",
      icon: <CreditCard className="w-4 h-4 text-white" />,
      content: (
        <div className="space-y-4 overflow-auto max-h-[320px] pr-1">
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium text-gray-900">
                Secondary Addresses (Optional)
              </h3>
              <button
                type="button"
                onClick={addSecondaryAddress}
                className="flex items-center text-xs text-cartNumBg hover:text-orange-600"
              >
                <Plus size={12} className="mr-1" /> Add Address
              </button>
            </div>
            {formData.secondaryAddresses.length === 0 ? (
              <p className="text-xs text-gray-500 italic">
                No secondary addresses added
              </p>
            ) : (
              <div className="space-y-2">
                {formData.secondaryAddresses.map((address, index) => (
                  <div
                    key={address.id}
                    className="p-2 border border-gray-200 rounded-md"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-xs font-medium">
                        Address {index + 1}
                      </h4>
                      <button
                        type="button"
                        onClick={() => removeSecondaryAddress(address.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Address Name
                        </label>
                        <input
                          type="text"
                          value={address.name}
                          onChange={(e) =>
                            updateSecondaryAddress(
                              address.id,
                              "name",
                              e.target.value
                            )
                          }
                          placeholder="Home, Work, etc."
                          className="w-full px-2 py-1 text-xs border border-gray-300 rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Full Address
                        </label>
                        <input
                          type="text"
                          value={address.address}
                          onChange={(e) =>
                            updateSecondaryAddress(
                              address.id,
                              "address",
                              e.target.value
                            )
                          }
                          placeholder="Enter complete address"
                          className="w-full px-2 py-1 text-xs border border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium text-gray-900">
                Payment Methods (Optional)
              </h3>
              <button
                type="button"
                onClick={addPaymentMethod}
                className="flex items-center text-xs text-cartNumBg hover:text-orange-600"
              >
                <Plus size={12} className="mr-1" /> Add Payment
              </button>
            </div>

            {formData.paymentMethods.length === 0 ? (
              <p className="text-xs text-gray-500 italic">
                No payment methods added
              </p>
            ) : (
              <div className="space-y-2">
                {formData.paymentMethods.map((method, index) => (
                  <div
                    key={method.id}
                    className="p-2 border border-gray-200 rounded-md"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-xs font-medium">
                        Payment Method {index + 1}
                      </h4>
                      <button
                        type="button"
                        onClick={() => removePaymentMethod(method.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Card Number
                        </label>
                        <input
                          type="text"
                          value={method.cardNumber}
                          onChange={(e) =>
                            updatePaymentMethod(
                              method.id,
                              "cardNumber",
                              e.target.value
                            )
                          }
                          placeholder="•••• •••• •••• ••••"
                          className="w-full px-2 py-1 text-xs border border-gray-300 rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Name on Card
                        </label>
                        <input
                          type="text"
                          value={method.cardName}
                          onChange={(e) =>
                            updatePaymentMethod(
                              method.id,
                              "cardName",
                              e.target.value
                            )
                          }
                          placeholder="John Doe"
                          className="w-full px-2 py-1 text-xs border border-gray-300 rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          value={method.expiry}
                          onChange={(e) =>
                            updatePaymentMethod(
                              method.id,
                              "expiry",
                              e.target.value
                            )
                          }
                          placeholder="MM/YY"
                          className="w-full px-2 py-1 text-xs border border-gray-300 rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          CVV
                        </label>
                        <input
                          type="password"
                          value={method.cvv}
                          onChange={(e) =>
                            updatePaymentMethod(
                              method.id,
                              "cvv",
                              e.target.value
                            )
                          }
                          placeholder="•••"
                          className="w-full px-2 py-1 text-xs border border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ),
    },
  ];

  const nextStep = () => {
    if (validateStep(currentStep)) {
      // Add a safety check when moving from map step (index 1) to final step
      if (currentStep === 1) {
        console.log(
          "Moving from map to final step - ensuring no auto-submission"
        );
        // Set a small delay to ensure DOM updates properly before changing steps
        setTimeout(() => {
          setCurrentStep((prev) => prev + 1);
        }, 50);
      } else {
        setCurrentStep((prev) => prev + 1);
      }
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  // Use a separate state to track if the form is being submitted
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Add a state to prevent accidental submission
  const [lastStepEntered, setLastStepEntered] = useState(false);

  // Effect to set a flag when entering the last step
  // This prevents accidental immediate submission
  useEffect(() => {
    if (currentStep === steps.length - 1) {
      setLastStepEntered(true);

      // Safety mechanism: ensure submit isn't triggered accidentally
      const timer = setTimeout(() => {
        console.log("Last step fully loaded");
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [currentStep, steps.length]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Only allow submission if we're on the last step and the "lastStepEntered" flag is true
    if (currentStep === steps.length - 1 && lastStepEntered && !isSubmitting) {
      if (validateStep(currentStep)) {
        console.log("Form submission initiated by user");
        setIsSubmitting(true); // Set submitting state to true
        const submissionData = {
          ...formData,
          mobile: formData.countryCode.replace("+", "") + formData.phone, // Format as "94740437570"
        };
        // Use setTimeout to prevent immediate unmounting
        setTimeout(() => {
          onSubmit(submissionData);
        }, 100);
      }
    } else {
      console.log("Prevented accidental form submission");
      e.stopPropagation();
    }
  };

  // Animation variants - Modified to prevent issues with component unmounting
  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 500 : -500,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction < 0 ? 500 : -500,
      opacity: 0,
    }),
  };

  // Button animations
  const buttonVariants = {
    hover: {
      scale: 1.05,
      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
      transition: { duration: 0.2 },
    },
    tap: {
      scale: 0.95,
      boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
      transition: { duration: 0.1 },
    },
  };

  return (
    <div className="h-[70vh] max-h-[600px] flex flex-col p-3">
      {/* Compact progress indicator */}
      <div className="flex justify-between items-center mb-2 px-1">
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            <div className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                  index < currentStep
                    ? "bg-green-100 text-green-600 border border-green-600"
                    : index === currentStep
                    ? "bg-cartNumBg text-white"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {index < currentStep ? <Check size={14} /> : step.icon}
              </div>
              <span className="ml-1 text-xs font-medium hidden sm:inline">
                {step.title}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-[2px] mx-1 ${
                  index < currentStep
                    ? "bg-gradient-to-r from-cartNumBg to-green-500"
                    : "bg-gray-200"
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Form container */}
      <form
        onSubmit={handleSubmit}
        onKeyDown={(e) => {
          if (e.key === "Enter" && currentStep < steps.length - 1) {
            e.preventDefault();
          }
        }}
        className="flex-1 flex flex-col"
      >
        {/* Content area */}
        <div className="flex-1 overflow-auto bg-gray-50 rounded-md p-3">
          <AnimatePresence mode="wait" initial={false} custom={currentStep}>
            <motion.div
              key={currentStep}
              custom={currentStep}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              {steps[currentStep].content}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Simple divider */}
        <div className="my-2 border-t border-gray-200"></div>

        {/* Button area */}
        <div className="flex justify-between">
          {currentStep > 0 ? (
            <motion.div
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              className="w-[48%]"
            >
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                icon={ChevronLeft}
                className="w-full h-8 text-xs bg-white border text-gray-600 hover:bg-gray-50"
              >
                Back
              </Button>
            </motion.div>
          ) : (
            <motion.div
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              className="w-[48%]"
            >
              <Button
                type="button"
                onClick={onSkip}
                className="w-full h-8 text-xs bg-white border text-gray-500 hover:bg-gray-50"
              >
                Skip
              </Button>
            </motion.div>
          )}

          {currentStep < steps.length - 1 ? (
            <motion.div
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              className="w-[48%]"
            >
              <Button
                type="button"
                onClick={nextStep}
                icon={ChevronRight}
                iconPosition="right"
                className="w-full h-8 text-xs bg-cartNumBg hover:bg-orange-600 text-white"
              >
                Next
              </Button>
            </motion.div>
          ) : (
            <motion.div
              variants={buttonVariants}
              whileHover={isSubmitting ? {} : "hover"}
              whileTap={isSubmitting ? {} : "tap"}
              className="w-[48%]"
            >
              <Button
                type="submit"
                variant="primary"
                icon={isSubmitting ? null : Check}
                disabled={isSubmitting}
                className={`w-full h-8 text-xs ${
                  isSubmitting
                    ? "bg-green-500"
                    : "bg-cartNumBg hover:bg-orange-600"
                } text-white`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="w-3 h-3 mr-1 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </div>
                ) : (
                  "Complete"
                )}
              </Button>
            </motion.div>
          )}
        </div>
      </form>
    </div>
  );
};

export default ProfileCompleteForm;
