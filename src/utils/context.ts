import { createContext, useContext } from "react";

export function createTypeSafeContext<T>() {
    const context = createContext<T | undefined>(undefined);

    function useTypedContext() {
        const contextValue = useContext(context);
        if (!contextValue) {
            throw new Error("No context provider found.");
        }

        return contextValue;
    }

    return [useTypedContext, context.Provider, context.Consumer] as const;
}
