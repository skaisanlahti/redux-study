type DisposeFunc = () => void;

export class Disposer {
    private disposers: DisposeFunc[] = [];

    public add(disposer: DisposeFunc): Disposer {
        this.disposers.push(disposer);
        return this;
    }

    public dispose(): void {
        for (const disposer of this.disposers) {
            disposer();
        }

        this.disposers = [];
    }
}
