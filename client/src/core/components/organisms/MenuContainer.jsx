import React, { useState, useEffect } from "react";
import RowContainer from "./RowContainer";
import { foodItems } from "../../utils/foodData";
import CategoryCard from "../molecules/CategoryCard";
import menuService from "../../../features/restaurentManageent/services/menuservice";

const MenuContainer = () => {
  const [filter, setFilter] = useState("All");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await menuService.getAllCategories();
      console.log("Full response:", response);
      
      if (response.success) {
        // Check if categories are nested in response.data.categories
        const categoriesData = response.data.categories || response.data;
        console.log("Categories data to be used:", categoriesData);
        
        if (categoriesData && categoriesData.length > 0) {
          // Add the "All" category
          const allCategories = [
            { _id: "all", categoryName: "All" },
            ...categoriesData
          ];
          setCategories(allCategories);
          // Keep "All" as default filter
          setFilter("All");
          console.log("Default filter set to: All");
        }
      }
    };

    fetchCategories();
  }, []);
  
  return (
    <section className="w-full my-6" id="menu">
    <div className="w-full flex flex-col items-center justify-center">
      <p className="text-2xl font-semibold capitalize text-headingColor relative before:absolute before:rounded-lg before:content before:w-16 before:h-1 before:-bottom-2 before:left-0 before:bg-gradient-to-tr from-orange-400 to-orange-600 transition-all ease-in-out duration-100 mr-auto">
        Our Hot Dishes
      </p>

      <div className="w-full flex items-center justify-start lg:justify-center gap-8 py-6 overflow-x-scroll scrollbar-none">
        {categories && categories.length > 0 &&
          categories.map((category) => (
            <CategoryCard 
              key={category._id}
              category={{
                ...category,
                name: category.categoryName,
                urlParamName: category.categoryName.toLowerCase()
              }}
              filter={filter}
              setFilter={setFilter} 
            />
          ))}
      </div>

      <div className="w-full">
        <RowContainer
          flag={false}
          filter={filter}
          data={filter === "All" ? foodItems : foodItems?.filter((n) => n.category.toLowerCase() === filter.toLowerCase())}
        />
      </div>
    </div>
  </section>
);
};

export default MenuContainer;
