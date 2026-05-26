"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Loader2, Mail, Lock, Shield, Sparkles, Eye, EyeOff, CheckCircle2, Check, X } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showSignupConfirm, setShowSignupConfirm] = useState(false);

  // Password requirement validators
  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumbers = /[0-9]/.test(password);
  const hasSpecialChars = /[!@#$%^&*]/.test(password);
  const allRequirementsMet = hasLowercase && hasUppercase && hasNumbers && hasSpecialChars;

  const PasswordRequirement = ({ met, label }: { met: boolean; label: string }) => (
    <div className="flex items-center gap-2.5 text-xs">
      <div className={`rounded-full p-0.5 transition-colors ${met ? 'bg-emerald-500/20' : 'bg-muted'}`}>
        {met ? (
          <Check className="h-3 w-3 text-emerald-500" />
        ) : (
          <X className="h-3 w-3 text-muted-foreground/50" />
        )}
      </div>
      <span className={met ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-muted-foreground'}>
        {label}
      </span>
    </div>
  );

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) {
      toast.error('Supabase is not configured yet. Add environment keys.');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      toast.success('Successfully logged in!');
      onClose();
      resetForm();
      // Redirect to dashboard after successful login
      router.push('/dashboard');
    } catch (err: any) {
      toast.error(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) {
      toast.error('Supabase is not configured yet. Add environment keys.');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: 'https://business-analytics-ai.vercel.app/dashboard',
        }
      });

      if (error) throw error;
      
      // Show confirmation popup
      setShowSignupConfirm(true);
      setTimeout(() => {
        setShowSignupConfirm(false);
        setActiveTab('login');
        resetForm();
      }, 3000);
    } catch (err: any) {
      toast.error(err.message || 'Failed to sign up');
    } finally {
      setLoading(false);
    }
  };

  // Google OAuth (Gmail) Login
  const handleGoogleSignIn = async () => {
    if (!supabase) {
      toast.error('Supabase is not configured yet. Add environment keys.');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: 'https://business-analytics-ai.vercel.app/dashboard',
        }
      });
      if (error) throw error;
    } catch (err: any) {
      toast.error(err.message || 'Google Login requires credentials inside your Supabase project console.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open && !loading) {
        onClose();
        resetForm();
      }
    }}>
      <DialogContent className="sm:max-w-[420px] p-0 bg-background/90 dark:bg-zinc-950/90 backdrop-blur-2xl border border-primary/20 rounded-3xl shadow-[0_0_50px_rgba(var(--primary-rgb),0.2)] overflow-hidden transition-all duration-300">
        
        {/* Neon Accent Top Strip */}
        <div className="h-1.5 w-full bg-gradient-to-r from-primary via-violet-500 to-emerald-400" />

        {/* Decorative Floating Lights */}
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-primary/15 rounded-full blur-[90px] pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-violet-500/15 rounded-full blur-[90px] pointer-events-none" />

        <div className="px-7 py-8 relative z-10 space-y-6">
          <DialogHeader className="space-y-3">
            {/* Premium Glowing Logo */}
            <div className="mx-auto relative group mb-1">
              <div className="absolute -inset-1.5 bg-gradient-to-r from-primary via-violet-500 to-amber-500 rounded-2xl blur-[12px] opacity-75 group-hover:opacity-100 group-hover:blur-[15px] transition duration-500 animate-pulse" />
              <div className="relative bg-card dark:bg-zinc-900 p-2.5 rounded-2xl shadow-xl border border-border/80 flex items-center justify-center h-14 w-14 group-hover:scale-105 transition-transform duration-500">
                <img src="/logo.png" alt="Business Analytics Logo" className="h-8.5 w-8.5 object-contain select-none" />
              </div>
            </div>
            
            <DialogTitle className="text-2xl font-black text-center tracking-tight whitespace-nowrap">
              Welcome to <span className="bg-gradient-to-r from-primary to-amber-500 bg-clip-text text-transparent font-extrabold">Business Analytics</span>
            </DialogTitle>
            <DialogDescription className="text-center text-muted-foreground text-[11px] leading-relaxed max-w-[280px] mx-auto">
              Secure cloud authentication & lightning-fast visual spreadsheet analytics
            </DialogDescription>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={(val) => {
            setActiveTab(val as any);
            resetForm();
          }} className="w-full">
            <TabsList className="grid w-full grid-cols-2 h-11 p-1 bg-muted/65 border rounded-2xl mb-6 items-center">
              <TabsTrigger 
                value="login" 
                className="rounded-xl py-2 transition-all font-bold text-xs select-none cursor-pointer data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm"
              >
                Log In
              </TabsTrigger>
              <TabsTrigger 
                value="signup" 
                className="rounded-xl py-2 transition-all font-bold text-xs select-none cursor-pointer data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm"
              >
                Sign Up
              </TabsTrigger>
            </TabsList>

            {/* Email Login Tab */}
            <TabsContent value="login" className="space-y-4 animate-in fade-in duration-200">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="email-login" className="text-xs font-bold text-muted-foreground">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-muted-foreground/75" />
                    <Input
                      id="email-login"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="pl-11 h-11 rounded-xl border-input/60 hover:border-primary/50 focus-visible:ring-primary/20 focus-visible:border-primary/80 font-medium text-xs shadow-sm bg-background/50"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="password-login" className="text-xs font-bold text-muted-foreground">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-muted-foreground/75" />
                    <Input
                      id="password-login"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="pl-11 pr-11 h-11 rounded-xl border-input/60 hover:border-primary/50 focus-visible:ring-primary/20 focus-visible:border-primary/80 font-medium text-xs shadow-sm bg-background/50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3.5 text-muted-foreground/75 hover:text-primary transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4.5 w-4.5" />
                      ) : (
                        <Eye className="h-4.5 w-4.5" />
                      )}
                    </button>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  disabled={loading} 
                  className="w-full h-12 text-xs font-bold rounded-xl mt-3 bg-gradient-to-r from-primary to-violet-600 hover:from-primary/95 hover:to-violet-600/95 text-white shadow-[0_6px_20px_rgba(var(--primary-rgb),0.25)] hover:shadow-[0_6px_25px_rgba(var(--primary-rgb),0.35)] transform hover:-translate-y-0.5 transition-all duration-300"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4.5 w-4.5 animate-spin" />
                      Authenticating Secure Session...
                    </>
                  ) : (
                    'Sign In to Dashboard'
                  )}
                </Button>
              </form>
            </TabsContent>

            {/* Email Signup Tab */}
            <TabsContent value="signup" className="space-y-4 animate-in fade-in duration-200">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="email-signup" className="text-xs font-bold text-muted-foreground">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-muted-foreground/75" />
                    <Input
                      id="email-signup"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="pl-11 h-11 rounded-xl border-input/60 hover:border-primary/50 focus-visible:ring-primary/20 focus-visible:border-primary/80 font-medium text-xs shadow-sm bg-background/50"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="password-signup" className="text-xs font-bold text-muted-foreground">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-muted-foreground/75" />
                    <Input
                      id="password-signup"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="pl-11 pr-11 h-11 rounded-xl border-input/60 hover:border-primary/50 focus-visible:ring-primary/20 focus-visible:border-primary/80 font-medium text-xs shadow-sm bg-background/50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3.5 text-muted-foreground/75 hover:text-primary transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4.5 w-4.5" />
                      ) : (
                        <Eye className="h-4.5 w-4.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Password Requirements */}
                {activeTab === 'signup' && password && (
                  <div className="bg-muted/40 rounded-xl p-4 space-y-2.5 border border-border/50">
                    <p className="text-xs font-bold text-muted-foreground mb-1">Password Requirements:</p>
                    <PasswordRequirement met={hasLowercase} label="Lowercase letters (a-z)" />
                    <PasswordRequirement met={hasUppercase} label="Uppercase letters (A-Z)" />
                    <PasswordRequirement met={hasNumbers} label="Numbers (0-9)" />
                    <PasswordRequirement met={hasSpecialChars} label="Special characters (! @ # $ % ^ & *)" />
                  </div>
                )}

                <Button 
                  type="submit" 
                  disabled={loading || (activeTab === 'signup' && !allRequirementsMet)} 
                  className="w-full h-12 text-xs font-bold rounded-xl mt-3 bg-gradient-to-r from-primary to-violet-600 hover:from-primary/95 hover:to-violet-600/95 text-white shadow-[0_6px_20px_rgba(var(--primary-rgb),0.25)] hover:shadow-[0_6px_25px_rgba(var(--primary-rgb),0.35)] transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4.5 w-4.5 animate-spin" />
                      Creating Cloud Instance...
                    </>
                  ) : (
                    'Register Secure Account'
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          {/* Separator Line */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border/60" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-wider">
              <span className="bg-background dark:bg-zinc-950 px-3.5 text-muted-foreground font-extrabold">Or Connect Securely With</span>
            </div>
          </div>

          {/* High-Fidelity Google Login Button */}
          <Button
            onClick={handleGoogleSignIn}
            disabled={loading}
            variant="outline"
            className="w-full h-12 bg-background/40 hover:bg-primary/5 border border-border/80 hover:border-primary/30 rounded-xl transition-all duration-300 text-xs font-bold flex items-center justify-center gap-2.5 shadow-sm transform active:scale-95 cursor-pointer"
          >
            <svg className="h-4.5 w-4.5 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.555 0-6.437-2.883-6.437-6.437 0-3.555 2.882-6.437 6.437-6.437 1.637 0 3.127.608 4.27 1.607l3.033-3.033C19.297 2.302 15.938 1 12.24 1 6.044 1 12.24s5.044 11.24 11.24 11.24c5.895 0 10.597-4.137 10.597-10.364 0-.687-.06-1.353-.172-1.996L12.24 10.285z"
              />
            </svg>
            Continue with Google Gmail
          </Button>

          {/* Signup Confirmation Popup */}
          {showSignupConfirm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
              <div className="bg-background/95 dark:bg-zinc-900/95 border border-primary/30 rounded-3xl p-8 shadow-2xl animate-in fade-in scale-in duration-300 max-w-sm mx-4">
                <div className="flex flex-col items-center gap-4">
                  <div className="relative">
                    <div className="absolute -inset-2 bg-gradient-to-r from-primary via-violet-500 to-emerald-400 rounded-full blur-xl opacity-75 animate-pulse" />
                    <div className="relative bg-primary/10 p-4 rounded-full">
                      <CheckCircle2 className="h-8 w-8 text-primary animate-bounce" />
                    </div>
                  </div>
                  <div className="text-center space-y-2">
                    <h3 className="text-lg font-bold text-white">Confirmation Email Sent!</h3>
                    <p className="text-sm text-muted-foreground">
                      We've sent a confirmation email to <span className="font-semibold text-primary">{email}</span>. Please verify your email to activate your account.
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground text-center">
                    Redirecting to login in a moment...
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
