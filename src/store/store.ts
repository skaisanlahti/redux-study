import { configureStore, createListenerMiddleware } from "@reduxjs/toolkit";

const listener = createListenerMiddleware();
const appStartListening = listener.startListening.withTypes<AppState, AppDispatch>();
const appStopListening = listener.stopListening.withTypes<AppState, AppDispatch>();

export const store = configureStore({
    reducer: {},
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware().prepend(listener.middleware);
    },
});

export type AppStore = typeof store;
export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export type AppStartListening = typeof appStartListening;
export type AppStopListening = typeof appStopListening;
