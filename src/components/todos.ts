import { createAction, createReducer } from "@reduxjs/toolkit";
import { uuid } from "../utils/uuid";
import { addAppHandler } from "../store/listener";

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

export const taskChanged = createAction<string>("ADD_TODO_TASK_CHANGED");
export const taskSubmitted = createAction<string>("ADD_TODO_TASK_SUBMITTED");
export const todoRemoved = createAction<string>("TODO_LIST_TODO_REMOVED");
export const todoToggled = createAction<string>("TODO_LIST_TODO_TOGGLED");

export const todoReducer = createReducer(getInitialState(), (reducer) => {
    reducer.addCase(taskChanged, (state, action) => {
        state.task = action.payload;
        state.error = "";
    });
    reducer.addCase(taskSubmitted, (state, action) => {
        const todo = { id: uuid(), task: action.payload, done: false };
        state.items.push(todo);
        state.task = "";
        state.error = "";
    });
    reducer.addCase(todoRemoved, (state, action) => {
        const index = state.items.findIndex((item) => item.id === action.payload);
        if (index !== -1) {
            state.items.splice(index, 1);
        }
    });
    reducer.addCase(todoToggled, (state, action) => {
        const index = state.items.findIndex((item) => item.id === action.payload);
        if (index !== -1) {
            const item = state.items[index];
            item.done = !item.done;
        }
    });
});

addAppHandler({
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
