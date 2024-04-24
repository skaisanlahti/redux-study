import { createAction } from "../../utils/action";
import { createReselector } from "../../utils/reselect";
import { Store } from "../../utils/store";
import { uuid } from "../../utils/uuid";
import { AppState } from "../store";

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

export function getInitialTodoState(): TodoState {
    const state = loadTodoState();
    if (state) {
        return state;
    }

    return {
        task: "",
        error: "",
        items: [],
    };
}

export const TodoSelector = {
    selectTask: (state: AppState) => state.todos.task,
    selectError: (state: AppState) => state.todos.error,
    selectTodoItems: createReselector([(state: AppState) => state.todos.items], (items) => {
        return items.filter((t) => !t.done);
    }),
    selectDoneItems: createReselector([(state: AppState) => state.todos.items], (items) => {
        return items.filter((t) => t.done);
    }),
};

export const AddTodoAction = {
    taskChanged: createAction<string>("[AddTodo] task changed"),
    taskSubmitted: createAction<string>("[AddTodo] task submitted"),
};

export const TodoListAction = {
    todoToggled: createAction<string>("[TodoList] todo toggled"),
    todoRemoved: createAction<string>("[TodoList] todo removed"),
};

export function setupTodoReducers(store: Store<AppState>) {
    store.addReducer(AddTodoAction.taskChanged, (state, task) => {
        state.todos.task = task;
        state.todos.error = "";
    });

    store.addReducer(AddTodoAction.taskSubmitted, (state, task) => {
        if (!task) {
            state.todos.error = "task can't be empty";
            return;
        }

        const todo = { id: uuid(), task, done: false };
        state.todos.items.push(todo);
        state.todos.task = "";
        state.todos.error = "";
    });

    store.addReducer(TodoListAction.todoRemoved, (state, id) => {
        const index = state.todos.items.findIndex((item) => item.id === id);
        if (index !== -1) {
            state.todos.items.splice(index, 1);
        }
    });

    store.addReducer(TodoListAction.todoToggled, (state, id) => {
        const index = state.todos.items.findIndex((item) => item.id === id);
        if (index !== -1) {
            const item = state.todos.items[index];
            item.done = !item.done;
        }
    });
}

export function setupTodoListeners(store: Store<AppState>) {
    store.addListener((context) => {
        if (context.currentState.todos === context.previousState.todos) {
            return;
        }

        saveTodoState(context.currentState.todos);
    });
}

function loadTodoState(): TodoState | null {
    try {
        const json = localStorage.getItem("todos");
        if (!json) {
            return null;
        }

        const state: TodoState = JSON.parse(json);
        return state;
    } catch (e) {
        console.warn(e);
        localStorage.removeItem("todos");
        return null;
    }
}

function saveTodoState(state: TodoState) {
    try {
        const json = JSON.stringify(state);
        localStorage.setItem("todos", json);
    } catch (e) {
        console.warn(e);
    }
}
