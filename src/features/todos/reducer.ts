import { createReducer } from "@reduxjs/toolkit";
import { TodoState } from "./types";
import { uuid } from "../../utils/uuid";
import { AddTodoActions, TodoListActions } from "./actions";

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
        localStorage.removeItem("todos");
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
