import { useSyncExternalStore } from "react";
import { State, Subscriber } from "./state";
import { createTypeSafeContext } from "./context";
import { Action, ActionCreator } from "./action";
import { Handler, Reducer } from "./reducer";
import { Cleanup } from "./disposer";
import { Effect, Listener } from "./listener";

export type Dispatch<TPayload = unknown> = (action: Action<TPayload>) => void;

export class Store<TState> {
    constructor(
        private state: State<TState>,
        private reducer: Reducer<TState>,
        private listener: Listener<TState>,
    ) {}

    public dispatch = <TPayload>(action: Action<TPayload>): void => {
        const state = this.state.get();
        const nextState = this.reducer.reduce(state, action);
        this.state.set(nextState);
        this.listener.trigger({
            action,
            currentState: nextState,
            previousState: state,
            dispatch: this.dispatch,
            getState: this.getState,
        });
    };

    public getState = (): TState => {
        return this.state.get();
    };

    public subscribe = (subscriber: Subscriber<TState>): Cleanup => {
        return this.state.subscribe(subscriber);
    };

    public addReducer = <TPayload>(action: ActionCreator<TPayload>, handler: Handler<TState, TPayload>): Cleanup => {
        return this.reducer.addCase(action, handler);
    };

    public addListener = (effect: Effect<TState>): Cleanup => {
        return this.listener.addListener(effect);
    };
}

export function createStoreHooks<TState>() {
    const [useStore, StoreProvider, StoreConsumer] = createTypeSafeContext<Store<TState>>();

    function useStoreDispatch() {
        const store = useStore();
        return store.dispatch;
    }

    function useStoreValue<TResult>(selector: (state: TState) => TResult): TResult {
        const store = useStore();
        return useSyncExternalStore(store.subscribe, () => {
            return selector(store.getState());
        });
    }

    return {
        useStoreDispatch,
        useStoreValue,
        useStore,
        StoreProvider,
        StoreConsumer,
    } as const;
}
