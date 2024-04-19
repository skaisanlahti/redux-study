import { PayloadAction, createAction, createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";
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
    error: string;
};

const initialState: TodoState = {
    list: [],
    loading: false,
    error: "",
};

export const fetchRandomTodos = createAsyncThunk("todo/fetchRandomTodos", async () => {
    if (Math.random() > 0.5) {
        throw new Error("failed to get todos");
    }

    const todos: Todo[] = [];
    todos.push({ id: uuid(), task: "buy food", done: false });
    todos.push({ id: uuid(), task: "buy drugs", done: false });
    todos.push({ id: uuid(), task: "go gym", done: true });
    return todos;
});

export const todoStore = createSlice({
    name: "todo",
    initialState,
    selectors: {
        selectTodos: (state) => state.list,
        selectTodoCount: (state) => state.list.length,
        selectTodoLoading: (state) => state.loading,
        selectTodoError: (state) => state.error,
    },
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
        resetTodoError: (state) => {
            state.error = "";
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
                state.error = "Something went wrong";
            });
    },
});

export const { addTodo, removeTodo, toggleTodo, setTodos, resetTodoError } = todoStore.actions;
export const { selectTodos, selectTodoCount, selectTodoLoading, selectTodoError } = todoStore.selectors;

export const fetchTodos = createAction("todo/fetchTodos");
startAppListening({
    actionCreator: fetchTodos,
    effect: (_, api) => {
        try {
            const json = localStorage.getItem("todos");
            if (!json) {
                return;
            }

            const todos: Todo[] = JSON.parse(json);
            api.dispatch(setTodos(todos));
        } catch (e) {
            console.error(e);
        }
    },
});

startAppListening({
    predicate: (_, current, previous) => {
        return current.todo.list !== previous.todo.list;
    },
    effect: (_, api) => {
        const list = selectTodos(api.getState());
        try {
            const json = JSON.stringify(list);
            localStorage.setItem("todos", json);
        } catch (e) {
            console.error(e);
        }
    },
});

export const taskInputChanged = createAction("todo/taskInputChange");
startAppListening({
    matcher: isAnyOf(taskInputChanged, addTodo, fetchRandomTodos.fulfilled, fetchRandomTodos.pending),
    effect: async (action, api) => {
        if (taskInputChanged.match(action)) {
            api.cancelActiveListeners();
            await api.delay(500);
        }

        api.dispatch(resetTodoError());
    },
});
