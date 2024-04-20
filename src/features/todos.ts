import { createReducer } from "@reduxjs/toolkit";
import { uuid } from "../utils/uuid";
import { AppStartListening } from "../store/listener";
import { AddTodoActions } from "./AddTodo";
import { TodoListActions } from "./TodoList";

export type Todo = {
    id: string;
    task: string;
    done: boolean;
};

export type TodoState = {
    task: string;
    error: string;
    items: Todo[];
};

const initialState: TodoState = { task: "", error: "", items: [] };
function getInitialState() {
    try {
        const json = localStorage.getItem("todos");
        if (!json) {
            return initialState;
        }

        const loadedState: TodoState = JSON.parse(json);
        return loadedState;
    } catch (e) {
        console.error(e);
        return initialState;
    }
}

export const todoReducer = createReducer(getInitialState, (reducer) => {
    reducer.addCase(AddTodoActions.taskChanged, (state, action) => {
        state.task = action.payload;
        state.error = "";
    });
    reducer.addCase(AddTodoActions.taskSubmitted, (state, action) => {
        if (!action.payload) {
            return;
        }

        const todo = { id: uuid(), task: action.payload, done: false };
        state.items.push(todo);
        state.task = "";
        state.error = "";
    });
    reducer.addCase(TodoListActions.todoRemoved, (state, action) => {
        const index = state.items.findIndex((item) => item.id === action.payload);
        if (index !== -1) {
            state.items.splice(index, 1);
        }
    });
    reducer.addCase(TodoListActions.todoToggled, (state, action) => {
        const index = state.items.findIndex((item) => item.id === action.payload);
        if (index !== -1) {
            const item = state.items[index];
            item.done = !item.done;
        }
    });
});

export function setupTodoListeners(startListening: AppStartListening) {
    startListening({
        predicate: (_, current, previous) => {
            return current.todos !== previous.todos;
        },
        effect: async (_, handler) => {
            handler.cancelActiveListeners();
            await handler.delay(200);

            const state = handler.getState().todos;
            try {
                const json = JSON.stringify(state);
                localStorage.setItem("todos", json);
            } catch (e) {
                console.error(e);
            }
        },
    });
}
