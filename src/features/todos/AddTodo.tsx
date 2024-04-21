import { useDispatch, useSelector } from "../hooks";
import { AddTodoAction } from "./store";

export function AddTodo() {
    const dispatch = useDispatch();
    const task = useSelector((state) => state.todos.task);
    const error = useSelector((state) => state.todos.error);

    return (
        <div className="add-todo">
            <input
                type="text"
                value={task}
                onChange={(e) => {
                    dispatch(AddTodoAction.taskChanged(e.target.value));
                }}
            />
            <button
                onClick={() => {
                    dispatch(AddTodoAction.taskSubmitted(task));
                }}
            >
                submit
            </button>
            <p>{error}</p>
        </div>
    );
}
