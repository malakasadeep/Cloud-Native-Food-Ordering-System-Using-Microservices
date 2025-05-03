import React from "react";
import { MdShoppingBasket } from "react-icons/md";
import { motion } from "framer-motion";

const FoodCard = ({ item, addToCart }) => {
  return (
    <div className="w-275 h-[175px] min-w-[275px] md:w-300 md:min-w-[300px] bg-cardOverlay rounded-lg py-2 px-4 my-12 backdrop-blur-lg hover:drop-shadow-lg flex flex-col items-center justify-evenly relative">
      <div className="w-full flex items-center justify-between">
        <motion.div
          className="w-40 h-40 -mt-8 drop-shadow-2xl"
          whileHover={{ scale: 1.2 }}
        >
          <img
            src={item?.imageUrl}
            alt="12"
            className="w-full h-full object-contain"
          />
        </motion.div>
        <motion.div
          whileTap={{ scale: 0.75 }}
          id={item.name}
          className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center cursor-pointer hover:shadow-md -mt-8"
          onClick={() => addToCart(item)}
        >
          <MdShoppingBasket className="text-white" />
        </motion.div>
      </div>

      <div className="w-full flex flex-col items-end justify-end -mt-8">
        <p className="text-textColor font-semibold text-base md:text-lg">
          {item?.name}
        </p>
        {/* <p className="mt-1 text-sm text-gray-500 line-clamp-2 overflow-hidden text-ellipsis">
          {item?.description}
        </p> */}
        <div className="flex items-center gap-8">
          <p className="text-lg text-headingColor font-semibold">
            <span className="text-sm text-red-500">Rs.</span> {item?.price}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
