import React, { useState, useEffect, useRef } from "react";
import { X, Upload, DollarSign, Check, AlertCircle, ChevronDown, Image } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import menuService from "../services/menuservice";
import { storage } from "../../../core/utils/firebaseStorage"; // Updated import path
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const AddMenuPopup = ({ isOpen, onClose, onSubmit, resturentid }) => {
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    categoryName: "",
    availability: true,
    imageUrl: "",
  });

  // Error state for validations
  const [errors, setErrors] = useState({});
  // Preview image state
  const [imagePreview, setImagePreview] = useState(null);
  // Category dropdown state
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isLoadingCategory, setIsLoadingCategory] = useState(false);
  const dropdownRef = useRef(null);
  
  // Upload state
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  // Reset form when closed
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        name: "",
        description: "",
        price: "",
        categoryName: "",
        availability: true,
        imageUrl: "",
      });
      setErrors({});
      setImagePreview(null);
      setIsDropdownOpen(false);
      setUploadProgress(0);
      setIsUploading(false);
    }
  }, [isOpen]);
  
  // Fetch categories when component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const result = await menuService.getCategoryByRestaurantId(resturentid);
        // Access the nested categories array in the response
        console.log("Fetched categories:", result);
        
        if (result && result.data && result.data.categories) {
          setCategories(result.data.categories);
          setFilteredCategories(result.data.categories);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen, resturentid]);

  // Initialize filtered categories
  useEffect(() => {
    if (categories) {
      setFilteredCategories(categories);
    }
  }, [categories]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }
  };

  // Handle category input
  const handleCategoryInputChange = (e) => {
    const value = e.target.value;
    setFormData({
      ...formData,
      categoryName: value,
    });
    
    // Filter categories based on input
    if (value.trim() !== "") {
      const filtered = categories.filter(category => 
        category.categoryName.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredCategories(filtered);
      setIsCreatingCategory(filtered.length === 0);
    } else {
      setFilteredCategories(categories);
      setIsCreatingCategory(false);
    }
    
    setIsDropdownOpen(true);
    
    // Clear error
    if (errors.categoryName) {
      setErrors({
        ...errors,
        categoryName: null,
      });
    }
  };

  // Select from dropdown
  const selectCategory = (category) => {
    setFormData({
      ...formData,
      categoryName: category.categoryName,
    });
    setIsDropdownOpen(false);
    setIsCreatingCategory(false);
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      uploadImageToFirebase(file);
    }
  };

  // Firebase image upload
  const uploadImageToFirebase = (file) => {
    if (!file) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    
    // Create a preview immediately
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
    
    // Create a reference to the storage location
    const fileName = `menu-items/${Date.now()}-${file.name}`;
    const storageRef = ref(storage, fileName);
    
    // Upload the file
    const uploadTask = uploadBytesResumable(storageRef, file);
    
    // Monitor upload progress
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setUploadProgress(progress);
      },
      (error) => {
        console.error("Upload failed:", error);
        setIsUploading(false);
        setErrors({...errors, imageUrl: "Failed to upload image"});
      },
      () => {
        // Upload completed, get download URL
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({
            ...formData,
            imageUrl: downloadURL,
          });
          setIsUploading(false);
        });
      }
    );
  };

  // Handle drag and drop
  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      uploadImageToFirebase(e.dataTransfer.files[0]);
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!formData.price || isNaN(formData.price) || Number(formData.price) <= 0) {
      newErrors.price = "Valid price is required";
    }
    
    if (!formData.categoryName) {
      newErrors.categoryName = "Category is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Create new category
  const createNewCategory = async (categoryName) => {
    setIsLoadingCategory(true);
    try {
      const result = await menuService.createCategory({ 
        categoryName: categoryName,
        restaurantId: resturentid
      });
      
      if (result.success && result.data) {
        // Update the categories list with the new category
        const newCategory = result.data;
        setCategories(prevCategories => [...prevCategories, newCategory]);
        setFilteredCategories(prevFiltered => [...prevFiltered, newCategory]);
        setIsCreatingCategory(false);
        
        // Update form data with the new category
        setFormData(prevData => ({
          ...prevData,
          categoryName: newCategory.categoryName
        }));
        
        // Close the dropdown to refresh UI state
        setIsDropdownOpen(false);
        
        // Reopen dropdown after a small delay to show updated list with selection
        setTimeout(() => {
          setIsDropdownOpen(true);
        }, 100);
        
        return newCategory;
      }
      return null;
    } catch (error) {
      console.error("Failed to create category:", error);
      return null;
    } finally {
      setIsLoadingCategory(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // If creating a new category
      if (isCreatingCategory && formData.categoryName) {
        const newCategory = await createNewCategory(formData.categoryName);
        if (newCategory) {
          // The formData has already been updated in createNewCategory
          onSubmit({
            ...formData,
            price: Number(formData.price),
          });
        } else {
          setErrors({
            ...errors,
            categoryName: "Failed to create new category",
          });
        }
      } else {
        onSubmit({
          ...formData,
          price: Number(formData.price),
        });
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black bg-opacity-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-4xl p-6 mx-4 bg-primary rounded-lg shadow-xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-headingColor">Add New Menu Item</h2>
              <button
                onClick={onClose}
                className="p-1 text-textColor transition-colors rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-cartNumBg"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column - Image Upload */}
              <div className="flex flex-col space-y-4">
                <div 
                  className={`relative flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg transition-all duration-300 h-80
                    ${dragOver ? 'border-cartNumBg bg-red-50' : 'border-lighttextGray hover:border-cartNumBg'}
                    ${imagePreview ? 'bg-black/5' : 'bg-blue-50/30'}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {imagePreview ? (
                    <div className="relative w-full h-full mb-2">
                      <img
                        src={imagePreview}
                        alt="Food preview"
                        className="object-cover w-full h-full rounded-md"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-md">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setImagePreview(null);
                            setFormData({ ...formData, imageUrl: "" });
                          }}
                          className="p-1.5 bg-white rounded-full shadow-md hover:bg-gray-100"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center w-full h-full text-lighttextGray select-none cursor-pointer">
                      <Image className="w-16 h-16 mb-2 text-cartBg opacity-80" />
                      <p className="text-lg font-medium text-cartBg/80">
                        {dragOver ? "Drop image here" : "Click or drag to upload"}
                      </p>
                      <p className="text-sm mt-2 text-center text-gray-500">Recommended: 500x500px</p>
                    </div>
                  )}
                  
                  {isUploading && (
                    <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-90 p-3 rounded-b-lg">
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-cartNumBg transition-all duration-300 rounded-full"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-center mt-1 font-medium">
                        Uploading... {uploadProgress}%
                      </p>
                    </div>
                  )}
                  
                  <input
                    type="file"
                    id="imageUrl"
                    name="imageUrl"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
                {!imagePreview ? (
                  <label
                    htmlFor="imageUrl"
                    className="w-full py-3 text-base font-medium text-center text-white transition-colors bg-cartNumBg rounded-md cursor-pointer hover:bg-red-700 flex items-center justify-center gap-2"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload size={18} /> Choose Image
                  </label>
                ) : (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex-1 py-3 text-base font-medium text-center transition-colors bg-gray-100 text-textColor rounded-md cursor-pointer hover:bg-gray-200"
                    >
                      Change Image
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null);
                        setFormData({ ...formData, imageUrl: "" });
                      }}
                      className="py-3 px-4 text-base font-medium text-center text-white transition-colors bg-cartNumBg rounded-md cursor-pointer hover:bg-red-700"
                    >
                      <X size={18} />
                    </button>
                  </div>
                )}
              </div>

              {/* Right Column - Form Fields */}
              <div className="flex flex-col space-y-4">
                {/* Name Input */}
                <div>
                  <label htmlFor="name" className="block mb-2 text-sm font-medium text-headingColor">
                    Item Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 bg-card border rounded-md focus:outline-none focus:ring-2 transition-all ${
                      errors.name ? "border-cartNumBg focus:ring-cartNumBg" : "border-lighttextGray focus:ring-cartBg"
                    }`}
                    placeholder="Enter item name"
                  />
                  {errors.name && (
                    <p className="flex items-center mt-1 text-xs text-cartNumBg">
                      <AlertCircle size={12} className="mr-1" /> {errors.name}
                    </p>
                  )}
                </div>

                {/* Description Input */}
                <div>
                  <label htmlFor="description" className="block mb-2 text-sm font-medium text-headingColor">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-2.5 bg-card border border-lighttextGray rounded-md focus:outline-none focus:ring-2 focus:ring-cartBg transition-all"
                    placeholder="Describe this menu item"
                  ></textarea>
                </div>

                {/* Price Input */}
                <div>
                  <label htmlFor="price" className="block mb-2 text-sm font-medium text-headingColor">
                    Price *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <DollarSign size={16} className="text-lighttextGray" />
                    </div>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-2.5 bg-card border rounded-md focus:outline-none focus:ring-2 transition-all ${
                        errors.price ? "border-cartNumBg focus:ring-cartNumBg" : "border-lighttextGray focus:ring-cartBg"
                      }`}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                    />
                  </div>
                  {errors.price && (
                    <p className="flex items-center mt-1 text-xs text-cartNumBg">
                      <AlertCircle size={12} className="mr-1" /> {errors.price}
                    </p>
                  )}
                </div>

                {/* Category Combo Box */}
                <div>
                  <label htmlFor="categoryName" className="block mb-2 text-sm font-medium text-headingColor">
                    Category *
                  </label>
                  <div className="relative" ref={dropdownRef}>
                    <div className="flex items-center">
                      <input
                        type="text"
                        id="categoryName"
                        name="categoryName"
                        value={formData.categoryName}
                        onChange={handleCategoryInputChange}
                        onClick={() => setIsDropdownOpen(true)}
                        placeholder="Select or type a category"
                        className={`w-full px-4 py-2.5 bg-card border rounded-md focus:outline-none focus:ring-2 transition-all ${
                          errors.categoryName ? "border-cartNumBg focus:ring-cartNumBg" : "border-lighttextGray focus:ring-cartBg"
                        }`}
                      />
                      <button 
                        type="button"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      >
                        <ChevronDown size={18} className="text-gray-500" />
                      </button>
                    </div>
                    
                    {/* Dropdown menu */}
                    {isDropdownOpen && (
                      <div className="absolute z-10 w-full mt-1 bg-white shadow-lg rounded-md max-h-60 overflow-y-auto border border-gray-200">
                        {filteredCategories.length > 0 ? (
                          filteredCategories.map((category) => (
                            <div
                              key={category._id}
                              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => selectCategory(category)}
                            >
                              {category.categoryName}
                            </div>
                          ))
                        ) : (
                          <div className="px-4 py-2 text-sm text-gray-600 italic">
                            {isCreatingCategory && formData.categoryName 
                              ? `Create new category: "${formData.categoryName}"` 
                              : "No categories found"}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  {errors.categoryName && (
                    <p className="flex items-center mt-1 text-xs text-cartNumBg">
                      <AlertCircle size={12} className="mr-1" /> {errors.categoryName}
                    </p>
                  )}
                  {isCreatingCategory && formData.categoryName && (
                    <p className="text-xs text-green-600 mt-1">
                      <Check size={12} className="inline mr-1" /> 
                      New category will be created
                    </p>
                  )}
                </div>

                {/* Availability Toggle */}
                <div className="flex items-center py-2">
                  <input
                    type="checkbox"
                    id="availability"
                    name="availability"
                    checked={formData.availability}
                    onChange={handleChange}
                    className="w-5 h-5 text-cartBg border-lighttextGray rounded focus:ring-cartNumBg"
                  />
                  <label htmlFor="availability" className="block ml-2 text-sm text-textColor">
                    Item is available for ordering
                  </label>
                </div>
              </div>

              {/* Submit Buttons - Full Width */}
              <div className="flex justify-end gap-3 pt-4 mt-2 border-t border-gray-200 col-span-1 md:col-span-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 text-sm text-textColor transition-colors bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center px-6 py-2.5 text-sm text-white transition-colors bg-cartBg rounded-md hover:bg-black focus:outline-none focus:ring-2 focus:ring-cartNumBg"
                >
                  <Check size={16} className="mr-2" /> Add Item
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AddMenuPopup;
