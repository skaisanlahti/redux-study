import { Cleanup } from "./disposer";

export type Subscriber<TState> = (state: TState) => void;
export type Updater<TState> = (state: TState) => TState;

export class State<TState> {
    private currentState: TState;
    private subscribers: Subscriber<TState>[] = [];

    constructor(initialState: TState) {
        this.currentState = initialState;
    }

    public get(): TState {
        return this.currentState;
    }

    public set(newState: TState): void {
        this.currentState = newState;
        this.notify();
    }

    public update(updater: Updater<TState>): void {
        this.currentState = updater(this.currentState);
        this.notify();
    }

    public subscribe(subscriber: Subscriber<TState>): Cleanup {
        this.subscribers.push(subscriber);
        subscriber(this.currentState);
        return () => {
            this.subscribers.splice(this.subscribers.indexOf(subscriber), 1);
        };
    }

    private notify(): void {
        for (const subscriber of this.subscribers) {
            subscriber(this.currentState);
        }
    }
}
