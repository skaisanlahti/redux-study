import { Draft, produce } from "immer";
import { useSyncExternalStore } from "react";
import { State, Subscriber, Unsubscriber } from "./state";
import { createTypeSafeContext } from "./context";
import { Action, ActionCreator } from "./action";

export type DispatchContext<TState, TPayload = unknown> = {
    action: Action<TPayload>;
    currentState: TState;
    previousState: TState;
    dispatch: Dispatch<TState, TPayload>;
};

export type Dispatch<TState, TPayload> = (action: Action<TPayload>) => DispatchContext<TState, TPayload>;
export type Handler<TState, TPayload> = (state: Draft<TState>, payload: TPayload) => Draft<TState> | void;
export type Effect<TState, TPayload = unknown> = (context: DispatchContext<TState, TPayload>) => any;
export type Remover = () => void;

export class Store<TState> {
    private state: State<TState>;
    private handlersByKey = new Map<string, Handler<TState, any>[]>();
    private effects: Effect<TState>[] = [];

    constructor(initialState: TState) {
        this.state = new State(initialState);
    }

    public addHandler = <TPayload>(action: ActionCreator<TPayload>, handler: Handler<TState, TPayload>): Remover => {
        const handlers = this.handlersByKey.get(action.type) ?? [];
        if (handlers.length === 0) {
            this.handlersByKey.set(action.type, handlers);
        }

        handlers.push(handler);
        return () => {
            handlers.splice(handlers.indexOf(handler), 1);
            if (handlers.length === 0) {
                this.handlersByKey.delete(action.type);
            }
        };
    };

    public addEffect = (effect: Effect<TState>): Remover => {
        this.effects.push(effect);
        return () => {
            this.effects.splice(this.effects.indexOf(effect), 1);
        };
    };

    public dispatch = <TPayload>(action: Action<TPayload>): DispatchContext<TState, TPayload> => {
        const currentState = this.state.get();
        let nextState = currentState;

        const handlers = this.handlersByKey.get(action.type);
        if (handlers) {
            for (const handler of handlers) {
                nextState = produce<TState>(nextState, (draft) => {
                    handler(draft, action.payload);
                });
            }

            this.state.set(nextState);
        }

        const context = {
            action,
            currentState: nextState,
            previousState: currentState,
            dispatch: this.dispatch,
        };

        for (const effect of this.effects) {
            const task = async () => {
                try {
                    await effect(context);
                } catch (e) {
                    console.warn("uncaught error in effect", e);
                }
            };

            task();
        }

        return context;
    };

    public getState = (): TState => {
        return this.state.get();
    };

    public subscribe = (subscriber: Subscriber<TState>): Unsubscriber => {
        return this.state.subscribe(subscriber);
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
