import { sleep } from "../../utils/sleep";
import { EffectContext, Store } from "../../utils/store";
import { RootState } from "../store";
import { goodbye, hello, increment } from "./actions";

export function setupGreetingEffects(store: Store<RootState>) {
    store.addEffect((context) => {
        if (context.currentState.greetings.greeting === context.previousState.greetings.greeting) {
            return;
        }

        context.dispatch(increment());
    });

    store.addEffect(async (context) => {
        if (!hello.match(context.action)) {
            return;
        }

        await sleep(5000);

        context.dispatch(goodbye("Goodbye world"));
    });

    store.addEffect(logAction);

    //store.addEffect(() => {
    //    try {
    //        if (Math.random() > 0.5) {
    //            throw new Error("random error in handler");
    //        }
    //    } catch (e) {
    //        console.log("caught error correctly", e);
    //    }
    //});
}

function logAction(context: EffectContext<RootState, unknown>) {
    console.log(
        `action: ${context.action.key.description}, state ${context.currentState === context.previousState ? "did not change" : "changed"}`,
    );
}
