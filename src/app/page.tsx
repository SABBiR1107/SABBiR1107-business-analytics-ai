"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import {
  BarChart3,
  Upload,
  MessageSquare,
  TrendingUp,
  Zap,
  Shield,
  Check,
  Sparkles,
  ArrowRight,
  Database,
  LineChart,
  BrainCircuit,
  Lock,
  Send,
  Github,
  Twitter,
  Linkedin,
  Globe,
  Mail
} from "lucide-react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setIsSubmitting(true);
    // Simulate newsletter subscription
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsSubmitting(false);
    setIsSubscribed(true);
    toast.success("Welcome aboard! Successfully subscribed to our newsletter. 🚀");
    setEmail("");
    setTimeout(() => setIsSubscribed(false), 5000);
  };
  const features = [
    {
      title: "Easy Data Upload",
      description: "Drag and drop your CSV or Excel files. Supports high-speed, instant client-side processing.",
      icon: Upload,
      gradient: "from-blue-500/10 to-indigo-500/10 text-blue-500"
    },
    {
      title: "Advanced Visualizations",
      description: "Instantly create dynamic, gorgeous Area, Radar, Scatter, Line, Pie, and Bar charts in seconds.",
      icon: LineChart,
      gradient: "from-violet-500/10 to-purple-500/10 text-violet-500"
    },
    {
      title: "AI Chat Assistant",
      description: "Ask natural language questions about your business trends and get instant smart answers.",
      icon: MessageSquare,
      gradient: "from-emerald-500/10 to-teal-500/10 text-emerald-500"
    },
    {
      title: "Customized Reports",
      description: "Generate 1-day, weekly, 15-day, or monthly business summaries complete with AI analysis.",
      icon: TrendingUp,
      gradient: "from-amber-500/10 to-orange-500/10 text-amber-500"
    },
    {
      title: "Supabase Integration",
      description: "Synchronize and store your uploaded datasets in the cloud to access them anytime, anywhere.",
      icon: Database,
      gradient: "from-cyan-500/10 to-sky-500/10 text-cyan-500"
    },
    {
      title: "Enterprise Security",
      description: "Bank-grade file protection. Your datasets remain fully secure, privatized, and isolated.",
      icon: Shield,
      gradient: "from-rose-500/10 to-pink-500/10 text-rose-500"
    }
  ];

  const pricingTiers = [
    {
      name: "Free Starter",
      price: "$0",
      description: "Perfect for exploring basic data analysis and chart creation.",
      features: [
        "Up to 5 uploads per day",
        "Basic Visualizations (Line, Bar, Pie)",
        "Standard AI Chat Assistant",
        "Local browser session storage only",
        "Community support"
      ],
      cta: "Get Started Free",
      href: "/dashboard",
      popular: false,
      glow: "border-border"
    },
    {
      name: "Pro Analyst",
      price: "$19",
      period: "/month",
      description: "Best for professionals needing advanced charts and persistent cloud storage.",
      features: [
        "Unlimited spreadsheet uploads",
        "All Chart Types (Area, Radar, Scatter)",
        "High-priority, fast-response AI",
        "Full Cloud Sync with Supabase storage",
        "Export reports to formatted CSV/Excel",
        "Priority email support"
      ],
      cta: "Unlock Pro Power",
      href: "/dashboard",
      popular: true,
      glow: "border-primary shadow-[0_0_30px_rgba(var(--primary-rgb),0.2)] scale-105"
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "Tailored solutions for analytics teams and large organizations.",
      features: [
        "Everything in Pro Analyst",
        "Direct SQL database connectors",
        "Custom AI agent configurations",
        "Dedicated support manager",
        "99.9% uptime SLA guarantee",
        "Custom billing & invoicing"
      ],
      cta: "Contact Sales",
      href: "/dashboard",
      popular: false,
      glow: "border-border"
    }
  ];

  const models = [
    {
      id: 'gpt-4o',
      name: 'GPT-4o',
      provider: 'OpenAI',
      bgGradient: 'from-violet-950/40 to-indigo-950/40 border-violet-500/20',
      sparkleColor: 'text-violet-400 drop-shadow-[0_0_15px_rgba(167,139,250,0.5)]',
      providerColor: 'text-violet-400',
      rotate: 'rotate-[-3deg]',
      icon: TrendingUp
    },
    {
      id: 'claude-sonnet',
      name: 'Claude Sonnet',
      provider: 'Anthropic',
      bgGradient: 'from-amber-950/40 to-orange-950/40 border-amber-500/20',
      sparkleColor: 'text-amber-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]',
      providerColor: 'text-amber-400',
      rotate: 'rotate-[2deg]',
      icon: BarChart3
    },
    {
      id: 'gemini-pro',
      name: 'Gemini Pro',
      provider: 'Google',
      bgGradient: 'from-teal-950/40 to-cyan-950/40 border-teal-500/20',
      sparkleColor: 'text-teal-400 drop-shadow-[0_0_15px_rgba(45,212,191,0.5)]',
      providerColor: 'text-teal-400',
      rotate: 'rotate-[-1.5deg]',
      icon: LineChart
    },
    {
      id: 'o1-pro',
      name: 'o1 Pro',
      provider: 'OpenAI',
      bgGradient: 'from-zinc-900/40 to-slate-900/40 border-zinc-500/20',
      sparkleColor: 'text-zinc-400 drop-shadow-[0_0_15px_rgba(161,161,170,0.5)]',
      providerColor: 'text-zinc-400',
      rotate: 'rotate-[3deg]',
      icon: Database
    },
    {
      id: 'deepseek-v3',
      name: 'DeepSeek-V3',
      provider: 'DeepSeek',
      bgGradient: 'from-blue-950/40 to-sky-950/40 border-blue-500/20',
      sparkleColor: 'text-blue-400 drop-shadow-[0_0_15px_rgba(96,165,250,0.5)]',
      providerColor: 'text-blue-400',
      rotate: 'rotate-[-2deg]',
      icon: BrainCircuit
    }
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden">
      {/* High-Tech Animated Data Vibe Background */}
      <div className="absolute top-0 left-0 w-full h-[800px] pointer-events-none overflow-hidden select-none">
        {/* Glow Spheres */}
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[130px] animate-pulse" />
        <div className="absolute top-80 right-0 w-[500px] h-[500px] bg-violet-500/10 rounded-full blur-[130px]" />
        
        {/* SVG Grid Overlay */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        
        {/* Floating Data Bubbles / Particles */}
        <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-primary/20 rounded-full animate-bounce" style={{ animationDuration: '6s' }} />
        <div className="absolute top-1/3 right-1/4 w-4 h-4 bg-violet-500/20 rounded-full animate-bounce" style={{ animationDuration: '8s' }} />
        <div className="absolute top-1/2 left-1/3 w-2 h-2 bg-emerald-500/20 rounded-full animate-ping" style={{ animationDuration: '5s' }} />
      </div>

      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24 relative z-10">
        <div className="text-center max-w-4xl mx-auto space-y-8">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider shadow-sm">
            <Zap className="h-3.5 w-3.5" />
            AI-Powered Business Intelligence
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-none">
            Transform Raw Data Into{" "}
            <span className="bg-gradient-to-r from-primary via-violet-500 to-indigo-500 bg-clip-text text-transparent drop-shadow-sm">
              Actionable Insights
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Upload your sales, marketing, or custom datasets. Instantly generate beautiful dashboards, explore visual analytics, and chat with our smart AI assistant.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href="/dashboard">
              <Button size="lg" className="text-base font-bold px-8 py-6 rounded-2xl shadow-lg shadow-primary/25 hover:shadow-primary/35 transition-all flex items-center gap-2 group">
                <Upload className="h-5 w-5 group-hover:-translate-y-0.5 transition-transform" />
                Start Analyzing Free
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/how-to-use">
              <Button size="lg" variant="outline" className="text-base font-bold px-8 py-6 rounded-2xl hover:bg-secondary/40 transition-all flex items-center gap-2">
                <BrainCircuit className="h-5 w-5 text-primary" />
                How It Works
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* AI Models Showcase Section */}
      <section className="py-24 relative z-10 border-t border-border/40 bg-[linear-gradient(to_right,rgba(var(--primary-rgb),0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(var(--primary-rgb),0.02)_1px,transparent_1px)] bg-[size:32px_32px]">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />
        
        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          {/* Powered by badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-16 text-xs text-muted-foreground select-none">
            <span className="font-semibold uppercase tracking-wider mr-2">Powered by:</span>
            <span className="bg-primary/5 border border-primary/10 px-3 py-1.5 rounded-full font-medium transition-all hover:bg-primary/10">GPT-4o</span>
            <span className="bg-primary/5 border border-primary/10 px-3 py-1.5 rounded-full font-medium transition-all hover:bg-primary/10">Claude Sonnet</span>
            <span className="bg-primary/5 border border-primary/10 px-3 py-1.5 rounded-full font-medium transition-all hover:bg-primary/10">Gemini Pro</span>
            <span className="bg-primary/5 border border-primary/10 px-3 py-1.5 rounded-full font-medium transition-all hover:bg-primary/10">o1 Pro</span>
            <span className="bg-primary/5 border border-primary/10 px-3 py-1.5 rounded-full font-medium transition-all hover:bg-primary/10">DeepSeek-V3</span>
            <span className="bg-primary/5 border border-primary/10 px-3 py-1.5 rounded-full font-medium transition-all hover:bg-primary/10">Qwen 2.5</span>
          </div>

          {/* Title Header */}
          <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-none">
              State-of-the-Art <span className="bg-gradient-to-r from-primary to-amber-500 bg-clip-text text-transparent">AI Intelligence</span>
            </h2>
            <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
              We leverage the world's most powerful language models to analyze your datasets, calculate precise business formulas, and explain critical trends.
            </p>
          </div>

          {/* Glowing Rotated Cards Container */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-4 max-w-5xl mx-auto pt-4 pb-8 justify-center">
            {models.map((model) => (
              <div
                key={model.id}
                className={`group relative aspect-[3/4] rounded-[24px] border ${model.bgGradient} backdrop-blur-xl flex flex-col justify-between overflow-hidden shadow-[0_15px_35px_rgba(0,0,0,0.15)] hover:shadow-[0_25px_45px_rgba(0,0,0,0.25)] hover:border-primary/40 transition-all duration-500 cursor-pointer ${model.rotate} hover:rotate-0 hover:scale-105 select-none`}
              >
                {/* Neon glow effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/[0.02] to-white/[0.05] pointer-events-none" />
                <div className="absolute -top-20 -left-20 w-40 h-40 bg-primary/10 rounded-full blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Large Center sparkle matching exact style */}
                <div className="flex-1 flex items-center justify-center relative">
                  <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(#fff_1px,transparent_1px)] bg-[size:16px_16px]" />
                  <div className="relative flex items-center justify-center">
                    <model.icon className={`h-12 w-12 ${model.sparkleColor} transition-transform duration-500 group-hover:scale-110`} />
                  </div>
                </div>

                {/* Dark Bottom Label Bar */}
                <div className="bg-black/40 backdrop-blur-md border-t border-white/5 py-4.5 px-5 flex flex-col gap-0.5 relative z-10">
                  <span className="font-extrabold text-sm text-white tracking-wide">{model.name}</span>
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${model.providerColor}`}>{model.provider}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20 relative z-10 border-t border-border/40">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Everything You Need to Scale</h2>
          <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
            Supercharge your decision-making workflows with a comprehensive suite of professional tools.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, i) => (
            <Card key={i} className="border bg-card/40 backdrop-blur-md hover:border-primary/50 hover:bg-card/70 transition-all duration-300 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 group">
              <CardHeader className="p-6">
                <div className={`rounded-xl w-12 h-12 flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110 shadow-sm bg-gradient-to-br ${feature.gradient}`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <CardTitle className="text-lg font-bold">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Pricing Section (Stripe-like) */}
      <section id="pricing" className="container mx-auto px-4 py-24 relative z-10 border-t border-border/40 bg-secondary/10 dark:bg-secondary/5 rounded-3xl">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4 relative z-10">
          <div className="inline-flex items-center gap-1.5 bg-violet-500/10 text-violet-500 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider">
            Flexible Plans
          </div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-none">
            Simple, Transparent Pricing
          </h2>
          <p className="text-muted-foreground text-sm md:text-base max-w-md mx-auto">
            Choose a plan that matches your needs. No hidden setup fees or contracts.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch relative z-10 px-2">
          {pricingTiers.map((tier, i) => (
            <Card
              key={i}
              className={`flex flex-col border bg-card/60 backdrop-blur-xl rounded-3xl transition-all duration-300 hover:shadow-lg p-8 relative overflow-hidden ${tier.glow}`}
            >
              {tier.popular && (
                <div className="absolute top-0 right-0 bg-primary text-primary-foreground font-semibold text-xs px-4 py-1.5 rounded-bl-2xl uppercase tracking-widest shadow-sm flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  Most Popular
                </div>
              )}

              <div className="space-y-4">
                <h3 className="text-xl font-bold tracking-tight">{tier.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl md:text-5xl font-black tracking-tight">{tier.price}</span>
                  {tier.period && <span className="text-muted-foreground text-sm font-semibold">{tier.period}</span>}
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed min-h-[40px]">
                  {tier.description}
                </p>
              </div>

              <hr className="my-6 border-border/60" />

              <ul className="space-y-3.5 flex-1 mb-8">
                {tier.features.map((feat, idx) => (
                  <li key={idx} className="flex gap-2.5 items-start text-sm text-foreground/80 leading-snug">
                    <div className="bg-primary/10 text-primary p-0.5 rounded-full mt-0.5 shrink-0">
                      <Check className="h-3.5 w-3.5" />
                    </div>
                    {feat}
                  </li>
                ))}
              </ul>

              <Link href={tier.href}>
                <Button
                  className={`w-full py-6 rounded-2xl font-bold text-sm transition-all duration-300 shadow-md ${
                    tier.popular
                      ? "bg-primary hover:bg-primary/95 text-primary-foreground shadow-primary/20 hover:shadow-primary/30"
                      : "bg-secondary hover:bg-secondary/80 text-foreground border hover:border-primary/35 shadow-sm"
                  }`}
                >
                  {tier.cta}
                </Button>
              </Link>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 relative z-10">
        <Card className="max-w-4xl mx-auto bg-gradient-to-r from-primary to-indigo-600 text-primary-foreground border-0 rounded-3xl shadow-2xl relative overflow-hidden shadow-primary/10">
          {/* Overlay elements */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_30%_30%,#fff_10%,transparent_100%)]" />
          
          <CardContent className="p-12 text-center relative z-10 space-y-6">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-none">
              Ready to unlock your business potential?
            </h2>
            <p className="text-base md:text-lg opacity-90 max-w-xl mx-auto leading-relaxed">
              Join thousands of analysts. Upload your data and generate high-fidelity reports instantly.
            </p>
            <Link href="/dashboard" className="inline-block pt-2">
              <Button size="lg" variant="secondary" className="text-base font-bold px-8 py-6 rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2 group">
                <Upload className="h-5 w-5 text-primary group-hover:-translate-y-0.5 transition-transform" />
                Start Analyzing Now
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-border/40 bg-background/80 backdrop-blur-xl z-10 overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 left-1/4 w-[300px] h-[150px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[300px] h-[150px] bg-violet-500/5 rounded-full blur-[100px] pointer-events-none" />
        {/* Neon Divider Line */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

        <div className="container mx-auto px-4 max-w-6xl pt-16 pb-4">
          {/* Main Footer Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 md:gap-8 lg:gap-12 pb-8 border-b border-border/40">
            
            {/* Branding Column - spans 4 */}
            <div className="lg:col-span-4 space-y-4">
              <div className="flex items-center gap-2.5 group">
                <div className="bg-card p-1 rounded-xl shadow-sm border border-border flex items-center justify-center group-hover:border-primary/30 transition-colors duration-300">
                  <img src="/logo.png" alt="Business Analytics Logo" className="h-7 w-7 object-contain transition-transform group-hover:scale-105 duration-300" />
                </div>
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-primary to-amber-500 bg-clip-text text-transparent">
                  Business Analytics
                </span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
                Transforming raw spreadsheets into beautiful, interactive visual dashboards and AI-powered intelligence. Experience analytics reimagined.
              </p>
              <div className="flex flex-col gap-3 pt-2">
                <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1.5 rounded-full text-xs font-semibold text-emerald-500 w-fit shadow-sm">
                  <span className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]" />
                  All Systems Operational
                </div>
                <div className="flex items-center gap-3">
                  <a href="https://github.com" target="_blank" rel="noreferrer" className="p-2 rounded-xl bg-card border border-border/60 text-muted-foreground hover:text-primary hover:border-primary/30 hover:shadow-sm transition-all duration-300" aria-label="GitHub">
                    <Github className="h-4 w-4" />
                  </a>
                  <a href="https://twitter.com" target="_blank" rel="noreferrer" className="p-2 rounded-xl bg-card border border-border/60 text-muted-foreground hover:text-primary hover:border-primary/30 hover:shadow-sm transition-all duration-300" aria-label="Twitter">
                    <Twitter className="h-4 w-4" />
                  </a>
                  <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="p-2 rounded-xl bg-card border border-border/60 text-muted-foreground hover:text-primary hover:border-primary/30 hover:shadow-sm transition-all duration-300" aria-label="LinkedIn">
                    <Linkedin className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>

            {/* Column 2: Platform Links - spans 2 */}
            <div className="lg:col-span-2 space-y-4">
              <h4 className="text-sm font-bold tracking-wider uppercase text-foreground">Platform</h4>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <Link href="/dashboard" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5 group">
                    Dashboard
                    <span className="text-[10px] bg-primary/10 text-primary border border-primary/20 px-1.5 py-0.5 rounded font-bold leading-none scale-90 group-hover:scale-95 transition-transform duration-300">Live</span>
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="text-muted-foreground hover:text-primary transition-colors">
                    Visual Analytics
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5">
                    AI Chat
                    <Sparkles className="h-3 w-3 text-amber-500 animate-pulse" />
                  </Link>
                </li>
                <li>
                  <Link href="#pricing" className="text-muted-foreground hover:text-primary transition-colors">
                    Pricing Plans
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Resources Links - spans 2 */}
            <div className="lg:col-span-2 space-y-4">
              <h4 className="text-sm font-bold tracking-wider uppercase text-foreground">Resources</h4>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <Link href="/how-to-use" className="text-muted-foreground hover:text-primary transition-colors">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="/how-to-use" className="text-muted-foreground hover:text-primary transition-colors">
                    User Tutorials
                  </Link>
                </li>
                <li>
                  <span className="text-muted-foreground/60 cursor-not-allowed flex items-center gap-1.5">
                    Developer API
                    <span className="text-[9px] bg-muted text-muted-foreground px-1 py-0.5 rounded uppercase font-semibold">Soon</span>
                  </span>
                </li>
                <li>
                  <Link href="/how-to-use" className="text-muted-foreground hover:text-primary transition-colors">
                    Security Center
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 4: Newsletter Box - spans 4 */}
            <div className="lg:col-span-4 space-y-4">
              <h4 className="text-sm font-bold tracking-wider uppercase text-foreground">Stay in the Loop</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Subscribe to our newsletter for major feature announcements, analytic templates, and tutorials.
              </p>
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isSubmitting}
                      className="w-full bg-card/60 backdrop-blur-md border border-border/80 rounded-xl pl-9 pr-3 py-2.5 text-sm outline-none transition-all focus:border-primary/50 focus:ring-1 focus:ring-primary/20 disabled:opacity-50"
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    disabled={isSubmitting || !email}
                    className="rounded-xl px-4 font-bold shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-1.5 shrink-0 bg-primary text-primary-foreground"
                  >
                    {isSubmitting ? (
                      <span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Join</span>
                        <Send className="h-3.5 w-3.5" />
                      </>
                    )}
                  </Button>
                </div>
                {isSubscribed && (
                  <p className="text-xs font-semibold text-emerald-500 animate-fade-in flex items-center gap-1">
                    <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full" />
                    Thanks for subscribing! Check your inbox soon.
                  </p>
                )}
              </form>
            </div>

          </div>

          {/* Bottom Copyright & Security info */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mt-5 text-xs text-muted-foreground">
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
              <p>© {new Date().getFullYear()} Business Analytics. All rights reserved.</p>
              <span className="hidden sm:inline text-muted-foreground/30">•</span>
              <div className="flex gap-3">
                <Link href="/how-to-use" className="hover:text-primary transition-colors">Privacy Policy</Link>
                <span>•</span>
                <Link href="/how-to-use" className="hover:text-primary transition-colors">Terms of Service</Link>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 bg-emerald-500/5 border border-emerald-500/10 px-3 py-1 rounded-full text-emerald-500/90 font-medium">
                <Lock className="h-3 w-3 text-emerald-500" />
                <span>AES-256 Session Encryption</span>
              </div>
              <div className="flex items-center gap-1.5 bg-primary/5 border border-primary/10 px-3 py-1 rounded-full text-primary font-medium">
                <Globe className="h-3 w-3" />
                <span>Global Edge Delivery</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}