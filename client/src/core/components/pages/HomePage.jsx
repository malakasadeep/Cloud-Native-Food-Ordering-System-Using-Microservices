import { AnimatePresence } from "framer-motion";
import React, { useEffect, useState } from "react";
import MainContainer from "../organisms/MainContainer";
import Header from "../organisms/Header";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import ProfileCompletePopup from "../../../features/customerAuth/components/ProfileCompletePopup";



const HomePage = () => {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();
   const [showProfilePopup, setShowProfilePopup] = useState(false);

  useEffect(() => {
      
    const queryParams = new URLSearchParams(location.search);
    const shouldShowPopup = 
      queryParams.get('showProfilePopup') === 'true' || 
      (user && user.isProfileCompleted === false);
        
      setShowProfilePopup(shouldShowPopup);
    }, [location, user]);
  
    const handleClosePopup = () => {
      setShowProfilePopup(false);
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    };

  return (
    <AnimatePresence exitBeforeEnter>
      <div className="w-screen h-auto flex flex-col bg-primary">
        <Header />
        <main className="mt-14 md:mt-20 px-4 md:px-16 py-4 w-full">
          <MainContainer />
        </main>
        <ProfileCompletePopup
        isOpen={showProfilePopup}
        onClose={handleClosePopup}
        user={user}
      />
      </div>
    </AnimatePresence>
  );
};

export default HomePage;
