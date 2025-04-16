import React from "react";
import {  BrowserRouter as Router, } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { CartProvider } from './core/contexts/CartContext';
import AppRoutes from "./core/routes/Approutes";

const App = () => {
  return (
    <Router>
      <CartProvider>
        <AnimatePresence>
          <div className="overflow-x-hidden ">
          
              <AppRoutes/>
          
          </div>
        </AnimatePresence>
      </CartProvider>
    </Router>
  );
};

export default App;
