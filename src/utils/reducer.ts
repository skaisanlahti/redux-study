import { Draft, produce } from "immer";
import { Action, ActionCreator } from "./action";
import { Cleanup } from "./disposer";

export type Handler<TState, TPayload> = (state: Draft<TState>, payload: TPayload) => Draft<TState> | void;

export class Reducer<TState> {
    private handlersByType = new Map<string, Handler<TState, any>[]>();

    public addCase<TPayload>(action: ActionCreator<TPayload>, handler: Handler<TState, TPayload>): Cleanup {
        const handlers = this.handlersByType.get(action.type) ?? [];
        if (handlers.length === 0) {
            this.handlersByType.set(action.type, handlers);
        }

        handlers.push(handler);
        return () => {
            handlers.splice(handlers.indexOf(handler), 1);
            if (handlers.length === 0) {
                this.handlersByType.delete(action.type);
            }
        };
    }

    public reduce<TPayload>(state: TState, action: Action<TPayload>): TState {
        const handlers = this.handlersByType.get(action.type);
        if (!handlers) {
            return state;
        }

        let nextState = state;
        for (const handler of handlers) {
            nextState = produce<TState>(nextState, (draft) => {
                handler(draft, action.payload);
            });
        }

        return nextState;
    }
}
