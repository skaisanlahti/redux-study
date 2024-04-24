import { createAction } from "../../utils/action";
import { sleep } from "../../utils/sleep";
import { DispatchContext, Store } from "../../utils/store";
import { RootState } from "../store";

export type GreetState = {
    greeting: string;
    count: number;
};

export function getInitialGreetState(): GreetState {
    return {
        greeting: "",
        count: 0,
    };
}

export const GreetSelector = {
    selectGreeting: (state: RootState) => state.greet.greeting,
    selectCount: (state: RootState) => state.greet.count,
};

export const GreetingAction = {
    greetingClicked: createAction<string>("[Greeting] greeting clicked"),
    greetingChanged: createAction("[Greeting] greeting changed"),
    temporary: createAction("temporary action from component"),
};

export const GreetEffect = {
    respondedToGreeting: createAction<string>("[GreetingEffect] responded to greeting"),
};

export function setupGreetingReducers(store: Store<RootState>) {
    store.addReducer(GreetingAction.greetingClicked, (state, greeting) => {
        state.greet.greeting = greeting;
    });

    store.addReducer(GreetEffect.respondedToGreeting, (state, greeting) => {
        state.greet.greeting = greeting;
    });

    store.addReducer(GreetingAction.greetingChanged, (state) => {
        state.greet.count += 1;
    });

    store.addReducer(GreetingAction.greetingChanged, (state) => {
        state.greet.count += 2;
    });
}

export function setupGreetingListeners(store: Store<RootState>) {
    store.addListener((context) => {
        if (context.currentState.greet.greeting === context.previousState.greet.greeting) {
            return;
        }

        context.dispatch(GreetingAction.greetingChanged());
    });

    store.addListener(async (context) => {
        if (!GreetingAction.greetingClicked.match(context.action)) {
            return;
        }

        await sleep(5000);

        context.dispatch(GreetEffect.respondedToGreeting("Goodbye world"));
    });

    store.addListener(logAction);

    store.addListener(() => {
        throwErrorPercent(10);
    });
}

function logAction(context: DispatchContext<RootState>) {
    console.log(
        `${context.action.type}: state ${context.currentState === context.previousState ? "did not change" : "changed"}`,
    );
}

function throwErrorPercent(percent: number) {
    try {
        if (Math.random() * 100 < percent) {
            throw new Error("random error in handler");
        }
    } catch (e) {
        console.log("caught error correctly", e);
    }
}
