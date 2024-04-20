import { configureStore } from "@reduxjs/toolkit";
import { todoReducer } from "../features/todos";
import { listener } from "./listener";

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
