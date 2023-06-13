import TodoList from "../components/TodoList";

export default function Home() {
  return (
    <main className="flex  flex-col items-center justify-around min-h-[100dvh] ">
      <TodoList />
    </main>
  );
}
