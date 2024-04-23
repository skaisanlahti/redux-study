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

export function setupGreetingHandlers(store: Store<RootState>) {
    store.addHandler(GreetingAction.greetingClicked, (state, greeting) => {
        state.greet.greeting = greeting;
    });

    store.addHandler(GreetEffect.respondedToGreeting, (state, greeting) => {
        state.greet.greeting = greeting;
    });

    store.addHandler(GreetingAction.greetingChanged, (state) => {
        state.greet.count += 1;
    });

    store.addHandler(GreetingAction.greetingChanged, (state) => {
        state.greet.count += 2;
    });
}

export function setupGreetingEffects(store: Store<RootState>) {
    store.addEffect((context) => {
        if (context.currentState.greet.greeting === context.previousState.greet.greeting) {
            return;
        }

        context.dispatch(GreetingAction.greetingChanged());
    });

    store.addEffect(async (context) => {
        if (!GreetingAction.greetingClicked.match(context.action)) {
            return;
        }

        await sleep(5000);

        context.dispatch(GreetEffect.respondedToGreeting("Goodbye world"));
    });

    store.addEffect(logAction);

    store.addEffect(() => {
        throwErrorPercent(10);
    });
}

function logAction(context: DispatchContext<RootState>) {
    console.log(
        `${context.action.key.description}: state ${context.currentState === context.previousState ? "did not change" : "changed"}`,
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
