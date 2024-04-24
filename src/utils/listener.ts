import { Action, ActionCreator, createAction } from "./action";
import { Cleanup } from "./disposer";
import { Dispatch, Store } from "./store";

type AddListener<TState = unknown> = ActionCreator<Effect<TState>> & {
    withTypes: <TState>() => AddListener<TState>;
};

export const addListener = createAction<Effect>("listenerMiddleware/add") as AddListener;
addListener.withTypes = <TState>() => addListener as AddListener<TState>;
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

    public addListener = (effect: Effect<TState>): Cleanup => {
        const safeEffect = async (context: EffectContext<TState>) => {
            try {
                await effect(context);
            } catch (e) {
                console.warn(`uncaugh error in effect after ${context.action.type}`, e);
            }
        };

        this.effects.push(safeEffect);
        return () => {
            this.effects.splice(this.effects.indexOf(safeEffect), 1);
        };
    };

    public trigger = (context: EffectContext<TState>) => {
        for (const effect of this.effects) {
            effect(context);
        }
    };

    public middleware = (store: Store<TState>) => (next: Dispatch) => (action: Action) => {
        let remove = () => {};
        if (addListener.match(action)) {
            remove = this.addListener(action.payload);
        }

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

        this.trigger(context);
        return remove;
    };
}
