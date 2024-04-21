import { Store } from "../../utils/store";
import { RootState } from "../store";
import { goodbye, hello, increment } from "./actions";

export function setupGreetingHandlers(store: Store<RootState>) {
    store.addHandler(hello, (state, action) => {
        state.greetings.greeting = action.payload;
    });

    store.addHandler(goodbye, (state, action) => {
        state.greetings.greeting = action.payload;
    });

    store.addHandler(increment, (state) => {
        state.greetings.count += 1;
    });
}
