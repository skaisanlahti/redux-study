import {
    PayloadAction,
    createAction,
    createAsyncThunk,
    createSlice,
} from "@reduxjs/toolkit";
import { startAppListening } from "../listener";
import { uuid } from "../../utils/uuid";

export type Todo = {
    id: string;
    task: string;
    done: boolean;
};

export type TodoState = {
    list: Todo[];
    loading: boolean;
};

export const fetchRandomTodos = createAsyncThunk(
    "todo/fetchRandomTodos",
    async () => {
        if (Math.random() > 0.5) {
            throw new Error("failed to get todos");
        }

        const todos: Todo[] = [];
        todos.push({ id: uuid(), task: "buy food", done: false });
        todos.push({ id: uuid(), task: "buy drugs", done: false });
        todos.push({ id: uuid(), task: "go gym", done: true });
        return todos;
    },
);

const initialState: TodoState = {
    list: [],
    loading: false,
};

export const todoStore = createSlice({
    name: "todo",
    initialState,
    reducers: {
        setTodos: (state, action: PayloadAction<Todo[]>) => {
            state.list = action.payload;
        },
        addTodo: (state, action: PayloadAction<Todo>) => {
            const newTodo = action.payload;
            state.list.push(newTodo);
        },
        removeTodo: (state, action) => {
            const id = action.payload;
            const index = state.list.findIndex((i) => i.id === id);
            if (index !== -1) {
                state.list.splice(index, 1);
            }
        },
        toggleTodo: (state, action) => {
            const id = action.payload;
            const index = state.list.findIndex((i) => i.id === id);
            if (index !== -1) {
                state.list[index].done = !state.list[index].done;
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchRandomTodos.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchRandomTodos.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(fetchRandomTodos.rejected, (state) => {
                state.loading = false;
            });
    },
    selectors: {
        selectTodos: (state) => state.list,
        selectTodoCount: (state) => state.list.length,
        selectTodoLoading: (state) => state.loading,
    },
});

export const { addTodo, removeTodo, toggleTodo, setTodos } = todoStore.actions;
export const { selectTodos, selectTodoCount, selectTodoLoading } =
    todoStore.selectors;

startAppListening({
    predicate: (_, current, previous) => {
        return current.todo.list !== previous.todo.list;
    },
    effect: (_, listener) => {
        const list = listener.getState().todo.list;
        try {
            const json = JSON.stringify(list);
            localStorage.setItem("todos", json);
        } catch (e) {
            console.error(e);
        }
    },
});

export const fetchTodos = createAction("todo/fetchTodos");
startAppListening({
    actionCreator: fetchTodos,
    effect: (_, listener) => {
        try {
            const json = localStorage.getItem("todos");
            if (!json) {
                return;
            }

            const todos: Todo[] = JSON.parse(json);
            listener.dispatch(setTodos(todos));
        } catch (e) {
            console.error(e);
        }
    },
});
