import { Store } from "../utils/store";
import { GreetState, getInitialGreetState, setupGreetingEffects, setupGreetingHandlers } from "./greet/module";
import { TodoState, getInitialTodoState, setupTodoEffects, setupTodoHandlers } from "./todos/module";

export type RootState = {
    greet: GreetState;
    todos: TodoState;
};

export const store = new Store<RootState>({
    greet: getInitialGreetState(),
    todos: getInitialTodoState(),
});

setupGreetingHandlers(store);
setupGreetingEffects(store);

setupTodoHandlers(store);
setupTodoEffects(store);
