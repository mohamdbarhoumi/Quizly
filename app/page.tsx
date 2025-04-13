import SignInButton from "@/components/SignInButton";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { Sparkles, Bot, BookOpen, Users } from "lucide-react";

export default async function Home() {
  const session = await getServerSession();
  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen bg-background text-foreground transition-colors duration-300 relative overflow-x-hidden">
      {/* Animated Gradient Glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-gradient-to-tr from-purple-500 via-indigo-500 to-pink-500 opacity-25 blur-3xl animate-pulse dark:opacity-15" />
      </div>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-24 px-6">
        <div className="mb-6">
          <div className="bg-primary/20 p-4 rounded-full inline-block">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Create Smart Quizzes in Seconds
        </h1>
        <p className="text-muted-foreground max-w-xl mb-8">
          Quizzzy lets you build quizzes instantly using AI – for teachers, learners, teams, and curious minds.
        </p>
        <SignInButton
          text="Sign In with Google"
          className="bg-primary text-primary-foreground hover:bg-primary/90 transition px-6 py-3 rounded-lg font-semibold"
        />
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-muted/50 dark:bg-muted/10">
        <div className="max-w-5xl mx-auto grid gap-8 md:grid-cols-3 text-center">
          <div>
            <Bot className="mx-auto h-10 w-10 text-purple-600 dark:text-purple-400 mb-4" />
            <h3 className="text-xl font-semibold">AI-Powered Creation</h3>
            <p className="text-muted-foreground mt-2">Just type a topic and let AI build the quiz for you.</p>
          </div>
          <div>
            <BookOpen className="mx-auto h-10 w-10 text-indigo-600 dark:text-indigo-400 mb-4" />
            <h3 className="text-xl font-semibold">Instant Learning</h3>
            <p className="text-muted-foreground mt-2">Get quizzes that help you understand, not just memorize.</p>
          </div>
          <div>
            <Users className="mx-auto h-10 w-10 text-pink-600 dark:text-pink-400 mb-4" />
            <h3 className="text-xl font-semibold">For Everyone</h3>
            <p className="text-muted-foreground mt-2">Perfect for educators, students, teams, and solo learners.</p>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 px-6 max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-10">How It Works</h2>
        <ol className="space-y-6 text-left md:text-center">
          <li>
            <span className="font-bold">1.</span> Sign in with Google securely.
          </li>
          <li>
            <span className="font-bold">2.</span> Type a topic or subject.
          </li>
          <li>
            <span className="font-bold">3.</span> Let Quizzzy generate a quiz instantly using AI.
          </li>
          <li>
            <span className="font-bold">4.</span> Share or take the quiz – learn, compete, or revise!
          </li>
        </ol>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6 bg-muted/30 dark:bg-muted/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-10">What People Say</h2>
          <div className="grid gap-8 md:grid-cols-2">
            <div className="bg-background p-6 rounded-xl shadow-md">
              <p className="text-muted-foreground italic">
                "I created a quiz for my students in under 2 minutes — and they loved it!"
              </p>
              <p className="mt-4 font-semibold">— Sarah, Teacher</p>
            </div>
            <div className="bg-background p-6 rounded-xl shadow-md">
              <p className="text-muted-foreground italic">
                "Finally, a tool that makes studying feel like a game. 10/10!"
              </p>
              <p className="mt-4 font-semibold">— Yassine, University Student</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 text-center text-sm text-muted-foreground border-t border-border mt-10">
        <p>© {new Date().getFullYear()} Quizzzy. All rights reserved.</p>
        <div className="mt-2 space-x-4">
          <a href="#" className="hover:underline">Privacy</a>
          <a href="#" className="hover:underline">Terms</a>
          <a href="#" className="hover:underline">Contact</a>
        </div>
      </footer>
    </main>
  );
}
