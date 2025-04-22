import React, { useState, useEffect } from "react";
import { X, Upload, DollarSign, Check, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const AddMenuPopup = ({ isOpen, onClose, onSubmit, categories }) => {
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    categoryId: "",
    availability: true,
    imageUrl: "",
  });

  // Error state for validations
  const [errors, setErrors] = useState({});
  // Preview image state
  const [imagePreview, setImagePreview] = useState(null);

  // Reset form when closed
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        name: "",
        description: "",
        price: "",
        categoryId: "",
        availability: true,
        imageUrl: "",
      });
      setErrors({});
      setImagePreview(null);
    }
  }, [isOpen]);

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

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // For simplicity, just storing the file object
      // In a real application, you'd upload this to a server
      setFormData({
        ...formData,
        imageUrl: file.name, // Just store filename for now
      });
      
      // Create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
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
    
    if (!formData.categoryId) {
      newErrors.categoryId = "Category is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit({
        ...formData,
        price: Number(formData.price),
      });
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
                <div className="flex flex-col items-center p-6 border-2 border-dashed rounded-lg border-lighttextGray hover:border-cartNumBg transition-colors h-80">
                  {imagePreview ? (
                    <div className="relative w-full h-full mb-2">
                      <img
                        src={imagePreview}
                        alt="Food preview"
                        className="object-cover w-full h-full rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview(null);
                          setFormData({ ...formData, imageUrl: "" });
                        }}
                        className="absolute p-1 bg-white rounded-full top-2 right-2 shadow-md hover:bg-gray-100"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center w-full h-full text-lighttextGray">
                      <Upload className="w-16 h-16 mb-4" />
                      <p className="text-lg">Click to upload image</p>
                      <p className="text-sm mt-2 text-center">Recommended: 500x500px</p>
                    </div>
                  )}
                  <input
                    type="file"
                    id="imageUrl"
                    name="imageUrl"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
                <label
                  htmlFor="imageUrl"
                  className="w-full py-3 text-base font-medium text-center text-white transition-colors bg-cartNumBg rounded-md cursor-pointer hover:bg-red-700"
                >
                  {imagePreview ? "Change Image" : "Upload Image"}
                </label>
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

                {/* Category Select */}
                <div>
                  <label htmlFor="categoryId" className="block mb-2 text-sm font-medium text-headingColor">
                    Category *
                  </label>
                  <select
                    id="categoryId"
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 bg-card border rounded-md focus:outline-none focus:ring-2 transition-all ${
                      errors.categoryId ? "border-cartNumBg focus:ring-cartNumBg" : "border-lighttextGray focus:ring-cartBg"
                    }`}
                  >
                    <option value="">Select a category</option>
                    {categories?.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  {errors.categoryId && (
                    <p className="flex items-center mt-1 text-xs text-cartNumBg">
                      <AlertCircle size={12} className="mr-1" /> {errors.categoryId}
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
