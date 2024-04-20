import { createAction } from "@reduxjs/toolkit";
import { useAppDispatch, useAppSelector } from "../store/hooks";

const taskChanged = createAction<string>("[AddTodo] task changed");
const taskSubmitted = createAction<string>("[AddTodo] task submitted");

export const AddTodoActions = {
    taskChanged,
    taskSubmitted,
};

export function AddTodo() {
    const dispatch = useAppDispatch();
    const task = useAppSelector((state) => state.todos.task);
    const error = useAppSelector((state) => state.todos.error);

    return (
        <div>
            <input
                type="text"
                value={task}
                onChange={(e) => {
                    dispatch(taskChanged(e.target.value));
                }}
            />
            <button
                onClick={() => {
                    dispatch(taskSubmitted(task));
                }}
            >
                submit
            </button>
            <p>{error}</p>
        </div>
    );
}
