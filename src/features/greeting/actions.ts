import { createAction } from "../../utils/store";

export const hello = createAction<string>("[Greeting] hello");
export const goodbye = createAction<string>("[Greeting] goodbye");
export const increment = createAction<void>();
export const temporary = createAction<void>("temporary action from component");
