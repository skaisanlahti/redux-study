import { createListenerMiddleware } from "@reduxjs/toolkit";
import { AppDispatch, AppState } from "./store";

export const listener = createListenerMiddleware();
export const addAppHandler = listener.startListening.withTypes<AppState, AppDispatch>();
export const removeAppHandler = listener.stopListening.withTypes<AppState, AppDispatch>();
