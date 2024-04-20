import { createListenerMiddleware } from "@reduxjs/toolkit";
import { setupTodoListeners } from "../features/todos";
import { type AppDispatch, type AppState } from "./store";

export const listener = createListenerMiddleware();
export const appStartListening = listener.startListening.withTypes<AppState, AppDispatch>();
export const appStopListening = listener.stopListening.withTypes<AppState, AppDispatch>();

export type AppStartListening = typeof appStartListening;
export type AppStopListening = typeof appStopListening;

setupTodoListeners(appStartListening);
