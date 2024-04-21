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
    let lastResult: any;

    let resultFunc = createSelectorArgs.pop();
    const dependencies = createSelectorArgs[0];

    let memoizedResultFunc = memoize(function () {
        return resultFunc.apply(null, arguments);
    });

    const selector = argsMemoize(function selector() {
        const inputSelectorResults = collectInputSelectorResults(dependencies, arguments);

        lastResult = memoizedResultFunc.apply(null, inputSelectorResults);
        return lastResult;
    });

    return selector;
}

function memoize(func: any) {
    return func;
}

function argsMemoize(func: any) {
    return func;
}

function collectInputSelectorResults(deps: any, args: any) {
    console.log(deps);
    return args;
}
