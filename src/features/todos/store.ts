import { createAction } from "../../utils/store";
import { uuid } from "../../utils/uuid";
import { store } from "../store";
import { TodoState } from "./types";

export const AddTodoAction = {
    taskChanged: createAction<string>("[AddTodo] task changed"),
    taskSubmitted: createAction<string>("[AddTodo] task submitted"),
};

export const TodoListAction = {
    todoToggled: createAction<string>("[TodoList] todo toggled"),
    todoRemoved: createAction<string>("[TodoList] todo removed"),
};

store.addHandler(AddTodoAction.taskChanged, (state, action) => {
    state.todos.task = action.payload;
    state.todos.error = "";
});

store.addHandler(AddTodoAction.taskSubmitted, (state, action) => {
    if (!action.payload) {
        return;
    }

    const todo = { id: uuid(), task: action.payload, done: false };
    state.todos.items.push(todo);
    state.todos.task = "";
    state.todos.error = "";
});

store.addHandler(TodoListAction.todoRemoved, (state, action) => {
    const index = state.todos.items.findIndex((item) => item.id === action.payload);
    if (index !== -1) {
        state.todos.items.splice(index, 1);
    }
});

store.addHandler(TodoListAction.todoToggled, (state, action) => {
    const index = state.todos.items.findIndex((item) => item.id === action.payload);
    if (index !== -1) {
        const item = state.todos.items[index];
        item.done = !item.done;
    }
});

store.addEffect((context) => {
    if (context.currentState.todos === context.previousState.todos) {
        return;
    }

    saveTodoState(context.currentState.todos);
});

function saveTodoState(state: TodoState) {
    try {
        const json = JSON.stringify(state);
        localStorage.setItem("todos", json);
    } catch (e) {
        console.error(e);
    }
}
