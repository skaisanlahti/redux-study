import { configureStore } from "@reduxjs/toolkit";
import { todoStore } from "./todo/todoStore";
import { listener } from "./listener";

export const store = configureStore({
    reducer: { [todoStore.name]: todoStore.reducer },
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware().prepend(listener.middleware);
    },
});

export type AppState = ReturnType<typeof store.getState>;
export type AppStore = typeof store;
export type AppDispatch = typeof store.dispatch;
