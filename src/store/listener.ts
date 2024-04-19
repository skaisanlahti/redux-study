import { createListenerMiddleware } from "@reduxjs/toolkit";
import { AppDispatch, AppState } from "./store";

export const listener = createListenerMiddleware();
export const startAppListening = listener.startListening.withTypes<
    AppState,
    AppDispatch
>();
