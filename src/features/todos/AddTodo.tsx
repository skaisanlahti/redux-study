import { useDispatch, useSelector } from "../hooks";
import { AddTodoAction, TodoSelector } from "./module";

export function AddTodo() {
    const dispatch = useDispatch();
    const task = useSelector(TodoSelector.selectTask);
    const error = useSelector(TodoSelector.selectError);

    return (
        <div className="add-todo">
            <form
                className="form"
                onSubmit={(e) => {
                    e.preventDefault();
                }}
            >
                <input
                    type="text"
                    placeholder="Description..."
                    value={task}
                    onChange={(e) => {
                        dispatch(AddTodoAction.taskChanged(e.target.value));
                    }}
                />
                <button
                    type="submit"
                    onClick={() => {
                        dispatch(AddTodoAction.taskSubmitted(task));
                    }}
                >
                    submit
                </button>
            </form>
            <p className="error">{error}</p>
        </div>
    );
}
