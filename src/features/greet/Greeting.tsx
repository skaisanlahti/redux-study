import { useEffect, useState } from "react";
import { useDispatch, useSelector, useStore } from "../hooks";
import { GreetSelector, GreetingAction } from "./module";

export function Greeting() {
    const dispatch = useDispatch();
    const greeting = useSelector(GreetSelector.selectGreeting);
    const count = useSelector(GreetSelector.selectCount);
    const [open, setOpen] = useState(false);

    return (
        <div className="greeting">
            <h1>
                {greeting} {count > 0 && count}
            </h1>
            <button
                onClick={() => {
                    dispatch(GreetingAction.greetingClicked("Hello world"));
                }}
            >
                greet
            </button>
            <button
                onClick={() => {
                    setOpen((v) => !v);
                }}
            >
                toggle hidden
            </button>
            {open && <HiddenComponent />}
        </div>
    );
}

function HiddenComponent() {
    const store = useStore();

    useEffect(() => {
        const remove = store.addListener(() => {
            console.log("temporary effect fired");
        });
        return remove;
    }, [store]);

    return (
        <div>
            <button
                onClick={() => {
                    store.dispatch(GreetingAction.temporary());
                }}
            >
                fire temp action
            </button>
        </div>
    );
}
