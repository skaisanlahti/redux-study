import { useDispatch, useSelector } from "../hooks";
import { hello } from "./actions";

export function Greeting() {
    const dispatch = useDispatch();
    const greeting = useSelector((state) => state.greetings.greeting);
    const count = useSelector((state) => state.greetings.count);

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
        </div>
    );
}
