import orctaLogo from "./purpleLogo.svg";
import { Book, Layers, Settings, Code, Sparkles, Cloud } from "lucide-react";
export function Welcome() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 py-12 bg-white dark:bg-black">
      {/* Logo + Heading */}
      <header className="flex flex-col items-center gap-6">
        <img src={orctaLogo} alt="Orcta" className="h-20 w-auto" />
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          Orcta Engineering
        </h1>
        <p className="text-base text-gray-600 dark:text-gray-400 text-center max-w-md">
          A focused hub for tools, docs, and the Orcta way of building resilient systems.
        </p>
      </header>

      {/* Resource Links */}
      <div className="mt-12 grid gap-4 sm:grid-cols-2 max-w-lg w-full">
        {resources.map(({ href, text, icon }) => (
          <a
            key={href}
            href={href}
            target="_blank"
            rel="noreferrer"
            className="group flex items-center gap-3 rounded-xl border border-gray-200 dark:border-gray-800 p-4 transition hover:shadow-md hover:border-blue-500 dark:hover:border-blue-400"
          >
            <div className="text-blue-600 dark:text-blue-400">{icon}</div>
            <span className="text-gray-800 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 font-medium">
              {text}
            </span>
          </a>
        ))}
      </div>

      {/* Philosophy */}
      <footer className="mt-16 text-center max-w-lg">
        <p className="italic text-sm text-gray-500 dark:text-gray-400">
          “At Orcta, we believe in clarity, craft, and resilience.
          Code should empower people, scale with systems,
          and carry our values forward.”
        </p>
      </footer>
    </main>
  );
}

const resources = [
  { href: "https://www.typescriptlang.org/docs/", text: "TypeScript Docs", icon: <Code size={20} /> },
  { href: "https://tanstack.com/query/latest", text: "TanStack Query Docs", icon: <Layers size={20} /> },
  { href: "https://docs.pmnd.rs/zustand/getting-started/introduction", text: "Zustand Docs", icon: <Settings size={20} /> },
  { href: "https://reactrouter.com/en/main", text: "React Router Docs", icon: <Book size={20} /> },
  { href: "https://tailwindcss.com/docs", text: "Tailwind Docs", icon: <Sparkles size={20} /> },
  {href:"https://axios-http.com/docs/intro",text:"Axios Docs",icon:<Cloud size={20} />}
];
