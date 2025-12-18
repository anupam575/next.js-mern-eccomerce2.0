"use client";

import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

// slices
import productReducer from "@/redux/slices/productSlice";
import authReducer from "@/redux/slices/authSlice";
import searchReducer from "@/redux/slices/searchSlice";
import shippingReducer from "@/redux/slices/shippingSlice";
import suggestionsReducer from "@/redux/slices/suggestionsSlice";
import cartReducer from "@/redux/slices/cartSlice";
import notificationReducer from "@/redux/slices/notificationSlice";

// Only auth slice needs persist
const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["user",],
};

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  cart: cartReducer,
  search: searchReducer,
  shipping: shippingReducer,
  notifications: notificationReducer,
  product: productReducer,
  suggestions: suggestionsReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
