import { useDispatch, useSelector } from "../hooks";
import { TodoListAction } from "./store";

export function TodoList() {
    const dispatch = useDispatch();
    const items = useSelector((state) => state.todos.items);

    return (
        <div className="todo-list">
            {items.map((item) => (
                <div key={item.id} className="item">
                    <p className="task">{item.task}</p>
                    <button onClick={() => dispatch(TodoListAction.todoToggled(item.id))}>
                        {item.done ? "mark undone" : "mark done"}
                    </button>
                    <button onClick={() => dispatch(TodoListAction.todoRemoved(item.id))}>remove</button>
                </div>
            ))}
        </div>
    );
}
