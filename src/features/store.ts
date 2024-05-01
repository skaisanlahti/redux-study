import { Listener } from "../utils/listener";
import { Reducer } from "../utils/reducer";
import { State } from "../utils/state";
import { Store } from "../utils/store";
import { GreetState, getInitialGreetState, setupGreetingListeners, setupGreetingReducers } from "./greet/module";
import { TodoState, getInitialTodoState, setupTodoListeners, setupTodoReducers } from "./todos/module";

export type AppState = {
    greet: GreetState;
    todos: TodoState;
};

const initialState: AppState = {
    greet: getInitialGreetState(),
    todos: getInitialTodoState(),
};

export const store = new Store<AppState>(new State(initialState), new Reducer(), new Listener());

setupGreetingReducers(store);
setupGreetingListeners(store);

setupTodoReducers(store);
setupTodoListeners(store);
