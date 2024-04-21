export type Subscriber<TState> = (state: TState) => void;
export type Unsubscriber = () => void;
export type Updater<TState> = (state: TState) => TState;

export class State<TState> {
    private currentState: TState;
    private subscribers: Subscriber<TState>[] = [];
    private disposed = false;

    constructor(initialState: TState) {
        this.currentState = initialState;
    }

    public get(): TState {
        this.throwIfDisposed();
        return this.currentState;
    }

    public set(newState: TState): void {
        this.throwIfDisposed();
        this.currentState = newState;
        this.notify();
    }

    public update(updater: Updater<TState>): void {
        this.throwIfDisposed();
        this.currentState = updater(this.currentState);
        this.notify();
    }

    public subscribe(subscriber: Subscriber<TState>): Unsubscriber {
        this.throwIfDisposed();
        this.subscribers.push(subscriber);
        subscriber(this.currentState);
        return () => {
            const index = this.subscribers.findIndex((s) => s === subscriber);
            if (index != -1) {
                this.subscribers.splice(index, 1);
            }
        };
    }

    public dispose(): void {
        if (this.disposed) {
            return;
        }

        this.disposed = true;
        this.subscribers = [];
    }

    private notify(): void {
        for (const subscriber of this.subscribers) {
            subscriber(this.currentState);
        }
    }

    private throwIfDisposed() {
        if (this.disposed) {
            throw new Error("can't use disposed state");
        }
    }
}
