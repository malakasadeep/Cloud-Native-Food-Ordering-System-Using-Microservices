import React from "react";
import { IoFastFood } from "react-icons/io5";
import { motion } from "framer-motion";

const CategoryCard = ({ category, filter, setFilter }) => {
  return (
    <motion.div
      whileTap={{ scale: 0.75 }}
      className={`group ${
        filter === category.urlParamName ? "bg-cartNumBg" : "bg-card"
      } w-24 min-w-[94px] h-28 cursor-pointer rounded-lg drop-shadow-xl flex flex-col gap-3 items-center justify-center hover:bg-cartNumBg `}
      onClick={() => setFilter(category.urlParamName)}
    >
      <div
        className={`w-10 h-10 rounded-full shadow-lg ${
          filter === category.urlParamName
            ? "bg-white"
            : "bg-cartNumBg"
        } group-hover:bg-white flex items-center justify-center`}
      >
        <IoFastFood
          className={`${
            filter === category.urlParamName
              ? "text-textColor"
              : "text-white"
          } group-hover:text-textColor text-lg`}
        />
      </div>
      <p
        className={`text-sm ${
          filter === category.urlParamName
            ? "text-white"
            : "text-textColor"
        } group-hover:text-white`}
      >
        {category.name}
      </p>
    </motion.div>
  );
};

export default CategoryCard;
