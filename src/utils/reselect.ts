export function createReselector<TState, TResult, TSelectors extends any[]>(
    selectors: { [K in keyof TSelectors]: (state: any) => TSelectors[K] },
    transform: (...args: TSelectors) => TResult,
): (state: TState) => TResult {
    let cachedState: TState;
    let cachedInputs = new Array(selectors.length);
    let cachedResult: TResult;

    function reselect(state: TState) {
        if (Object.is(state, cachedState)) {
            return cachedResult;
        }

        cachedState = state;
        let changes = 0;
        for (let i = 0; i < selectors.length; i++) {
            const input = selectors[i](state);
            if (Object.is(cachedInputs[i], input)) {
                continue;
            }

            cachedInputs[i] = input;
            changes++;
        }

        if (changes === 0) {
            return cachedResult;
        }

        cachedResult = transform(...(cachedInputs as TSelectors));
        return cachedResult;
    }

    return reselect;
}
