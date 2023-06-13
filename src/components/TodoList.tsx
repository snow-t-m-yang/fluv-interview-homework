"use client";

import { Input } from "./input";
import { useReducer, useState } from "react";
import { Button } from "./button";
import { v4 as uuidv4 } from "uuid";
import { Edit, StickyNote, Trash } from "lucide-react";
import { Checkbox } from "./checkbox";

type TodoItem = {
  title: string;
  id: string;
  task: string;
  completed: boolean;
  isEditing: boolean;
  description?: TodoItemDescription;
};

type TodoItemDescription = {
  hasDescription: boolean;
  descriptionContent: string;
};

type TodoAction =
  | { type: "ADD_TODO"; payload: TodoItem }
  | { type: "DELETE_TODO"; payload: string }
  | { type: "ISFINISHED_TODO"; payload: string }
  | { type: "ISEDIT_TODO"; payload: string }
  | { type: "EDIT_TODO_CONTENT"; payload: { id: string; task: string } }
  | { type: "TOGGLE_DESCRIPTION"; payload: string }
  | {
      type: "EDIT_DESCRIPTION";
      payload: { id: string; description: string };
    };

const initialState: TodoItem[] = [];

const reducer = (state: TodoItem[], action: TodoAction) => {
  switch (action.type) {
    case "ADD_TODO":
      state.push(action.payload);
      return state;

    case "ISEDIT_TODO":
      return state.map((todo) => {
        if (todo.id === action.payload) {
          return { ...todo, isEditing: !todo.isEditing };
        }
        return todo;
      });

    case "EDIT_TODO_CONTENT":
      return state.map((todo) => {
        if (todo.id === action.payload.id) {
          return { ...todo, task: action.payload.task };
        }
        return todo;
      });

    case "ISFINISHED_TODO":
      return state.map((todo) => {
        if (todo.id === action.payload) {
          return { ...todo, completed: !todo.completed };
        }
        return todo;
      });

    case "DELETE_TODO":
      return state.filter((todo) => todo.id !== action.payload);

    case "TOGGLE_DESCRIPTION":
      return state.map((todo) => {
        if (todo.id === action.payload) {
          return {
            ...todo,
            description: {
              ...todo.description,
              hasDescription: !todo.description?.hasDescription,
            },
          };
        }
        return todo;
      });

    case "EDIT_DESCRIPTION":
      return state.map((todo) => {
        if (todo.id === action.payload.id) {
          return {
            ...todo,
            description: {
              ...todo.description,
              descriptionContent: action.payload.description,
            },
          };
        }
        return todo;
      });

    default:
      return state;
  }
};

const TodoList = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [text, setText] = useState("");

  const handleAddTodo = () => {
    if (!text) return;
    dispatch({
      type: "ADD_TODO",
      payload: {
        title: text,
        id: uuidv4(),
        task: text,
        completed: false,
        isEditing: false,
        description: {
          hasDescription: false,
          descriptionContent: "",
        },
      },
    });

    setText("");
  };
  return (
    <div className="flex flex-col min-h-full w-full max-w-[36rem] md:max-w-xl items-center gap-1.5">
      <div className="overflow-y-auto w-full max-h-[50%] ">
        <TodoItem todo={state} dispatch={dispatch} />
      </div>
      <div className="w-full space-y-3">
        <Input
          type="text"
          id="text"
          placeholder="What do you want to do next?"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <Button className="w-full" onClick={() => handleAddTodo()}>
          Add
        </Button>
      </div>
    </div>
  );
};
export default TodoList;

/**
 *
 * # I put two components in one file for simplicity
 *
 * */

type TodoItemProps = {
  todo: TodoItem[];
  dispatch: React.Dispatch<TodoAction>;
};

const TodoItem = ({ todo, dispatch }: TodoItemProps) => {
  return (
    <div className="flex flex-col w-full divide-y-2 rounded-md shadow-md">
      {todo.map((todo) => (
        <div
          key={todo.id}
          className={`${
            todo.completed ? "text-gray-500 line-through" : "text-gray-900"
          } flex justify-between py-2 items-center  w-full gap-x-2`}
        >
          <input
            type="checkbox"
            className="h-6 w-6 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
            checked={todo.completed}
            onChange={() =>
              dispatch({ type: "ISFINISHED_TODO", payload: todo.id })
            }
          />
          <div className="text-xl">
            {todo.isEditing ? (
              <Input
                type="text"
                value={todo.task}
                className="text-xl"
                onChange={(e) =>
                  dispatch({
                    type: "EDIT_TODO_CONTENT",
                    payload: { id: todo.id, task: e.target.value },
                  })
                }
              />
            ) : (
              <p>{todo.task}</p>
            )}

            {todo.description?.hasDescription ? (
              <Input
                type="text"
                placeholder="Add description"
                value={todo.description.descriptionContent}
                className="h-8 text-gray-500"
                onChange={(e) =>
                  dispatch({
                    type: "EDIT_DESCRIPTION",
                    payload: { id: todo.id, description: e.target.value },
                  })
                }
              />
            ) : (
              ""
            )}
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() =>
                dispatch({ type: "ISEDIT_TODO", payload: todo.id })
              }
            >
              <Edit size={20} />
            </Button>
            <Button
              onClick={() =>
                dispatch({ type: "TOGGLE_DESCRIPTION", payload: todo.id })
              }
            >
              <StickyNote size={20} />
            </Button>
            <Button
              className="text-sm text-red-500"
              onClick={() =>
                dispatch({ type: "DELETE_TODO", payload: todo.id })
              }
            >
              <Trash size={20} />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};
