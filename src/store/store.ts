import { configureStore, createListenerMiddleware } from "@reduxjs/toolkit";
import { todoReducer } from "../features/todos/reducer";
import { setupTodoListeners } from "../features/todos/listener";

const listener = createListenerMiddleware();
const appStartListening = listener.startListening.withTypes<AppState, AppDispatch>();
const appStopListening = listener.stopListening.withTypes<AppState, AppDispatch>();

setupTodoListeners(appStartListening);

export const store = configureStore({
    reducer: {
        todos: todoReducer,
    },
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware().prepend(listener.middleware);
    },
});

export type AppStore = typeof store;
export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export type AppStartListening = typeof appStartListening;
export type AppStopListening = typeof appStopListening;
