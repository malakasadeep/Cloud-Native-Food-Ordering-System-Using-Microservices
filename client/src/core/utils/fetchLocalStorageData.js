export const fetchUser = () => {
  const userInfo =
    localStorage.getItem("user") !== "undefined"
      ? JSON.parse(localStorage.getItem("user"))
      : localStorage.clear();

  return userInfo;
};

export const fetchCart = () => {
  const cartInfo =
    localStorage.getItem("cartItems") !== "undefined"
      ? JSON.parse(localStorage.getItem("cartItems"))
      : localStorage.clear();

  return cartInfo ? cartInfo : [];
};

export const fetchPersistedUser = () => {
  const root = localStorage.getItem("persist:root");
  if (!root) return null;

  try {
    const parsedRoot = JSON.parse(root);
    const userStr = parsedRoot.user;
    if (userStr && userStr !== "undefined") {
      return JSON.parse(userStr);
    }
  } catch (err) {
    console.error("Error parsing persisted user:", err);
  }

  return null;
};
