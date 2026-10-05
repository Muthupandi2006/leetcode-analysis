import Link from "next/link";
import { ArrowRight, Brain, Target, Users, CheckCircle2, Code2, TrendingUp, Link as LinkIcon, BarChart3, Clock } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative px-4 py-20 md:py-32 flex flex-col items-center justify-center text-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.1)_0,transparent_50%)]" />
        <div className="z-10 max-w-3xl space-y-8">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground leading-tight">
            Understand Your Coding.<br/>
            <span className="text-accent">Improve Your Future.</span>
          </h1>
          <p className="text-lg md:text-xl text-muted max-w-2xl mx-auto">
            Analyze your LeetCode activity, understand your coding patterns, and discover where your skills may take you.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link 
              href="/analyze" 
              className="w-full sm:w-auto px-8 py-3 bg-accent hover:bg-accent-hover text-background font-semibold rounded-xl text-base transition-colors flex items-center justify-center gap-2"
            >
              <LinkIcon className="w-5 h-5" />
              Analyze My LeetCode Profile
            </Link>
            <Link 
              href="/analyze/demo" 
              className="w-full sm:w-auto px-8 py-3 border border-border hover:border-border-hover bg-card hover:bg-card-hover text-foreground font-medium rounded-xl text-base transition-colors"
            >
              Try Demo
            </Link>
          </div>
        </div>
      </section>

      {/* You choose. We analyze. */}
      <section className="px-4 py-16 bg-card border-y border-border">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold">You choose. We analyze.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-background border border-border flex flex-col items-center text-center">
              <Target className="w-10 h-10 text-accent mb-4" />
              <h3 className="text-lg font-semibold mb-2">Select what matters</h3>
              <p className="text-sm text-muted">Choose exactly which analyses you need without overwhelming yourself.</p>
            </div>
            <div className="p-6 rounded-2xl bg-background border border-border flex flex-col items-center text-center">
              <Brain className="w-10 h-10 text-accent mb-4" />
              <h3 className="text-lg font-semibold mb-2">See only what you asked for</h3>
              <p className="text-sm text-muted">No dashboard overload. Clean, focused insights tailored to your choices.</p>
            </div>
            <div className="p-6 rounded-2xl bg-background border border-border flex flex-col items-center text-center">
              <TrendingUp className="w-10 h-10 text-accent mb-4" />
              <h3 className="text-lg font-semibold mb-2">Get actionable insights</h3>
              <p className="text-sm text-muted">Clear, simple results that tell you exactly what you need to improve.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="px-4 py-24 max-w-7xl mx-auto w-full">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">How It Works</h2>
          <p className="text-muted">Four simple steps to understand your coding journey.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { step: 1, title: "Connect", desc: "Paste your LeetCode profile URL", icon: LinkIcon },
            { step: 2, title: "Choose", desc: "Select the analyses you want", icon: CheckCircle2 },
            { step: 3, title: "Analyze", desc: "We crunch the numbers for you", icon: BarChart3 },
            { step: 4, title: "Understand", desc: "Get clear, actionable insights", icon: Brain }
          ].map((item) => (
            <div key={item.step} className="p-6 rounded-2xl bg-card border border-border relative">
              <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-accent text-background font-bold flex items-center justify-center">
                {item.step}
              </div>
              <item.icon className="w-8 h-8 text-accent mb-4 mt-2" />
              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
              <p className="text-muted text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* For Students & Mentors */}
      <section className="px-4 py-24 bg-card border-t border-border">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          <div id="for-students" className="p-8 rounded-3xl bg-background border border-border hover:border-border-hover transition-colors">
            <Code2 className="w-12 h-12 text-accent mb-6" />
            <h2 className="text-3xl font-bold mb-2">For Students</h2>
            <h3 className="text-xl text-muted mb-6">Know where you stand.</h3>
            <p className="text-foreground/80 mb-8">
              Take control of your learning. Our self-analysis tools help you uncover hidden patterns in your practice and guide you toward mastering algorithms effectively.
            </p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-accent shrink-0" />
                <span className="text-sm text-foreground/80">Identify your weakest topics before interviews</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-accent shrink-0" />
                <span className="text-sm text-foreground/80">Track your consistency and practice frequency</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-accent shrink-0" />
                <span className="text-sm text-foreground/80">Benchmark your progress against realistic goals</span>
              </li>
            </ul>
            <Link href="/analyze" className="inline-flex items-center gap-2 text-accent hover:text-accent-hover font-semibold">
              Analyze your profile <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div id="for-mentors" className="p-8 rounded-3xl bg-background border border-border hover:border-border-hover transition-colors">
            <Users className="w-12 h-12 text-accent mb-6" />
            <h2 className="text-3xl font-bold mb-2">For Mentors</h2>
            <h3 className="text-xl text-muted mb-6">Understand your mentees better.</h3>
            <p className="text-foreground/80 mb-8">
              Provide better guidance with data-driven insights. Generate comprehensive reports on your mentees' performance to tailor your coaching to their specific needs.
            </p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-accent shrink-0" />
                <span className="text-sm text-foreground/80">Review detailed submission histories and success rates</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-accent shrink-0" />
                <span className="text-sm text-foreground/80">Spot learning plateaus early and provide targeted help</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-accent shrink-0" />
                <span className="text-sm text-foreground/80">Compare mentee progress across cohorts</span>
              </li>
            </ul>
            <Link href="/mentor" className="inline-flex items-center gap-2 text-accent hover:text-accent-hover font-semibold">
              Explore mentor tools <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-background py-12 px-4 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-foreground font-bold">
            <BarChart3 className="w-5 h-5 text-accent" />
            <span>CodeLens</span>
          </div>
          <p className="text-sm text-muted">
            Built with ❤️ for the coding community. Not affiliated with LeetCode.
          </p>
          <div className="text-sm text-muted">
            &copy; {new Date().getFullYear()} CodeLens.
          </div>
        </div>
      </footer>
    </div>
  );
}
