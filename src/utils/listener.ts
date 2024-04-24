import { Cleanup } from "./disposer";
import { DispatchContext } from "./store";

export type Effect<TState, TPayload = unknown> = (context: DispatchContext<TState, TPayload>) => any;

export class Listener<TState> {
    private effects: Effect<TState>[] = [];

    public addEffect(effect: Effect<TState>): Cleanup {
        const safeEffect = async (context: DispatchContext<TState>) => {
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
    }

    public trigger(context: DispatchContext<TState>) {
        for (const effect of this.effects) {
            effect(context);
        }
    }
}
