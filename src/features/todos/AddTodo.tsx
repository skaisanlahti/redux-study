import { useState } from "react";
import { useDispatch, useSelector } from "../hooks";
import { AddTodoAction, TodoSelector } from "./module";

export function AddTodo() {
    const dispatch = useDispatch();
    const error = useSelector(TodoSelector.selectError);
    const [task, setTask] = useState("");

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
                    onBlur={() => {
                        dispatch(AddTodoAction.taskChanged(task));
                    }}
                    onChange={(e) => {
                        setTask(e.target.value);
                    }}
                />
                <button
                    type="submit"
                    onClick={() => {
                        dispatch(AddTodoAction.taskSubmitted(task));
                        setTask("");
                    }}
                >
                    submit
                </button>
            </form>
            <p className="error">{error}</p>
        </div>
    );
}
