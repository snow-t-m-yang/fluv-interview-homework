"use client";

import { Input } from "./input";
import { useReducer, useState } from "react";
import { Button } from "./button";
import { v4 as uuidv4 } from "uuid";

type Todo = {
  title: string;
  id: string;
  text: string;
  completed: boolean;
};

type TodoAction =
  | { type: "ADD_TODO"; payload: Todo }
  | { type: "TOGGLE_TODO"; payload: string }
  | { type: "DELETE_TODO"; payload: string };

const initialState: Todo[] = [
  {
    title: "string",
    id: "string",
    text: "string",
    completed: false,
  },
];

const reducer = (state: Todo[], action: TodoAction) => {
  switch (action.type) {
    case "ADD_TODO":
      return [...state, action.payload];
    case "TOGGLE_TODO":
      return state.map((todo) => {
        if (todo.id === action.payload) {
          return { ...todo, completed: !todo.completed };
        }
        return todo;
      });
    case "DELETE_TODO":
      return state.filter((todo) => todo.id !== action.payload);
    default:
      return state;
  }
};

const TodoList = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [text, setText] = useState("");

  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <TodoItem todo={state} dispatch={dispatch} />
      <Input
        type="text"
        id="text"
        placeholder="Thinking..."
        onChange={(e) => setText(e.target.value)}
      />
      <p className="text-sm text-muted-foreground">
        What do you want to do next?
      </p>
      <Button
        onClick={() =>
          dispatch({
            type: "ADD_TODO",
            payload: {
              title: text,
              id: uuidv4(),
              text: text,
              completed: false,
            },
          })
        }
      >
        Add
      </Button>
    </div>
  );
};
export default TodoList;

type TodoItemProps = {
  todo: Todo[];
  dispatch: React.Dispatch<TodoAction>;
};

const TodoItem = ({ todo, dispatch }: TodoItemProps) => {
  return (
    <div className="flex flex-col items-center justify-between w-full px-4 py-2 bg-white rounded-md shadow-md">
      {todo.map((todo) => (
        <div key={todo.id} className="flex gap-5">
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => dispatch({ type: "TOGGLE_TODO", payload: todo.id })}
          />
          <p className="ml-2 text-sm">{todo.title}</p>
          <button
            className="text-sm text-red-500"
            onClick={() => dispatch({ type: "DELETE_TODO", payload: todo.id })}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};
