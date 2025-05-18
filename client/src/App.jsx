import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { CartProvider } from "./core/contexts/CartContext";
import AppRoutes from "./core/routes/Approutes";
import ProfilePage from "./features/customerProfile/components/ProfilePage";
import { ThemeProvider } from "./core/contexts/theme-context";

const App = () => {
  return (
    <ThemeProvider storageKey="theme">
      <Router>
        <CartProvider>
          <AnimatePresence>
            <div className="overflow-x-hidden ">
              <AppRoutes />
            </div>
          </AnimatePresence>
        </CartProvider>
      </Router>
    </ThemeProvider>
  );
};

export default App;
