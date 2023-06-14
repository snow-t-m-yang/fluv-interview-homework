"use client";

import { Input } from "./input";
import { useEffect, useReducer, useRef, useState } from "react";
import { Button } from "./button";
import { v4 as uuidv4 } from "uuid";
import { Edit, StickyNote, Trash, XSquare } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { Textarea } from "./textarea";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";

type TodoItem = {
  id: string;
  task: string;
  completed: boolean;
  isEditing: boolean;
  isHighlighted?: boolean;
  hasDescription?: boolean;
  descriptionContent?: string;
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
    }
  | { type: "HIGHLIGHT_TODO"; payload: string }
  | { type: "REORDER_TODO"; payload: TodoItem[] };

// const initialState: TodoItem[] = [];

//! For testing purposes
const initialState: TodoItem[] = [
  {
    id: "1",
    task: "Complete assignment",
    completed: false,
    isEditing: false,
    hasDescription: true,
    descriptionContent: "This is the description for Task 1",
  },
  {
    id: "2",
    task: "Read a book",
    completed: false,
    isEditing: false,
    hasDescription: false,
    descriptionContent: undefined,
  },
  {
    id: "3",
    task: "Go grocery shopping",
    completed: true,
    isEditing: false,
    hasDescription: true,
    descriptionContent: "This is the description for Task 3",
  },
  {
    id: "4",
    task: "Exercise for 30 minutes",
    completed: false,
    isEditing: false,
    hasDescription: false,
    descriptionContent: undefined,
  },
  {
    id: "5",
    task: "Call a friend",
    completed: true,
    isEditing: false,
    hasDescription: true,
    descriptionContent: "This is the description for Task 5",
  },
  {
    id: "6",
    task: "Pay bills",
    completed: false,
    isEditing: false,
    hasDescription: false,
    descriptionContent: undefined,
  },
  {
    id: "7",
    task: "Clean the house",
    completed: true,
    isEditing: false,
    hasDescription: true,
    descriptionContent: "This is the description for Task 7",
  },
  {
    id: "8",
    task: "Walk the dog",
    completed: false,
    isEditing: false,
    hasDescription: false,
    descriptionContent: undefined,
  },
  {
    id: "9",
    task: "Write a blog post",
    completed: true,
    isEditing: false,
    hasDescription: true,
    descriptionContent: "This is the description for Task 9",
  },
  {
    id: "10",
    task: "Cook dinner",
    completed: false,
    isEditing: false,
    hasDescription: false,
    descriptionContent: undefined,
  },
  {
    id: "11",
    task: "Finish project",
    completed: true,
    isEditing: false,
    hasDescription: true,
    descriptionContent: "This is the description for Task 11",
  },
  {
    id: "12",
    task: "Attend meeting",
    completed: false,
    isEditing: false,
    hasDescription: false,
    descriptionContent: undefined,
  },
];

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
            hasDescription: !todo.hasDescription,
          };
        }
        return todo;
      });

    case "EDIT_DESCRIPTION":
      return state.map((todo) => {
        if (todo.id === action.payload.id) {
          return {
            ...todo,
            descriptionContent: action.payload.description,
          };
        }
        return todo;
      });

    case "HIGHLIGHT_TODO":
      return state.map((todo) => {
        if (todo.id === action.payload) {
          return {
            ...todo,
            isHighlighted: !todo.isHighlighted,
          };
        }
        return todo;
      });

    case "REORDER_TODO":
      return action.payload;

    default:
      return state;
  }
};

const TodoList = () => {
  const [isTesting, setIsTesting] = useState(false);
  const [state, dispatch] = useReducer(reducer, isTesting ? initialState : []);
  const [text, setText] = useState("");

  const listRef = useRef<HTMLUListElement | null>(null);

  const notifyDuplicate = () =>
    toast.error("This task already exists!\nSearch it!", {
      icon: "⚠️",
    });

  useEffect(() => {
    listRef.current?.lastElementChild?.scrollIntoView();
  }, [state.length]);

  const handleAddTodo = () => {
    if (!text) return;

    if (state.some((todo) => todo.task === text)) {
      notifyDuplicate();
      return;
    }

    dispatch({
      type: "ADD_TODO",
      payload: {
        id: uuidv4(),
        task: text,
        completed: false,
        isEditing: false,
        hasDescription: false,
        descriptionContent: "",
      },
    });

    setText("");
  };

  const handleSearchTodo = () => {
    if (!text) return;

    const target = state.find((todo) => todo.task === text);

    if (target) {
      const targetElement = document.getElementById(target.id);
      dispatch({ type: "HIGHLIGHT_TODO", payload: target.id });
      targetElement?.scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(() => {
        dispatch({ type: "HIGHLIGHT_TODO", payload: target.id });
      }, 2000);
    }
  };

  const onDragEndHandler = (result: DropResult) => {
    const { destination, source } = result;
    if (!destination) return;

    const items = Array.from(state);
    const [reorderedItem] = items.splice(source.index, 1);
    items.splice(destination.index, 0, reorderedItem);

    dispatch({ type: "REORDER_TODO", payload: items });
  };

  const handleTesting = () => {
    setIsTesting(!isTesting);
    if (isTesting) {
      dispatch({ type: "REORDER_TODO", payload: initialState });
    } else {
      dispatch({ type: "REORDER_TODO", payload: [] });
    }
  };

  return (
    <div className="flex relative justify-around flex-col  min-h-[100dvh] w-full max-w-[36rem] md:max-w-xl items-center gap-3">
      <h1 className="fixed top-0 z-10 flex items-center justify-center w-full h-16 gap-3 px-24 py-3 text-3xl text-gray-100 bg-gray-900 bg-gray-900/80 backdrop-blur-xl">
        Todo List
      </h1>

      <DragDropContext onDragEnd={onDragEndHandler}>
        <Droppable droppableId={"listId"}>
          {(provided) => (
            <ul
              ref={(ref) => {
                provided.innerRef(ref);
                listRef.current = ref;
              }}
              {...provided.droppableProps}
              className="absolute divide-y-2 w-full h-full px-5 pt-[12rem] overflow-y-auto  bottom-32"
            >
              <TodoItem todos={state} dispatch={dispatch} />
            </ul>
          )}
        </Droppable>
      </DragDropContext>

      <div className="fixed bottom-0 flex flex-col items-center justify-center w-full h-32 gap-3 text-gray-100 bg-gray-900/80 backdrop-blur-xl">
        <Input
          type="text"
          className="w-64 caret-gray-300 placeholder:text-gray-400"
          id="text"
          autoComplete="off"
          placeholder="What do you want to do next?"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="flex gap-1">
          <Button className="w-[7.5rem] dark" onClick={() => handleAddTodo()}>
            Add
          </Button>
          <Button
            className="w-[7.5rem] dark"
            onClick={() => handleSearchTodo()}
          >
            Search
          </Button>
        </div>
        <Button
          className="w-[3.5rem] dark fixed bottom-4 left-5"
          onClick={() => handleTesting()}
        >
          {isTesting ? "Test" : "Clear"}
        </Button>
      </div>

      <Toaster
        toastOptions={{
          error: {
            style: {
              background: "red",
              color: "#fff",
            },
          },
        }}
      />
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
  todos: TodoItem[];
  dispatch: React.Dispatch<TodoAction>;
};

const TodoItem = ({ todos, dispatch }: TodoItemProps) => {
  return (
    <>
      {todos.map((todo: TodoItem, index) => (
        <Draggable
          key={todo.id}
          draggableId={todo.id}
          index={index}
          isDragDisabled={todo.isEditing}
        >
          {(provided, snapshot) => (
            <li
              id={todo.id}
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              className={`${snapshot.isDragging ? "bg-gray-100" : ""} ${
                todo.completed ? "text-gray-500 line-through" : "text-gray-900"
              } ${
                todo.isHighlighted ? "text-yellow-400" : ""
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

                {todo.hasDescription ? (
                  <Textarea
                    placeholder="Add description"
                    value={todo.descriptionContent}
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
                  {todo.hasDescription ? (
                    <XSquare size={20} />
                  ) : (
                    <StickyNote size={20} />
                  )}
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
            </li>
          )}
        </Draggable>
      ))}
    </>
  );
};
