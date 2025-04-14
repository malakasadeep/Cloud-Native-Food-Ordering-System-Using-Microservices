import React from "react";
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { CartProvider } from './core/contexts/CartContext';
import MainContainer from "./core/components/organisms/MainContainer";
import CustomerAuthForm from "./core/components/organisms/Customer/CusromerAuthForm";
import CusAuthPage from "./features/customerAuth/components/CusAuthPage";

const App = () => {
  return (
    <Router>
      <CartProvider>
        <AnimatePresence>
          <div className="overflow-x-hidden ">
          <Routes>
              <Route path="/*" element={<MainContainer />} />
              <Route path="/test" element={<CusAuthPage />} />
          </Routes> 
          </div>
        </AnimatePresence>
      </CartProvider>
    </Router>
  );
};

export default App;
