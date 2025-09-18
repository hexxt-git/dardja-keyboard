import { Card, CardContent } from "@/components/ui/card";
import { Translator } from "./Translator";

export function App() {
  return (
    <div className="container mx-auto p-8 text-center relative z-10 w-fit">
      <Card className="bg-card border-muted">
        <CardContent className="pt-6">
          <h1 className="text-5xl font-bold my-4 leading-tight">
            Dardja translator
          </h1>
          <p>
            write your{" "}
            <a
              href="https://en.wikipedia.org/wiki/Arabic_chat_alphabet"
              target="_blank"
              className="bg-accent text-accent-foreground px-2 py-1 rounded-md hover:underline"
            >
              Arabizi
            </a>{" "}
            bellow and get it instantly translated
          </p>
          <p>example: "wech rak hbi" -&gt; "وش راك حبي"</p>
          <Translator />
          <p className="mt-4">
            app by{" "}
            <a
              href="https://www.linkedin.com/in/zeghdani"
              target="_blank"
              className="hover:underline"
              rel="noopener noreferrer"
            >
              Zeghdani Salah
            </a>
            . open-sourced on{" "}
            <a
              href="https://github.com/hexxt-git/dardja-keyboard"
              target="_blank"
              className="hover:underline"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
