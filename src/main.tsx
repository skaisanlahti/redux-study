import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { StoreProvider } from "./features/hooks.ts";
import { store } from "./features/store.ts";

async function main() {
    ReactDOM.createRoot(document.getElementById("root")!).render(
        <React.StrictMode>
            <StoreProvider value={store}>
                <App />
            </StoreProvider>
        </React.StrictMode>,
    );
}

main();
