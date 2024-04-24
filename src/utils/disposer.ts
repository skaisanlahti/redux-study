export type Cleanup = () => void;

export class Disposer {
    private disposers: Cleanup[] = [];

    public add(dispose: Cleanup): Disposer {
        this.disposers.push(dispose);
        return this;
    }

    public dispose(): void {
        for (const disposer of this.disposers) {
            disposer();
        }

        this.disposers = [];
    }
}
