import { Store } from "../utils/store";
import { setupGreetingEffects } from "./greeting/effects";
import { setupGreetingHandlers } from "./greeting/handlers";
import { GreetingState } from "./greeting/types";
import { TodoState } from "./todos/types";

export type RootState = {
    greetings: GreetingState;
    todos: TodoState;
};

const initialState: RootState = {
    greetings: {
        greeting: "unset",
        count: 0,
    },
    todos: {
        task: "",
        error: "",
        items: [],
    },
};

function getInitialState(preloaded: RootState) {
    try {
        const json = localStorage.getItem("todos");
        if (!json) {
            return preloaded;
        }

        const todos: TodoState = JSON.parse(json);
        return { ...preloaded, todos };
    } catch (e) {
        console.error(e);
        localStorage.removeItem("todos");
        return preloaded;
    }
}

export const store = new Store<RootState>(getInitialState(initialState));
setupGreetingHandlers(store);
setupGreetingEffects(store);
