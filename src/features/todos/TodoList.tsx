import { useDispatch, useSelector } from "../hooks";
import { Todo, TodoListAction, TodoSelector } from "./module";

export function TodoList() {
    const todoItems = useSelector(TodoSelector.selectTodoItems);
    const doneItems = useSelector(TodoSelector.selectDoneItems);

    return (
        <div className="todo-list">
            <h2>Todo</h2>
            {todoItems.map((item) => (
                <Item key={item.id} item={item} />
            ))}

            <h2>Done</h2>
            {doneItems.map((item) => (
                <Item key={item.id} item={item} />
            ))}
        </div>
    );
}

function Item({ item }: { item: Todo }) {
    const dispatch = useDispatch();
    return (
        <div className="item">
            <p className="task">{item.task}</p>
            <button onClick={() => dispatch(TodoListAction.todoToggled(item.id))}>{item.done ? "todo" : "done"}</button>
            <button onClick={() => dispatch(TodoListAction.todoRemoved(item.id))}>remove</button>
        </div>
    );
}
