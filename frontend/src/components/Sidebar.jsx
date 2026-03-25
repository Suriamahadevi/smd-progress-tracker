import { useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { BookOpen, LayoutDashboard, LogOut, Menu, Share2, UserCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { to: "/dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { to: "/log/today", label: "Logs", Icon: BookOpen },
  { to: "/profile", label: "Profile", Icon: UserCircle }
];

export default function Sidebar() {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const isActive = (to) => pathname.startsWith(to.split("/:")[0]);

  const content = (
    <div className="h-full flex flex-col bg-white dark:bg-[#0a0a12] border-r border-gray-200 dark:border-white/10 p-4 w-[260px]">
      <div className="flex items-center gap-3 px-2 pt-3 pb-5">
        <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-400 shadow-glow-indigo flex items-center justify-center">
          <div className="h-3 w-3 rounded-sm bg-white/30" />
        </div>
        <div className="leading-tight">
          <div className="font-display font-bold text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-lg">
            SMD Progress
          </div>
          <div className="text-xs text-gray-500 dark:text-white/50 font-body">Student Dashboard</div>
        </div>
      </div>

      <nav className="mt-2 flex-1">
        {navItems.map(({ to, label, Icon }) => {
          const active = isActive(to);
          return (
            <Link
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl mx-2 my-1 transition-all duration-200 font-body text-sm cursor-pointer ${
                active
                  ? "bg-accent-indigo-glow text-indigo-400 border border-accent-indigo/20"
                  : "text-gray-500 dark:text-white/50 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/70 dark:hover:bg-white/5"
              }`}
            >
              <Icon size={18} />
              <span>{label}</span>
            </Link>
          );
        })}

        {user?.publicSlug && (
          <Link
            to={`/public/${user.publicSlug}`}
            onClick={() => setOpen(false)}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl mx-2 my-1 transition-all duration-200 font-body text-sm cursor-pointer ${
              pathname.startsWith("/public")
                ? "bg-accent-indigo-glow text-indigo-400 border border-accent-indigo/20"
                : "text-gray-500 dark:text-white/50 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/70 dark:hover:bg-white/5"
            }`}
          >
            <Share2 size={18} />
            <span>Share</span>
          </Link>
        )}
      </nav>

      <div className="mt-auto pt-4">
        {user && (
          <div className="mx-2 mb-3 flex items-center gap-3 rounded-2xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 px-3 py-2">
            {user.profilePic ? (
              <img src={user.profilePic} alt="User" className="h-9 w-9 rounded-full ring-1 ring-gray-200 dark:ring-white/10 object-cover" />
            ) : (
              <div className="h-9 w-9 rounded-full ring-1 ring-gray-200 dark:ring-white/10 bg-gray-100 dark:bg-white/5" />
            )}
            <div className="min-w-0">
              <div className="text-sm font-medium text-gray-900 dark:text-white/90 truncate">{user.name}</div>
              <div className="text-xs text-gray-500 dark:text-white/50 truncate">{user.batch}</div>
            </div>
          </div>
        )}

        <button
          className="mx-2 w-[calc(100%-16px)] flex items-center gap-3 px-4 py-2.5 rounded-xl text-gray-500 dark:text-white/50 hover:text-red-500 dark:hover:text-red-400 transition-colors font-body text-sm cursor-pointer"
          onClick={logout}
          type="button"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden sticky top-0 z-50 h-14 flex items-center justify-between px-4 bg-white/80 dark:bg-[#0a0a12]/80 backdrop-blur-xl border-b border-gray-200/70 dark:border-white/10">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center shadow-glow-indigo">
            <div className="h-2.5 w-2.5 rounded-sm bg-white/30" />
          </div>
          <div className="font-display font-bold text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text">SMD</div>
        </div>
        <button className="rounded-xl border border-gray-200 bg-gray-100 p-2 dark:border-white/10 dark:bg-white/5" onClick={() => setOpen(true)} aria-label="Open menu" type="button">
          <Menu size={18} />
        </button>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden md:block fixed left-0 top-0 bottom-0">
        {content}
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            role="button"
            tabIndex={0}
          />
          <div className="absolute left-0 top-0 bottom-0 transform transition-transform duration-200 translate-x-0">
            {content}
          </div>
        </div>
      )}
    </>
  );
}
