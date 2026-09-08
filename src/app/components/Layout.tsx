import { Outlet, NavLink } from "react-router";
import { Home, Building2, MessageCircle, QrCode, Trophy, LayoutDashboard } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export function Layout() {
  const { userRole } = useAuth();

  const baseNavItems = [
    { to: "/", icon: Home, label: "Home" },
    { to: "/venues", icon: Building2, label: "Venues" },
    { to: "/invitations", icon: MessageCircle, label: "Network" },
    { to: "/checkin", icon: QrCode, label: "Check-in" },
    { to: "/rewards", icon: Trophy, label: "Rewards" },
  ];

  const navItems = userRole === "staff"
    ? [...baseNavItems, { to: "/admin", icon: LayoutDashboard, label: "Admin" }]
    : baseNavItems;

  return (
    <div className="h-screen flex flex-col bg-background max-w-md mx-auto">
      <main className="flex-1 overflow-y-auto pb-20">
        <Outlet />
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border max-w-md mx-auto">
        <div className={`grid ${userRole === "staff" ? "grid-cols-6" : "grid-cols-5"} h-16 px-2`}>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-1 transition-colors ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[10px]">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
