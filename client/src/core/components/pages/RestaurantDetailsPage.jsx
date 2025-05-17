import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Clock, MapPin, Phone, Mail, 
  ChevronRight, ChevronLeft, Navigation 
} from "lucide-react";
import FoodCard from "../molecules/FoodCard";
import partnerService from "../../../features/partnersManagement/services/partnerServices";
import menuService from "../../../features/restaurentManageent/services/menuservice";
import Header from "../organisms/Header";
import { GoogleMap, Marker, DirectionsRenderer, useJsApiLoader } from "@react-google-maps/api";

const RestaurantDetailsPage = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [distance, setDistance] = useState(null);
  const [directions, setDirections] = useState(null);
  const categoryRefs = useRef({});
  const [scrollValue, setScrollValue] = useState(0);

  // Google Maps API loader
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey:  import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
    libraries: ["places"],
  });

  // Fetch restaurant data
  useEffect(() => {
    const fetchRestaurantData = async () => {
      try {
        setLoading(true);
        const response = await partnerService.getRestaurantById(id);
        
        if (response.success && response.data) {
          setRestaurant(response.data);
          
          // Fetch categories first so we can use them for menu items
          const categoriesResponse = await menuService.getCategoryByRestaurantId(id);
          if (categoriesResponse.success) {
            const categoriesData = categoriesResponse.data?.categories || categoriesResponse.data || [];
            console.log("Categories fetched:", categoriesData);
            setCategories(categoriesData);
            if (categoriesData.length > 0) {
              setActiveCategory(categoriesData[0]._id);
            }
            
            // Now fetch menu items for this restaurant
            const menuResponse = await menuService.getMenuByRestaurantId(id);
            if (menuResponse.success) {
              console.log("Menu items fetched:", menuResponse.data);
              
              // Process menu items with category information
              const items = Array.isArray(menuResponse.data) ? menuResponse.data : [];
              
              // Log a raw example item to debug the actual structure
              if (items.length > 0) {
                console.log("Example raw menu item structure:", JSON.stringify(items[0]));
              }
              
              // Make sure we have all needed properties and match with category names
              const processedItems = items.map(item => {
                // Find matching category based on multiple possible properties
                // Backend might be using category, categoryId, or other variations
                const categoryId = item.categoryId || item.category || "";
                const matchingCategory = categoriesData.find(cat => cat._id === categoryId);
                
                return {
                  ...item,
                  id: item._id, // Add id as alternative to _id for consistency
                  // Ensure categoryId is set correctly even if it came from a different property
                  categoryId: categoryId,
                  categoryName: matchingCategory ? matchingCategory.categoryName : "Uncategorized"
                };
              });
              
              console.log("Processed menu items:", processedItems);
              setMenuItems(processedItems);
            } else {
              console.error("Failed to fetch menu items:", menuResponse.message);
            }
          } else {
            console.error("Failed to fetch categories:", categoriesResponse.message);
          }
        } else {
          setError("Restaurant not found");
        }
      } catch (err) {
        console.error("Error fetching restaurant details:", err);
        setError("Failed to load restaurant details");
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantData();
  }, [id]);

  // Get user's location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          setError("Unable to access your location");
        }
      );
    } else {
      setError("Geolocation is not supported by your browser");
    }
  }, []);

  // Calculate directions and distance when both locations are available
  useEffect(() => {
    if (isLoaded && userLocation && restaurant?.restaurant?.location) {
      const directionsService = new window.google.maps.DirectionsService();
      
      directionsService.route(
        {
          origin: userLocation,
          destination: {
            lat: restaurant.restaurant.location.lat,
            lng: restaurant.restaurant.location.lng,
          },
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            setDirections(result);
            // Get distance in kilometers
            const distanceValue = result.routes[0].legs[0].distance.value / 1000;
            setDistance(distanceValue.toFixed(2));
          } else {
            setError("Direction service failed");
          }
        }
      );
    }
  }, [isLoaded, userLocation, restaurant]);

  // Scroll handling for category navigation
  useEffect(() => {
    const categoryContainer = document.querySelector(".category-container");
    if (categoryContainer) {
      categoryContainer.scrollLeft += scrollValue;
    }
  }, [scrollValue]);

  // Handle category click - smooth scroll to section
  const scrollToCategory = (categoryId) => {
    setActiveCategory(categoryId);
    
    if (categoryRefs.current[categoryId]) {
      categoryRefs.current[categoryId].scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  // Add to cart function
  const addToCart = (item) => {
    const cartItems = localStorage.getItem('cartItems') 
      ? JSON.parse(localStorage.getItem('cartItems')) 
      : [];

    const existingItemIndex = cartItems.findIndex(cartItem => cartItem.id === item._id);
    
    let updatedItems;
    if (existingItemIndex !== -1) {
      updatedItems = [...cartItems];
      updatedItems[existingItemIndex].qty += 1;
    } else {
      updatedItems = [...cartItems, { ...item, qty: 1 }];
    }

    localStorage.setItem("cartItems", JSON.stringify(updatedItems));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  // Improved grouping of menu items by category
  const menuItemsByCategory = React.useMemo(() => {
    if (!categories.length || !menuItems.length) {
      console.log("No categories or menu items to process");
      return {};
    }
    
    // First, try to manually assign menu items to categories for demonstration
    // This is a workaround if the API isn't returning proper category relationships
    if (menuItems.length > 0 && !menuItems[0].categoryId) {
      console.log("Menu items missing categoryId - attempting manual assignment");
      
      // Create a copy of menu items with assigned categories based on item names
      const assignedItems = menuItems.map(item => {
        const name = item.name?.toLowerCase() || '';
        let assignedCategoryId = null;
        
        // Simple name-based matching as fallback
        if (name.includes('pizza') || name.includes('margherita')) {
          assignedCategoryId = categories.find(c => c.categoryName === 'Pizza')?._id;
        } else if (name.includes('pasta') || name.includes('spaghetti') || name.includes('carbonara')) {
          assignedCategoryId = categories.find(c => c.categoryName === 'Pasta')?._id;
        } else if (name.includes('biryani') || name.includes('rice')) {
          assignedCategoryId = categories.find(c => c.categoryName === 'Rice Dishes')?._id;
        } else if (name.includes('curry') || name.includes('butter chicken')) {
          assignedCategoryId = categories.find(c => c.categoryName === 'Curries')?._id;
        } else if (name.includes('burger')) {
          assignedCategoryId = categories.find(c => c.categoryName === 'Burgers')?._id;
        } else if (name.includes('sushi')) {
          assignedCategoryId = categories.find(c => c.categoryName === 'Japanese')?._id;
        }
        
        return {
          ...item,
          categoryId: assignedCategoryId || item.categoryId
        };
      });
      
      const groupedItems = {};
      
      categories.forEach(category => {
        // Filter items for this category
        const categoryItems = assignedItems.filter(item => {
          return item.categoryId === category._id;
        });
        
        groupedItems[category._id] = categoryItems;
        console.log(`Category ${category.categoryName} has ${categoryItems.length} items with manual assignment`);
      });
      
      return groupedItems;
    }
    
    // Standard grouping if the categoryId relationships are present
    const groupedItems = {};
    
    categories.forEach(category => {
      // Filter items for this category, handling different id formats
      const categoryItems = menuItems.filter(item => {
        const itemCategoryId = String(item.categoryId || "");
        const categoryId = String(category._id || "");
        
        const isMatch = itemCategoryId === categoryId;
        console.log(`Checking ${item.name}: Category ID ${itemCategoryId} vs ${categoryId} - Match: ${isMatch}`);
        
        return isMatch;
      });
      
      groupedItems[category._id] = categoryItems;
      console.log(`Category ${category.categoryName} has ${categoryItems.length} items`);
    });
    
    return groupedItems;
  }, [categories, menuItems]);

  if (loading) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-20 w-20 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center">
        <div className="bg-red-50 p-6 rounded-lg text-red-700 max-w-md text-center">
          <h2 className="text-2xl font-bold mb-3">Error</h2>
          <p>{error || "Restaurant not found"}</p>
        </div>
      </div>
    );
  }

  const { name, address, coverImageURL, city, openingTime, closingTime } = restaurant.restaurant || {};
  
  // Generate random rating between 4.0 and 5.0 for demo purposes
  const rating = (Math.random() * (5.0 - 4.0) + 4.0).toFixed(1);
  
  return (
    <>
      <Header />
      <div className="w-full bg-primary">
        {/* Hero Section with Cover Image */}
        <div className="relative w-full h-[300px] md:h-[400px]">
          <img 
            src={coverImageURL || "https://via.placeholder.com/1200x400?text=Restaurant"} 
            alt={name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30">
            <div className="container mx-auto h-full flex flex-col justify-between p-4">
              {/* Back button */}
              <div>
                <button 
                  onClick={() => window.history.back()}
                  className="mt-20 bg-white/80 backdrop-blur-sm hover:bg-white text-gray-800 py-2 px-4 rounded-full flex items-center transition-all "
                >
                  <ChevronLeft size={18} className="mr-1" /> Back
                </button>
              </div>
              
              {/* Restaurant name and basic info */}
              <div className="bg-black/50 backdrop-blur-sm p-4 md:p-6 rounded-lg max-w-3xl">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{name}</h1>
                    <p className="text-white/90 flex items-center text-sm md:text-base">
                      <MapPin size={16} className="mr-2" />
                      {address}, {city}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="bg-white text-gray-800 px-3 py-1 rounded-full flex items-center">
                      <span className="text-amber-500 mr-1">★</span> {rating}
                    </div>
                    <div className="text-white bg-green-600 px-3 py-1 rounded-full text-sm">
                      Open Now
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="container mx-auto px-4 -mt-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Restaurant Info */}
            <div>
              <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
                <div className="px-6 py-5 border-b border-gray-100">
                  <h2 className="text-xl font-bold text-gray-800">Restaurant Information</h2>
                </div>
                <div className="p-6 space-y-5">
                  <div className="flex items-start">
                    <Clock className="text-red-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-700">Hours</p>
                      <p className="text-gray-600">{openingTime} - {closingTime}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Phone className="text-red-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-700">Phone</p>
                      <p className="text-gray-600">{restaurant.mobile || 'Not available'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Mail className="text-red-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-700">Email</p>
                      <p className="text-gray-600">{restaurant.email || 'Not available'}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Location Card */}
              {isLoaded && userLocation && restaurant.restaurant?.location && (
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                  <div className="px-6 py-5 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800">Location</h2>
                  </div>
                  <div className="h-48 w-full">
                    <GoogleMap
                      center={restaurant.restaurant.location}
                      zoom={14}
                      mapContainerStyle={{ width: '100%', height: '100%' }}
                      options={{
                        zoomControl: true,
                        streetViewControl: false,
                        mapTypeControl: false,
                        fullscreenControl: true,
                      }}
                    >
                      <Marker 
                        position={restaurant.restaurant.location} 
                        icon={{
                          url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
                          scaledSize: new window.google.maps.Size(40, 40),
                        }}
                      />
                      <Marker 
                        position={userLocation}
                        icon={{
                          url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                          scaledSize: new window.google.maps.Size(40, 40),
                        }}
                      />
                      {directions && <DirectionsRenderer directions={directions} />}
                    </GoogleMap>
                  </div>
                  
                  {distance && (
                    <div className="p-4 border-t border-gray-100">
                      <div className="flex items-center">
                        <Navigation className="text-blue-600 mr-2 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-gray-700">Distance: {distance} km</p>
                          <p className="text-sm text-gray-500">Estimated driving distance</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Right Column - Menu */}
            <div className="lg:col-span-2">
              {/* Category Navigation - Sticky */}
              {categories.length > 0 && (
                <div className="sticky top-[72px] z-30 bg-white rounded-xl shadow-md p-4 mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-xl font-bold text-gray-800">Our Menu</h2>
                    
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setScrollValue(-200)}
                        className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <button 
                        onClick={() => setScrollValue(200)}
                        className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="category-container flex gap-2 overflow-x-auto pb-2 scrollbar-none scroll-smooth">
                    {categories.map((category) => (
                      <motion.button
                        key={category._id}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => scrollToCategory(category._id)}
                        className={`
                          min-w-[120px] py-2 px-4 rounded-full whitespace-nowrap transition-all
                          ${activeCategory === category._id 
                            ? 'bg-red-500 text-white shadow-md shadow-red-200'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }
                        `}
                      >
                        {category.categoryName}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Menu Items By Category */}
              {categories.length > 0 ? (
                <div className="space-y-12">
                  {categories.map((category) => {
                    // Log the filtered items for this category to debug
                    const categoryItems = menuItemsByCategory[category._id] || [];
                    console.log(`Items for ${category.categoryName}:`, categoryItems);
                    
                    return (
                      <div 
                        key={category._id}
                        id={`category-${category._id}`}
                        ref={el => categoryRefs.current[category._id] = el}
                        className="scroll-mt-32"
                      >
                        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                          <h2 className="text-2xl font-bold text-gray-800 mb-6">{category.categoryName}</h2>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {categoryItems.length > 0 ? (
                              categoryItems.map((item) => (
                                <FoodCard 
                                  key={item._id || item.id} 
                                  item={{
                                    ...item,
                                    // Ensure all required properties exist
                                    name: item.name || item.title || "Unnamed Item",
                                    imageUrl: item.imageUrl || item.image || "",
                                    price: item.price || 0
                                  }}
                                  addToCart={addToCart} 
                                />
                              ))
                            ) : (
                              <p className="text-gray-500 col-span-full text-center py-8 bg-gray-50 rounded-lg">
                                No items available in this category
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-md p-6 text-center">
                  <p className="text-gray-500 py-12">This restaurant doesn't have any menu items yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RestaurantDetailsPage;
