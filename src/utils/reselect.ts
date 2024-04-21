import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../features/store";

export const selectDone = createSelector([(state: RootState) => state.todos.items], (todos) => {
    console.log("ran");
    return todos.filter((t) => t.done);
});

export const mySelectDone = myCreateSelector([(state: RootState) => state.todos.items], (todos: any) => {
    console.log("ran");
    return todos.filter((t: any) => t.done);
});

export function myCreateSelector(...createSelectorArgs: any[]) {
    console.log(createSelectorArgs);
    return;
}
