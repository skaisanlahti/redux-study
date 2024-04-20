import { useAppDispatch, useAppSelector } from "../store/util";
import { todoRemoved, todoToggled } from "./todos";

export function TodoList() {
    const dispatch = useAppDispatch();
    const items = useAppSelector((state) => state.todos.items);
    return (
        <div>
            {items.map((item) => (
                <div key={item.id}>
                    <p>{item.task}</p>
                    <button onClick={() => dispatch(todoToggled(item.id))}>
                        {item.done ? "mark undone" : "mark done"}
                    </button>
                    <button onClick={() => dispatch(todoRemoved(item.id))}>remove</button>
                </div>
            ))}
        </div>
    );
}
