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
  GET_RESTAURANT: "/api/v1/user/restaurants",
  UPDATE_REST_AVAILABILITY: "/api/v1/user/restaurants",
  GET_ALL_RESTAURANTS: "/api/v1/user/all-restaurants",
  GET_ALL_RIDERS: "/api/v1/user/all-riders",

  // restaurant
  CREATE_CATEGORY: "/api/v1/restaurant/category",
  GET_CATEGORIES: "/api/v1/restaurant/category",
  CREATE_MENU: "/api/v1/restaurant/foodMenu",
  GET_MENU_BY_RESTAURANT_ID: "/api/v1/restaurant/foodMenu/restaurant",
  GET_MENUS: "/api/v1/restaurant/foodMenu",
  UPDATE_MENU: "/api/v1/restaurant/foodMenu",
  DELETE_MENU: "/api/v1/restaurant/foodMenu",


  //orders
  CREATE_ORDER: "/api/v1/orders/create-order",
  GET_ORDERS: "/api/v1/orders",
  POST_CREATE_SESSION: "/api/v1/orders/create-checkout-session",
  UPDATE_ORDER_STATUS: "/api/v1/orders/status",
  GET_ORDER_BY_ID: "/api/v1/orders",

  //deliver-services
  GET_RIDER_ASSIGNED_ORDERS: `api/delivery-requests/`,
  GET_RIDER_ACCEPT_ORDER_BY_STATUS: `api/delivery/driver/`,
  GET_RIDER_ONGOING_DELIVERY: `api/delivery/ongoing/driver/`,
  RIDER_ACCEPT_ORDER: `api/delivery/accept/driver/`,
  RIDER_START_DELIVERY: `api/delivery/start/order/`,
};
export default API_CONSTANTS;
