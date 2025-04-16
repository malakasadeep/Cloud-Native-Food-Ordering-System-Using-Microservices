import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProfileCompleteForm from '../../../core/components/organisms/Customer/ProfileCompleteForm';
import { completeProfile } from '../actions/customerAction';

const ProfileCompletePopup = ({ isOpen, onClose, user }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData) => {
    setLoading(true);
    
    try {
      // Here you would call an API to update the user profile
      const result = await dispatch(completeProfile(formData));
      
      // For now, let's just simulate success
      setTimeout(() => {
        toast.success("Profile updated successfully!");
        setLoading(false);
        onClose();
      }, 1000);
    } catch (error) {
      setLoading(false);
      toast.error("Failed to update profile. Please try again.");
      console.error("Profile update error:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-lg shadow-xl max-w-3xl w-full p-6 mx-auto my-8"
      >
        <h2 className="text-xl font-bold text-headingColor mb-2">Complete Your Profile</h2>

        <ProfileCompleteForm 
          initialData={user || {}} 
          onSubmit={handleSubmit}
          onSkip={onClose}
        />
      </motion.div>
    </div>
  );
};

export default ProfileCompletePopup;
