export type Action<TPayload extends unknown> = {
    key: Symbol;
    payload: TPayload;
};

export type ActionCreator<TPayload> = {
    (payload: TPayload): Action<TPayload>;
    key: Symbol;
    match: (action: Action<any>) => action is Action<TPayload>;
};

export function createAction<TPayload = void>(description: string = "unnamed action"): ActionCreator<TPayload> {
    const key = Symbol.for(description);
    function factory(payload: TPayload): Action<TPayload> {
        return {
            key,
            payload,
        };
    }

    factory.key = key;
    factory.match = (action: Action<any>): action is Action<TPayload> => {
        return key === action.key;
    };

    return factory;
}
