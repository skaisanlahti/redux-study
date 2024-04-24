import { useSyncExternalStore } from "react";
import { State, Subscriber } from "./state";
import { createTypeSafeContext } from "./context";
import { Action, ActionCreator } from "./action";
import { Effect, Listener } from "./listener";
import { Handler, Reducer } from "./reducer";
import { Cleanup } from "./disposer";

export type DispatchContext<TState, TPayload = unknown> = {
    action: Action<TPayload>;
    currentState: TState;
    previousState: TState;
    dispatch: Dispatch<TState, TPayload>;
};

export type Dispatch<TState, TPayload> = (action: Action<TPayload>) => DispatchContext<TState, TPayload>;

export class Store<TState> {
    constructor(
        private state: State<TState>,
        private reducer: Reducer<TState>,
        private listener: Listener<TState>,
    ) {}

    public dispatch = <TPayload>(action: Action<TPayload>): DispatchContext<TState, TPayload> => {
        const state = this.state.get();
        const nextState = this.reducer.reduce(state, action);
        const context = {
            action,
            currentState: nextState,
            previousState: state,
            dispatch: this.dispatch,
        };

        this.state.set(nextState);
        this.listener.trigger(context);
        return context;
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

    public addListener = (listener: Effect<TState>): Cleanup => {
        return this.listener.addEffect(listener);
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
