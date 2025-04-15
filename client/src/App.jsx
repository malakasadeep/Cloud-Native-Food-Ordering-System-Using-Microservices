import React from "react";
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { CartProvider } from './core/contexts/CartContext';
import CusAuthPage from "./features/customerAuth/components/CusAuthPage";
import HomePage from "./core/components/pages/HomePage";

const App = () => {
  return (
    <Router>
      <CartProvider>
        <AnimatePresence>
          <div className="overflow-x-hidden ">
          <Routes>
              <Route path="/*" element={<HomePage />} />
              <Route path="/test" element={<CusAuthPage />} />
          </Routes> 
          </div>
        </AnimatePresence>
      </CartProvider>
    </Router>
  );
};

export default App;
