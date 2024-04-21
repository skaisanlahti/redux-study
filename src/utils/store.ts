import { Draft, produce } from "immer";
import { useSyncExternalStore } from "react";
import { State, Subscriber, Unsubscriber } from "./state";
import { createTypeSafeContext } from "./context";

export type Action<TPayload extends unknown> = {
    key: Symbol;
    payload: TPayload;
};

export type ActionCreator<TPayload> = {
    (payload: TPayload): Action<TPayload>;
    key: Symbol;
    match: (action: Action<any>) => action is Action<TPayload>;
};

export type Dispatch<TPayload = unknown> = (action: Action<TPayload>) => void;
export type Handler<TState, TPayload> = (state: Draft<TState>, action: Action<TPayload>) => Draft<TState> | void;
export type EffectContext<TState, TPayload> = {
    action: Action<TPayload>;
    currentState: TState;
    previousState: TState;
};

export type Effect<TState, TPayload> = (context: EffectContext<TState, TPayload>) => any;

export function createAction<TPayload>(description: string = "unnamed action"): ActionCreator<TPayload> {
    const key = Symbol.for(description);
    function factory(payload: TPayload): Action<TPayload> {
        return {
            key,
            payload,
        };
    }

    factory.key = key;
    factory.match = (action: Action<any>): action is Action<TPayload> => {
        return key === action.key;
    };

    return factory;
}

export class Store<TState> {
    private state: State<TState>;
    private handlersByKey = new Map<Symbol, Handler<TState, any>>();
    private effects: Effect<TState, any>[] = [];

    constructor(initialState: TState) {
        this.state = new State(initialState);
    }

    public addHandler = <TPayload>(action: ActionCreator<TPayload>, handler: Handler<TState, TPayload>): void => {
        this.handlersByKey.set(action.key, handler);
    };

    public addEffect = <TPayload>(effect: Effect<TState, TPayload>): void => {
        this.effects.push(effect);
    };

    public dispatch = (action: Action<unknown>) => {
        const state = this.state.get();
        let newState = state;

        const handler = this.handlersByKey.get(action.key);
        if (handler) {
            newState = produce<TState>(state, (draft) => {
                handler(draft, action);
            });

            this.state.set(newState);
        }

        const context = {
            action,
            currentState: newState,
            previousState: state,
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
        const providedStore = useStore();
        return providedStore.dispatch;
    }

    function useStoreValue<R>(selector: (state: TState) => R) {
        const providedStore = useStore();
        return useSyncExternalStore(providedStore.subscribe, () => {
            return selector(providedStore.getState());
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
