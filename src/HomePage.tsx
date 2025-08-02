import { useMutation } from "convex/react";
import { Button } from "./components/ui/button";
import { api } from "../convex/_generated/api";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { cn, useDarkMode } from "./lib/utils";
import { Code2, Sparkles, Zap, FileCode, Palette, Play } from "lucide-react";

export default function HomePage() {
  const createProject = useMutation(api.projects.create);
  const navigate = useNavigate();

  const [isProjectCreating, setIsProjectCreating] = useState(false);

  useEffect(() => {
    async function eventHandler(e: KeyboardEvent) {
      if (e.key === "v") {
        setIsProjectCreating(true);
        const projectId = await createProject({ type: "classic" });
        setIsProjectCreating(false);
        navigate(`/${projectId}`);
      } else if (e.key === "r") {
        setIsProjectCreating(true);
        const projectId = await createProject({ type: "sandpack" });
        setIsProjectCreating(false);
        navigate(`/${projectId}?mode=react`);
      }
    }
    window.addEventListener("keyup", eventHandler);

    return () => window.removeEventListener("keyup", eventHandler);
  }, [createProject, navigate]);

  const [isDark] = useDarkMode();
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-900">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <header className="mb-12 text-center">
          <div className="mb-4 flex items-center justify-center">
            <div className="relative">
              <Code2 className="h-12 w-12 text-blue-600 dark:text-blue-400" />
              <Sparkles className="absolute -top-1 -right-1 h-4 w-4 animate-pulse text-yellow-500" />
            </div>
          </div>
          <h1 className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-5xl font-bold text-transparent">
            Execute
          </h1>
          <p className="mx-auto max-w-2xl text-xl text-gray-600 dark:text-gray-300">
            A powerful web-based code playground for rapid prototyping and experimentation
          </p>
        </header>

        {/* Features Grid */}
        <div className="mb-12 grid gap-6 md:grid-cols-3">
          <FeatureCard
            icon={<FileCode className="h-6 w-6" />}
            title="HTML, CSS & JS"
            description="Write and test vanilla web technologies with live preview"
          />
          <FeatureCard
            icon={<ReactIcon className="h-6 w-6 fill-[#61DAFB]" />}
            title="React Support"
            description="Build modern React components with JSX and ES6+ features"
          />
          <FeatureCard
            icon={<Zap className="h-6 w-6" />}
            title="Instant Preview"
            description="See your changes live as you type with real-time updates"
          />
          <FeatureCard
            icon={<Code2 className="h-6 w-6" />}
            title="Vim Mode"
            description="Efficient editing with vim keybindings and commands"
          />
          <FeatureCard
            icon={<Palette className="h-6 w-6" />}
            title="TailwindCSS"
            description="Rapid styling with utility-first CSS framework"
          />
          <FeatureCard
            icon={<Play className="h-6 w-6" />}
            title="Share Projects"
            description="Collaborate and share your creations with unique URLs"
          />
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="mb-6 text-2xl font-semibold text-gray-800 dark:text-gray-200">Start coding in seconds</h2>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              disabled={isProjectCreating}
              onClick={async () => {
                setIsProjectCreating(true);
                const projectId = await createProject({ type: "classic" });
                setIsProjectCreating(false);
                navigate(`/${projectId}`);
              }}
              className="min-w-48 border-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg transition-all duration-200 hover:from-blue-700 hover:to-blue-800 hover:shadow-xl"
            >
              <JsIcon className="mr-2 h-5 w-5 fill-current" />
              Create Vanilla Project
              <Kbd className="ml-3">V</Kbd>
            </Button>
            <Button
              variant="outline"
              size="lg"
              disabled={isProjectCreating}
              onClick={async () => {
                setIsProjectCreating(true);
                const projectId = await createProject({ type: "sandpack" });
                setIsProjectCreating(false);
                navigate(`/${projectId}?mode=react`);
              }}
              className="min-w-48 border-2 border-blue-600 text-blue-600 transition-all duration-200 hover:bg-blue-600 hover:text-white"
            >
              <ReactIcon className="mr-2 h-5 w-5 fill-[#61DAFB]" />
              Create React Project
              <Kbd>R</Kbd>
            </Button>
          </div>
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Press <Kbd className="inline-flex h-5 text-xs">V</Kbd> or <Kbd className="inline-flex h-5 text-xs">R</Kbd>{" "}
            anywhere to quickly create a project
          </p>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow duration-200 hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-3 text-blue-600 dark:text-blue-400">{icon}</div>
      <h3 className="mb-2 font-semibold text-gray-800 dark:text-gray-200">{title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
    </div>
  );
}

function JsIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M0 0h24v24H0V0zm22.034 18.276c-.175-1.095-.888-2.015-3.003-2.873-.736-.345-1.554-.585-1.797-1.14-.091-.33-.105-.51-.046-.705.15-.646.915-.84 1.515-.66.39.12.75.42.976.9 1.034-.676 1.034-.676 1.755-1.125-.27-.42-.404-.601-.586-.78-.63-.705-1.469-1.065-2.834-1.034l-.705.089c-.676.165-1.32.525-1.71 1.005-1.14 1.291-.811 3.541.569 4.471 1.365 1.02 3.361 1.244 3.616 2.205.24 1.17-.87 1.545-1.966 1.41-.811-.18-1.26-.586-1.755-1.336l-1.83 1.051c.21.48.45.689.81 1.109 1.74 1.756 6.09 1.666 6.871-1.004.029-.09.24-.705.074-1.65l.046.067zm-8.983-7.245h-2.248c0 1.938-.009 3.864-.009 5.805 0 1.232.063 2.363-.138 2.711-.33.689-1.18.601-1.566.48-.396-.196-.597-.466-.83-.855-.063-.105-.11-.196-.127-.196l-1.825 1.125c.305.63.75 1.172 1.324 1.517.855.51 2.004.675 3.207.405.783-.226 1.458-.691 1.811-1.411.51-.93.402-2.07.397-3.346.012-2.054 0-4.109 0-6.179l.004-.056z" />
    </svg>
  );
}

function ReactIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M14.23 12.004a2.236 2.236 0 01-2.235 2.236 2.236 2.236 0 01-2.236-2.236 2.236 2.236 0 012.235-2.236 2.236 2.236 0 012.236 2.236zm2.648-10.69c-1.346 0-3.107.96-4.888 2.622-1.78-1.653-3.542-2.602-4.887-2.602-.41 0-.783.093-1.106.278-1.375.793-1.683 3.264-.973 6.365C1.98 8.917 0 10.42 0 12.004c0 1.59 1.99 3.097 5.043 4.03-.704 3.113-.39 5.588.988 6.38.32.187.69.275 1.102.275 1.345 0 3.107-.96 4.888-2.624 1.78 1.654 3.542 2.603 4.887 2.603.41 0 .783-.09 1.106-.275 1.374-.792 1.683-3.263.973-6.365C22.02 15.096 24 13.59 24 12.004c0-1.59-1.99-3.097-5.043-4.032.704-3.11.39-5.587-.988-6.38a2.167 2.167 0 00-1.092-.278zm-.005 1.09v.006c.225 0 .406.044.558.127.666.382.955 1.835.73 3.704-.054.46-.142.945-.25 1.44a23.476 23.476 0 00-3.107-.534A23.892 23.892 0 0012.769 4.7c1.592-1.48 3.087-2.292 4.105-2.295zm-9.77.02c1.012 0 2.514.808 4.11 2.28-.686.72-1.37 1.537-2.02 2.442a22.73 22.73 0 00-3.113.538 15.02 15.02 0 01-.254-1.42c-.23-1.868.054-3.32.714-3.707.19-.09.4-.127.563-.132zm4.882 3.05c.455.468.91.992 1.36 1.564-.44-.02-.89-.034-1.345-.034-.46 0-.915.01-1.36.034.44-.572.895-1.096 1.345-1.565zM12 8.1c.74 0 1.477.034 2.202.093.406.582.802 1.203 1.183 1.86.372.64.71 1.29 1.018 1.946-.308.655-.646 1.31-1.013 1.95-.38.66-.773 1.288-1.18 1.87a25.64 25.64 0 01-4.412.005 26.64 26.64 0 01-1.183-1.86c-.372-.64-.71-1.29-1.018-1.946a25.17 25.17 0 011.013-1.954c.38-.66.773-1.286 1.18-1.868A25.245 25.245 0 0112 8.098zm-3.635.254c-.24.377-.48.763-.704 1.16-.225.39-.435.782-.635 1.174-.265-.656-.49-1.31-.676-1.947.64-.15 1.315-.283 2.015-.386zm7.26 0c.695.103 1.365.23 2.006.387-.18.632-.405 1.282-.66 1.933a25.952 25.952 0 00-1.345-2.32zm3.063.675c.484.15.944.317 1.375.498 1.732.74 2.852 1.708 2.852 2.476-.005.768-1.125 1.74-2.857 2.475-.42.18-.88.342-1.355.493a23.966 23.966 0 00-1.1-2.98c.45-1.017.81-2.01 1.085-2.964zm-13.395.004c.278.96.645 1.957 1.1 2.98a23.142 23.142 0 00-1.086 2.964c-.484-.15-.944-.318-1.37-.5-1.732-.737-2.852-1.706-2.852-2.474 0-.768 1.12-1.742 2.852-2.476.42-.18.88-.342 1.356-.494zm11.678 4.28c.265.657.49 1.312.676 1.948-.64.157-1.316.29-2.016.39a25.819 25.819 0 001.341-2.338zm-9.945.02c.2.392.41.783.64 1.175.23.39.465.772.705 1.143a22.005 22.005 0 01-2.006-.386c.18-.63.406-1.282.66-1.933zM17.92 16.32c.112.493.2.968.254 1.423.23 1.868-.054 3.32-.714 3.708-.147.09-.338.128-.563.128-1.012 0-2.514-.807-4.11-2.28.686-.72 1.37-1.536 2.02-2.44 1.107-.118 2.154-.3 3.113-.54zm-11.83.01c.96.234 2.006.415 3.107.532.66.905 1.345 1.727 2.035 2.446-1.595 1.483-3.092 2.295-4.11 2.295a1.185 1.185 0 01-.553-.132c-.666-.38-.955-1.834-.73-3.703.054-.46.142-.944.25-1.438zm4.56.64c.44.02.89.034 1.345.034.46 0 .915-.01 1.36-.034-.44.572-.895 1.095-1.345 1.565-.455-.47-.91-.993-1.36-1.565z" />
    </svg>
  );
}

function Kbd({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "ml-3 flex h-5 items-center justify-center gap-1 rounded border px-1 font-sans text-[0.7rem] font-medium select-none",
        className,
      )}
    >
      {children}
    </div>
  );
}
