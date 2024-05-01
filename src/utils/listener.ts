import { Action, ActionCreator, createAction } from "./action";
import { Cleanup } from "./disposer";
import { Dispatch, Store } from "./store";

type AddListener<TState = unknown> = ActionCreator<Effect<TState>> & {
    withTypes: <TState>() => AddListener<TState>;
};
type RemoveListener<TState = unknown> = ActionCreator<Effect<TState>> & {
    withTypes: <TState>() => RemoveListener<TState>;
};

export const addListener = createAction<Effect>("listenerMiddleware/add") as AddListener;
addListener.withTypes = <TState>() => addListener as AddListener<TState>;

export const removeListener = createAction<Effect>("listenerMiddleware/remove") as RemoveListener;
removeListener.withTypes = <TState>() => removeListener as RemoveListener<TState>;

export type EffectContext<TState> = {
    action: Action;
    currentState: TState;
    previousState: TState;
    dispatch: Dispatch;
    getState: () => TState;
};

export type Effect<TState = unknown> = (context: EffectContext<TState>) => any;

export class Listener<TState> {
    private effects: Effect<TState>[] = [];

    public addListener(effect: Effect<TState>): Cleanup {
        this.effects.push(effect);
        return () => {
            this.effects.splice(this.effects.indexOf(effect), 1);
        };
    }

    public trigger(context: EffectContext<TState>) {
        for (const effect of this.effects) {
            effect(context);
        }
    }
}

export function createListenerMiddleware<TState>(listener: Listener<TState>) {
    return (store: Store<TState>) => (next: Dispatch) => (action: Action) => {
        const previousState = store.getState();
        next(action);
        const currentState = store.getState();
        const context = {
            action,
            currentState,
            previousState,
            dispatch: store.dispatch,
            getState: store.getState,
        };

        listener.trigger(context);
    };
}
