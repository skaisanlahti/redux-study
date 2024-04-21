import { sleep } from "../../utils/sleep";
import { Store } from "../../utils/store";
import { RootState } from "../store";
import { goodbye, hello, increment } from "./actions";

export function setupGreetingEffects(store: Store<RootState>) {
    store.addEffect((context) => {
        if (context.currentState.greetings.greeting === context.previousState.greetings.greeting) {
            return;
        }

        store.dispatch(increment());
    });

    store.addEffect((context) => {
        if (context.currentState.greetings.greeting === context.previousState.greetings.greeting) {
            return;
        }
    });

    store.addEffect(async (context) => {
        if (!hello.match(context.action)) {
            return;
        }

        await sleep(5000);

        store.dispatch(goodbye("Goodbye world"));
    });

    store.addEffect((context) => {
        console.log(context.action.key.description, "state changed?", context.currentState !== context.previousState);
    });

    store.addEffect(() => {
        if (Math.random() > 0.5) {
            throw new Error("random error in handler");
        }
    });
}
