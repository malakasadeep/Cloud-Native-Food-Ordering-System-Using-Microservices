import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "../../src/features/auth/authslices";

import { useDispatch } from "react-redux";

const persistConfig = {
  key: "root",
  storage,
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    // users: usersSlice,
  },
});

export const persistor = persistStore(store);

export const useAppDispatch = () => useDispatch();

export default store;
