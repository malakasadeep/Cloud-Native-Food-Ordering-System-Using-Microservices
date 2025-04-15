import { AnimatePresence } from "framer-motion";
import React from "react";
import MainContainer from "../organisms/MainContainer";
import Header from "../organisms/Header";



const HomePage = () => {
  
  return (
    <AnimatePresence exitBeforeEnter>
      <div className="w-screen h-auto flex flex-col bg-primary">
        <Header />
        <main className="mt-14 md:mt-20 px-4 md:px-16 py-4 w-full">
          <MainContainer />
        </main>
      </div>
    </AnimatePresence>
  );
};

export default HomePage;
