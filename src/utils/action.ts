import { uuid } from "./uuid";

export type Action<TPayload = unknown> = {
    type: string;
    payload: TPayload;
};

export type ActionCreator<TPayload> = {
    (payload: TPayload): Action<TPayload>;
    type: string;
    match: (action: Action<any>) => action is Action<TPayload>;
};

export function createAction<TPayload = void>(type: string = uuid()): ActionCreator<TPayload> {
    function factory(payload: TPayload): Action<TPayload> {
        return {
            type: type,
            payload,
        };
    }

    factory.type = type;
    factory.match = (action: Action<any>): action is Action<TPayload> => {
        return type === action.type;
    };

    return factory;
}
