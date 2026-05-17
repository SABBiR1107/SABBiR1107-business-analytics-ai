"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ThemeToggle } from './ThemeToggle';
import { AuthModal } from './AuthModal';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { BarChart3, Menu, X, LogIn, LogOut, LayoutDashboard, HelpCircle, DollarSign, User } from 'lucide-react';

export function Navbar() {
  const { user, signOut, loading } = useAuth();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'How to Use', href: '/how-to-use', icon: HelpCircle },
    { name: 'Pricing', href: pathname === '/' ? '#pricing' : '/#pricing', icon: DollarSign },
  ];

  const getInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase();
  };

  return (
    <nav className="border-b bg-background/80 backdrop-blur-md sticky top-0 z-40 w-full transition-all">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group select-none">
          <div className="bg-card p-1 rounded-xl shadow-sm border border-border group-hover:border-primary/30 transition-all flex items-center justify-center">
            <img src="/logo.png" alt="Business Analytics Logo" className="h-7 w-7 object-contain transition-transform group-hover:scale-105 duration-300" />
          </div>
          <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-primary to-amber-500 bg-clip-text text-transparent">
            Business Analytics
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`text-sm font-medium hover:text-primary transition-colors ${
                pathname === link.href ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Right Side Actions */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />

          {!loading && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full border p-0 hover:bg-muted">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-primary/10 text-primary font-bold">
                      {getInitials(user.email || 'US')}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-semibold leading-none text-primary">Logged in as</p>
                    <p className="text-xs leading-none text-muted-foreground truncate">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="cursor-pointer">
                    <LayoutDashboard className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>My Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut} className="cursor-pointer text-destructive focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : !loading ? (
            <Button
              onClick={() => setIsAuthOpen(true)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-5 rounded-xl flex items-center gap-1.5 shadow-[0_0_20px_rgba(var(--primary-rgb),0.15)] select-none cursor-pointer"
            >
              Sign In
            </Button>
          ) : (
            <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-foreground"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t bg-background/95 backdrop-blur-md py-4 px-4 space-y-4 absolute top-full left-0 w-full shadow-lg border-b z-50">
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`text-base font-semibold py-2 border-b border-border/40 hover:text-primary transition-all flex items-center ${
                  pathname === link.href ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                {link.name}
              </Link>
            ))}

            {!loading && user ? (
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3 py-2 px-1">
                  <Avatar className="h-10 w-10 border border-primary/20">
                    <AvatarFallback className="bg-primary/10 text-primary font-bold">
                      {getInitials(user.email || 'US')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-semibold truncate">{user.email}</span>
                    <span className="text-xs text-muted-foreground">Authenticated User</span>
                  </div>
                </div>
                <Button onClick={signOut} variant="outline" className="w-full text-destructive border-destructive/20 hover:bg-destructive/10 font-bold py-2 rounded-xl flex items-center justify-center gap-2">
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            ) : !loading ? (
              <div className="pt-2">
                <Button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsAuthOpen(true);
                  }}
                  className="w-full bg-primary hover:bg-primary/90 font-bold py-2 rounded-xl flex items-center justify-center gap-2 select-none cursor-pointer"
                >
                  Sign In
                </Button>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* Auth Modal Container */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </nav>
  );
}
