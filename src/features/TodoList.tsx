import { createAction } from "@reduxjs/toolkit";
import { useAppDispatch, useAppSelector } from "../store/hooks";

const todoToggled = createAction<string>("[TodoList] todo toggled");
const todoRemoved = createAction<string>("[TodoList] todo removed");

export const TodoListActions = {
    todoToggled,
    todoRemoved,
};

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
