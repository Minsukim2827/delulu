import ModeToggle from "./mode-toggle";

export default function Header() {
  return (
    <header className="flex justify-center p-4 border-b gap-4">
      <h1 className="text-2xl">
        <span className="font-bold">Delulu</span>{" "}
        <span className="text-slate-400">AI</span>
      </h1>
      <ModeToggle />
    </header>
  );
}
