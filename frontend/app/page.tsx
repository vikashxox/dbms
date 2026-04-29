"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, User, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";

type Role = "member" | "librarian";

export default function LoginPage() {
  const router = useRouter();
  const { login, loading, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("member");
  const [localError, setLocalError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!email || !password) {
      setLocalError("Email and password are required");
      return;
    }

    try {
      await login(email, password, role);
      router.push(role === "member" ? "/member" : "/librarian");
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : "Login failed");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md border-border bg-card">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary">
            <BookOpen className="h-7 w-7 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">LibraryHub</CardTitle>
          <CardDescription className="text-muted-foreground">
            Sign in to your library account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="flex flex-col gap-6">
            {(error || localError) && (
              <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                {error || localError}
              </div>
            )}
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="email" className="text-foreground">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className="border-border bg-input text-foreground placeholder:text-muted-foreground"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="password" className="text-foreground">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="border-border bg-input text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-foreground">Select Role</Label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole("member")}
                  disabled={loading}
                  className={`flex flex-col items-center gap-2 rounded-lg border p-4 transition-all ${
                    role === "member"
                      ? "border-primary bg-primary/10"
                      : "border-border bg-secondary hover:border-muted-foreground"
                  } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <User className={`h-6 w-6 ${role === "member" ? "text-primary" : "text-muted-foreground"}`} />
                  <span className={`text-sm font-medium ${role === "member" ? "text-primary" : "text-muted-foreground"}`}>
                    Member
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole("librarian")}
                  disabled={loading}
                  className={`flex flex-col items-center gap-2 rounded-lg border p-4 transition-all ${
                    role === "librarian"
                      ? "border-primary bg-primary/10"
                      : "border-border bg-secondary hover:border-muted-foreground"
                  } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <Shield className={`h-6 w-6 ${role === "librarian" ? "text-primary" : "text-muted-foreground"}`} />
                  <span className={`text-sm font-medium ${role === "librarian" ? "text-primary" : "text-muted-foreground"}`}>
                    Librarian
                  </span>
                </button>
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
