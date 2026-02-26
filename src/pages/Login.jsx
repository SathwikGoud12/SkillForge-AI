// src/Pages/Login.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import AppwriteAccount from "../appwrite/Account.services";
import useAuthStore from "../store/authStore";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  const navigate = useNavigate();
  const appwriteAccount = new AppwriteAccount();
  const setCurrentUser = useAuthStore((state) => state.setCurrentUser);
  const setIsCheckingUser = useAuthStore((state) => state.setIsCheckingUser);

  // On mount: check if user is already logged in and redirect them
  useEffect(() => {
    async function checkExistingSession() {
      try {
        const existingUser = await appwriteAccount.getAppwriteUser();
        if (existingUser) {
          // Update store and redirect
          setCurrentUser(existingUser);
          setIsCheckingUser(false);
          if (existingUser.labels?.includes('admin')) {
            navigate("/dashboard", { replace: true });
          } else {
            navigate("/user", { replace: true });
          }
          return;
        }
      } catch {
        // No session, show login form
      } finally {
        setCheckingSession(false);
      }
    }
    checkExistingSession();
  }, []);

  function handleNavigateToRegisterPage() {
    navigate("/register");
  }

  async function handleLogInUser(e) {
    if (e && e.preventDefault) e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await appwriteAccount.createAppwriteEmailPasswordSession(email, password);
      const loggedInUser = await appwriteAccount.getAppwriteUser();

      if (!loggedInUser) {
        throw new Error("Failed to retrieve user after login.");
      }

      // Update the global auth store so PrivateRoute knows the user is logged in
      setCurrentUser(loggedInUser);
      setIsCheckingUser(false);

      // Navigate based on role
      if (loggedInUser.labels?.includes('admin')) {
        navigate("/dashboard");
      } else {
        navigate("/user");
      }
    } catch (err) {
      setError(err?.message || "Login failed. Check credentials and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      {/* Show loader while checking existing session */}
      {checkingSession ? (
        <div className="flex flex-col items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-2xl shadow-purple-500/50 animate-pulse">
            <span className="text-white font-bold text-2xl">SF</span>
          </div>
          <div className="flex gap-2">
            <div className="w-2.5 h-2.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2.5 h-2.5 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2.5 h-2.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      ) : (
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email & password to login to your SkillForge AI account.
          </CardDescription>

          <CardAction>
            <Button onClick={handleNavigateToRegisterPage} variant="ghost">
              Sign Up
            </Button>
          </CardAction>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogInUser} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </form>

          {error && (
            <div className="mt-3 text-sm text-red-700 bg-red-50 p-2 rounded">
              {error}
            </div>
          )}
        </CardContent>

        <CardFooter className="flex-col gap-2">
          <Button
            onClick={handleLogInUser}
            className="w-full"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Login"}
          </Button>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => alert("Login with Google not implemented yet")}
          >
            Login with Google
          </Button>
        </CardFooter>
      </Card>
      )}
    </div>
  );
}

export default Login;
