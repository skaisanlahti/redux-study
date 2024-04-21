import { AppStartListening } from "../../store/store";
import { TodoState } from "./types";

export function setupTodoListeners(start: AppStartListening) {
    start({
        predicate: (_, current, previous) => current.todos !== previous.todos,
        effect: async (_, api) => {
            api.cancelActiveListeners();
            await api.delay(500);
            const state = api.getState();
            saveTodoState(state.todos);
        },
    });
}

function saveTodoState(state: TodoState) {
    try {
        const json = JSON.stringify(state);
        localStorage.setItem("todos", json);
    } catch (e) {
        console.error(e);
    }
}
