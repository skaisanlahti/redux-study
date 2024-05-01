import { BehaviorSubject, Subject, map, tap, withLatestFrom } from "rxjs";
import { Action, ActionCreator } from "./action";
import { Handler } from "./reducer";
import { produce } from "immer";
import { Effect, EffectContext } from "./listener";
import { Subscriber } from "./state";

export function createStore<TState>(initialState: TState) {
    const state = new BehaviorSubject(initialState);
    const actions = new Subject<Action>();
    const effects = new Subject<EffectContext<TState>>();
    const reducersByActionType = new Map<string, Handler<TState, any>[]>();

    function dispatch<TPayload>(action: Action<TPayload>): void {
        actions.next(action);
    }

    function getState(): TState {
        return state.getValue();
    }

    function subscribe(subscriber: Subscriber<TState>) {
        const subscription = state.subscribe(subscriber);
        return () => {
            subscription.unsubscribe();
        };
    }

    function addReducer<TPayload>(action: ActionCreator<TPayload>, reducer: Handler<TState, TPayload>) {
        const handlers = reducersByActionType.get(action.type) ?? [];
        if (handlers.length === 0) {
            reducersByActionType.set(action.type, handlers);
        }

        handlers.push(reducer);
        return () => {
            handlers.splice(handlers.indexOf(reducer), 1);
            if (handlers.length === 0) {
                reducersByActionType.delete(action.type);
            }
        };
    }

    function addListener(effect: Effect<TState>) {
        const subscription = effects.subscribe(effect);
        return () => {
            subscription.unsubscribe();
        };
    }

    actions
        .pipe(
            withLatestFrom(state),
            map(([action, state]) => {
                let nextState = state;
                const handlers = reducersByActionType.get(action.type);
                if (handlers) {
                    for (const handler of handlers) {
                        nextState = produce(nextState, (state) => {
                            handler(state, action);
                        });
                    }
                }

                return {
                    action,
                    currentState: nextState,
                    previousState: state,
                    dispatch,
                    getState,
                };
            }),
            tap((context) => {
                state.next(context.currentState);
            }),
            tap((context) => {
                effects.next(context);
            }),
        )
        .subscribe();

    return {
        dispatch,
        getState,
        subscribe,
        addReducer,
        addListener,
    };
}
