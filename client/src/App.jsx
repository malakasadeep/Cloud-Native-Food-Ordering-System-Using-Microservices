import React, { useEffect } from "react";
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Header, MainContainer } from "./core/components";
import { CartProvider } from './core/utils/CartContext';

const App = () => {
  return (
    <Router>
      <CartProvider>
        <AnimatePresence><div className="overflow-x-hidden ">
          <Routes>
            
              <Route path="/*" element={<MainContainer />} />
           
            
          </Routes> </div>
        </AnimatePresence>
      </CartProvider>
    </Router>
  );
};

export default App;
