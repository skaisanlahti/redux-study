import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { AddTodo } from "./features/todos/AddTodo";
import { TodoList } from "./features/todos/TodoList";
import { Greeting } from "./features/greeting/Greeting";

function App() {
    return (
        <div className="app">
            <div className="logo-container">
                <a href="https://vitejs.dev" target="_blank">
                    <img src={viteLogo} className="logo" alt="Vite logo" />
                </a>
                <a href="https://react.dev" target="_blank">
                    <img src={reactLogo} className="logo react" alt="React logo" />
                </a>
            </div>
            <Greeting />
            <AddTodo />
            <TodoList />
        </div>
    );
}

export default App;
