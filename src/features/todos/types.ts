export type Todo = {
    id: string;
    task: string;
    done: boolean;
};

export type TodoState = {
    task: string;
    error: string;
    items: Todo[];
};
