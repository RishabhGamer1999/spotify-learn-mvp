import { Home, Target, BookOpen, Trophy, ShoppingBag, LogOut, Upload } from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';

const navItems = [
  { icon: Home, label: 'Home', path: '/' },
  { icon: Target, label: 'Goals', path: '/goals' },
  { icon: BookOpen, label: 'My Learning', path: '/learning' },
  { icon: Trophy, label: 'Achievements', path: '/achievements' },
  { icon: ShoppingBag, label: 'Courses', path: '/courses' },
  { icon: Upload, label: 'Audio Upload', path: '/audio-upload' },
];

export function Sidebar() {
  const { user, signOut } = useAuth();

  const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'User';
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-card border-r border-border">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex items-center gap-2 px-6 py-5 border-b border-border">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-6 h-6 text-primary-foreground" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 14.36c-.17.28-.52.36-.8.19-2.2-1.35-4.97-1.65-8.23-.9-.31.07-.63-.13-.7-.45-.07-.31.13-.63.45-.7 3.57-.82 6.63-.47 9.09 1.04.28.18.36.52.19.82zm1.22-2.7c-.22.35-.67.46-1.02.24-2.52-1.55-6.36-2-9.34-1.09-.39.12-.8-.1-.92-.49-.12-.39.1-.8.49-.92 3.4-1.04 7.63-.54 10.55 1.25.35.21.46.66.24 1.01zm.11-2.82c-3.02-1.8-8.01-1.96-10.9-.99-.46.15-.95-.1-1.1-.57-.15-.46.1-.95.57-1.1 3.32-1.1 8.83-.89 12.33 1.16.42.25.55.79.3 1.21-.25.41-.79.55-1.2.29z"/>
            </svg>
          </div>
          <span className="text-xl font-bold text-foreground">Learn</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground",
                "hover:bg-surface-elevated hover:text-foreground transition-all duration-200"
              )}
              activeClassName="bg-surface-elevated text-foreground"
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-emerald-400 flex items-center justify-center text-primary-foreground font-bold">
              {userInitial}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{userName}</p>
              <p className="text-xs text-muted-foreground">18 day streak 🔥</p>
            </div>
            <button
              onClick={signOut}
              className="p-2 rounded-lg hover:bg-surface-elevated text-muted-foreground hover:text-foreground transition-colors"
              title="Log out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
