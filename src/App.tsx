import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import {
    addTodo,
    fetchRandomTodos,
    fetchTodos,
    removeTodo,
    selectTodoLoading,
    selectTodos,
    toggleTodo,
} from "./store/todo/todoStore";
import { useEffect, useState } from "react";
import { uuid } from "./utils/uuid";

function App() {
    const dispatch = useAppDispatch();
    const todos = useAppSelector(selectTodos);
    const loading = useAppSelector(selectTodoLoading);
    const [task, setTask] = useState("");

    function toggle(id: string) {
        dispatch(toggleTodo(id));
    }

    function random() {
        dispatch(fetchRandomTodos());
    }

    function add() {
        if (!task) {
            return;
        }
        dispatch(addTodo({ id: uuid(), task, done: false }));
        setTask("");
    }

    function remove(id: string) {
        dispatch(removeTodo(id));
    }

    useEffect(() => {
        dispatch(fetchTodos());
    }, []);

    return (
        <>
            <div>
                <a href="https://vitejs.dev" target="_blank">
                    <img src={viteLogo} className="logo" alt="Vite logo" />
                </a>
                <a href="https://react.dev" target="_blank">
                    <img src={reactLogo} className="logo react" alt="React logo" />
                </a>
            </div>
            <h1>Vite + React</h1>
            <button onClick={random}>random</button>
            <input type="text" value={task} onChange={(e) => setTask(e.target.value)} />
            <button onClick={add}>Add</button>
            {loading && <p>loading</p>}
            {todos.map((t) => {
                return (
                    <div key={t.id} className="card">
                        <p>{t.task}</p>
                        <button onClick={() => toggle(t.id)}>{t.done ? "done" : "not done"}</button>
                        <button onClick={() => remove(t.id)}>remove</button>
                    </div>
                );
            })}
        </>
    );
}

export default App;
