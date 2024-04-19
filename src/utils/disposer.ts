type DisposeFunc = () => void;

export class Disposer {
    private disposers: DisposeFunc[] = [];

    public add(disposer: DisposeFunc): Disposer {
        this.disposers.push(disposer);
        return this;
    }

    public dispose(): void {
        for (const dispose of this.disposers) {
            dispose();
        }

        this.disposers = [];
    }
}
