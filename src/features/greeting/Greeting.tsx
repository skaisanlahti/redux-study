import { useEffect, useState } from "react";
import { useDispatch, useSelector, useStore } from "../hooks";
import { hello, temporary } from "./actions";
import { selectDone } from "../../utils/reselect";

export function Greeting() {
    const dispatch = useDispatch();
    const greeting = useSelector((state) => state.greetings.greeting);
    const count = useSelector((state) => state.greetings.count);
    const [open, setOpen] = useState(false);

    return (
        <div className="greeting">
            <h1>
                {greeting} {count}
            </h1>
            <button
                onClick={() => {
                    dispatch(hello("Hello world"));
                }}
            >
                greet
            </button>
            <button onClick={() => setOpen((v) => !v)}>toggle hidden</button>
            {open && <HiddenComponent />}
        </div>
    );
}

function HiddenComponent() {
    const store = useStore();
    const dones = useSelector(selectDone);

    useEffect(() => {
        const remove = store.addEffect(() => {
            console.log("temporary effect fired");
        });
        return remove;
    }, [store]);

    return (
        <div>
            <button
                onClick={() => {
                    store.dispatch(temporary());
                }}
            >
                fire temp action {dones!.length}
            </button>
            <h2>done todos</h2>
            <pre>{JSON.stringify(dones)}</pre>
        </div>
    );
}
