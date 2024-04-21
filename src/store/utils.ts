import { addListener, removeListener } from "@reduxjs/toolkit";
import { AppDispatch, AppState } from "./store";

export const addAppListener = addListener.withTypes<AppState, AppDispatch>();
export const removeAppListener = removeListener.withTypes<AppState, AppDispatch>();
