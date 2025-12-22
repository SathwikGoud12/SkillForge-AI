// src/Pages/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router";
import AppwriteAccount from "../appwrite/Account.services";

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

  const navigate = useNavigate();
  const appwriteAccount = new AppwriteAccount();

  function handleNavigateToRegisterPage() {
    navigate("/register");
  }

  async function handleLogInUser(e) {
    if (e && e.preventDefault) e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const existingUser = await appwriteAccount.getAppwriteUser();
      if (existingUser) {
        navigate("/dashboard");
        return;
      }

      await appwriteAccount.createAppwriteEmailPasswordSession(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err?.message || "Login failed. Check credentials and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gray-50">
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
    </div>
  );
}

export default Login;
