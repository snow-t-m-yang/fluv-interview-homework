"use client";

import { Input } from "./input";
import { useReducer, useState } from "react";
import { Button } from "./button";
import { v4 as uuidv4 } from "uuid";

type TodoItem = {
  title: string;
  id: string;
  task: string;
  completed: boolean;
  isEditing: boolean;
};

type TodoAction =
  | { type: "ADD_TODO"; payload: TodoItem }
  | { type: "TOGGLE_TODO"; payload: string }
  | { type: "DELETE_TODO"; payload: string }
  | { type: "EDIT_TODO"; payload: string }
  | { type: "EDIT_TODO_CONTENT"; payload: { id: string; task: string } };

const initialState: TodoItem[] = [];

const reducer = (state: TodoItem[], action: TodoAction) => {
  switch (action.type) {
    case "ADD_TODO":
      state.push(action.payload);
      return state;

    case "EDIT_TODO_CONTENT":
      return state.map((todo) => {
        if (todo.id === action.payload.id) {
          return { ...todo, task: action.payload.task };
        }
        return todo;
      });

    case "EDIT_TODO":
      return state.map((todo) => {
        if (todo.id === action.payload) {
          return { ...todo, isEditing: !todo.isEditing };
        }
        return todo;
      });

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

  const handleAddTodo = () => {
    dispatch({
      type: "ADD_TODO",
      payload: {
        title: text,
        id: uuidv4(),
        task: text,
        completed: false,
        isEditing: false,
      },
    });
    setText("");
  };
  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <TodoItem todo={state} dispatch={dispatch} text={text} />
      <Input
        type="text"
        id="text"
        placeholder="Thinking..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <p className="text-sm text-muted-foreground">
        What do you want to do next?
      </p>
      <Button onClick={() => handleAddTodo()}>Add</Button>
    </div>
  );
};
export default TodoList;

type TodoItemProps = {
  todo: TodoItem[];
  dispatch: React.Dispatch<TodoAction>;
  text: string;
};

const TodoItem = ({ todo, dispatch, text }: TodoItemProps) => {
  return (
    <div className="flex flex-col items-center justify-between w-full px-4 py-2 bg-white rounded-md shadow-md gap-y-5">
      {todo.map((todo) => (
        <div key={todo.id} className="flex gap-5">
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => dispatch({ type: "TOGGLE_TODO", payload: todo.id })}
          />
          {todo.isEditing ? (
            <input
              type="text"
              value={todo.task}
              onChange={(e) =>
                dispatch({
                  type: "EDIT_TODO_CONTENT",
                  payload: { id: todo.id, task: e.target.value },
                })
              }
            />
          ) : (
            <p className="text-sm">{todo.task}</p>
          )}

          <Button
            onClick={() => dispatch({ type: "EDIT_TODO", payload: todo.id })}
          >
            Edit
          </Button>
          <Button
            className="text-sm text-red-500"
            onClick={() => dispatch({ type: "DELETE_TODO", payload: todo.id })}
          >
            Delete
          </Button>
        </div>
      ))}
    </div>
  );
};
