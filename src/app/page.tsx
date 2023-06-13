import TodoList from "../components/TodoList";

export default function Home() {
  return (
    <main className="flex p-7 flex-col items-center justify-between min-h-[100dvh] ">
      <h1 className="text-3xl">Todo List</h1>
      <TodoList />
    </main>
  );
}
