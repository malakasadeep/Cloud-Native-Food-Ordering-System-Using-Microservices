const API_CONSTANTS = {
  /// customer
  SEND_MOBILE_OTP: "/api/v1/customer/send-mobile-otp",
  VERIFY_MOBILE_OTP: "/api/v1/customer/verify-mobile-otp",
  SEND_EMAIL_OTP: "/api/v1/customer/send-email-otp",
  VERIFY_EMAIL_OTP: "/api/v1/customer/verify-email-otp",
  COMPLETE_PROFILE: "/api/v1/customer/complete-profile",
  LOGOUT: "/api/v1/customer/signout",
  GET_CURRENT_USER: "/api/v1/customer/me",

  //partners
  LOGIN: "/api/v1/user/login",
  REGISTER: "/api/v1/user/register",
  GET_ALL: "/api/v1/user",

  // restaurant
  CREATE_CATEGORY: "/api/v1/restaurant/category",
  GET_CATEGORIES: "/api/v1/restaurant/category",
  CREATE_MENU: "/api/v1/restaurant/foodMenu",
  GET_MENU_BY_RESTAURANT_ID: "/api/v1/restaurant/foodMenu",
  GET_MENUS: "/api/v1/restaurant/foodMenu",
  UPDATE_MENU: "/api/v1/restaurant/foodMenu",
  DELETE_MENU: "/api/v1/restaurant/foodMenu",
};
export default API_CONSTANTS;
