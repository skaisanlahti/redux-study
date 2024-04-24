import { Action } from "./action";
import { Dispatch, Store } from "./store";

export type Middleware<TState, TReturn> = (store: Store<TState>) => (next: Dispatch) => (action: Action) => TReturn;

export function applyMiddleware<TState, TMiddleware extends Middleware<TState, unknown>[]>(
    store: Store<TState>,
    middlewares: { [K in keyof TMiddleware]: TMiddleware[K] },
): Store<TState> {
    let dispatch = store.dispatch;
    for (const middleware of middlewares) {
        dispatch = middleware(store)(dispatch);
    }

    store.dispatch = dispatch;
    return store;
}
