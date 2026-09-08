import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { Building2, Mail, Lock, Users, UserCog } from "lucide-react";
import { motion } from "motion/react";
import { demoUsers } from "../data/demoUsers";

const memberDemoUsers = demoUsers.filter((user) => user.role === "member");
const staffDemoUsers = demoUsers.filter((user) => user.role === "staff");

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<"member" | "staff">("member");
  const [selectedDemoRole, setSelectedDemoRole] = useState<"member" | "staff">("member");
  const [selectedMemberEmail, setSelectedMemberEmail] = useState("member1@example.com");
  const [selectedStaffEmail, setSelectedStaffEmail] = useState("staff@example.com");
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isCredentialsView = location.pathname === "/login/credentials";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, password, selectedRole);
    navigate("/");
  };

  const handleDemoLogin = () => {
    const selectedEmail =
      selectedDemoRole === "staff" ? selectedStaffEmail : selectedMemberEmail;
    login(selectedEmail, "demo", selectedDemoRole);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-secondary flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {/* Logo/Icon */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Building2 className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl text-white mb-2">CBD Chamber Networking App</h1>
          <p className="text-white/80 text-sm">
            Connect with local businesses and discover networking venues across the Sydney CBD.
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl p-6 shadow-xl">
          {!isCredentialsView ? (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl mb-1">Welcome Back</h2>
                <p className="text-sm text-muted-foreground">Explore the Demo</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedDemoRole("member")}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    selectedDemoRole === "member"
                      ? "border-primary bg-primary/5"
                      : "border-border bg-card hover:border-primary/50"
                  }`}
                >
                  <Users
                    className={`w-6 h-6 mx-auto mb-2 ${
                      selectedDemoRole === "member"
                        ? "text-primary"
                        : "text-muted-foreground"
                    }`}
                  />
                  <div className="text-sm">Chamber Member</div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedDemoRole("staff")}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    selectedDemoRole === "staff"
                      ? "border-primary bg-primary/5"
                      : "border-border bg-card hover:border-primary/50"
                  }`}
                >
                  <UserCog
                    className={`w-6 h-6 mx-auto mb-2 ${
                      selectedDemoRole === "staff"
                        ? "text-primary"
                        : "text-muted-foreground"
                    }`}
                  />
                  <div className="text-sm">Chamber Staff</div>
                </button>
              </div>

              <label htmlFor="demo-identity" className="sr-only">
                Select demo identity
              </label>
              <select
                id="demo-identity"
                value={
                  selectedDemoRole === "staff" ? selectedStaffEmail : selectedMemberEmail
                }
                onChange={(event) => {
                  if (selectedDemoRole === "staff") {
                    setSelectedStaffEmail(event.target.value);
                    return;
                  }

                  setSelectedMemberEmail(event.target.value);
                }}
                className="w-full px-4 py-3 bg-input-background rounded-xl border-0 focus:ring-2 focus:ring-primary outline-none text-sm"
              >
                {(selectedDemoRole === "staff" ? staffDemoUsers : memberDemoUsers).map(
                  (user) => (
                    <option key={user.id} value={user.email}>
                      {user.name}
                      {user.id === "member-001" ? " — Recommended" : ""}
                    </option>
                  )
                )}
              </select>

              <button
                type="button"
                onClick={handleDemoLogin}
                className="w-full bg-primary text-white py-3 rounded-xl hover:opacity-90 transition-opacity"
              >
                Continue
              </button>

              <button
                type="button"
                onClick={() => navigate("/login/credentials")}
                className="w-full text-center text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                or sign in with demo credentials
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-sm text-primary hover:opacity-80 transition-opacity"
              >
                ← Back to demo access
              </button>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm mb-2">
                    Email address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                      className="w-full pl-12 pr-4 py-3 bg-input-background rounded-xl border-0 focus:ring-2 focus:ring-primary outline-none"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label htmlFor="password" className="block text-sm mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                      className="w-full pl-12 pr-4 py-3 bg-input-background rounded-xl border-0 focus:ring-2 focus:ring-primary outline-none"
                    />
                  </div>
                </div>

                {/* Role Selection */}
                <div className="pt-2">
                  <label className="block text-sm mb-3">Login as:</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedRole("member")}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        selectedRole === "member"
                          ? "border-primary bg-primary/5"
                          : "border-border bg-card hover:border-primary/50"
                      }`}
                    >
                      <Users className={`w-6 h-6 mx-auto mb-2 ${
                        selectedRole === "member" ? "text-primary" : "text-muted-foreground"
                      }`} />
                      <div className="text-sm">Chamber Member</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedRole("staff")}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        selectedRole === "staff"
                          ? "border-primary bg-primary/5"
                          : "border-border bg-card hover:border-primary/50"
                      }`}
                    >
                      <UserCog className={`w-6 h-6 mx-auto mb-2 ${
                        selectedRole === "staff" ? "text-primary" : "text-muted-foreground"
                      }`} />
                      <div className="text-sm">Chamber Staff</div>
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-3 text-center">
                    {selectedRole === "staff"
                      ? "Chamber Staff have access to the analytics dashboard"
                      : "Members can access venues, check-ins, and rewards"}
                  </p>
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  className="w-full bg-primary text-white py-3 rounded-xl hover:opacity-90 transition-opacity mt-6"
                >
                  Login
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-white/60 text-xs mt-6">
          Sydney CBD Chamber of Commerce © 2026
        </p>
      </motion.div>
    </div>
  );
}
