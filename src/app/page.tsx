import TodoList from "../components/TodoList";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-between min-h-screen p-24 ">
      <h1>Todo List</h1>
      <TodoList />
    </main>
  );
}
