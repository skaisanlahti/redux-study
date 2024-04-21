import { createAction } from "@reduxjs/toolkit";

export const AddTodoActions = {
    taskChanged: createAction<string>("[AddTodo] task changed"),
    taskSubmitted: createAction<string>("[AddTodo] task submitted"),
};

export const TodoListActions = {
    todoToggled: createAction<string>("[TodoList] todo toggled"),
    todoRemoved: createAction<string>("[TodoList] todo removed"),
};
