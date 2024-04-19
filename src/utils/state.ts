import { useCallback, useSyncExternalStore } from "react";

type SubscribeFunc<T> = (value: T) => void;
type UnsubscribeFunc = () => void;
type UpdateFunc<T> = (value: T) => T;

export class State<T> {
    private value: T;
    private subscribers: SubscribeFunc<T>[] = [];
    private disposed = false;

    constructor(initialValue: T) {
        this.value = initialValue;
    }

    public get(): T {
        this.throwIfDisposed();
        return this.value;
    }

    public set(newValue: T): void {
        this.throwIfDisposed();
        this.value = newValue;
        this.notify();
    }

    public update(updater: UpdateFunc<T>): void {
        this.throwIfDisposed();
        this.value = updater(this.value);
        this.notify();
    }

    public subscribe(subscriber: SubscribeFunc<T>): UnsubscribeFunc {
        this.throwIfDisposed();
        this.subscribers.push(subscriber);
        subscriber(this.value);
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
            subscriber(this.value);
        }
    }

    private throwIfDisposed() {
        if (this.disposed) {
            throw new Error("can't use disposed state");
        }
    }
}

export function useValue<T>(state: State<T>): T {
    const subscribe = useCallback(
        (onStoreChange: SubscribeFunc<T>) => state.subscribe(onStoreChange),
        [state],
    );
    const getSnapshot = useCallback(() => state.get(), [state]);
    return useSyncExternalStore(subscribe, getSnapshot);
}
