// src/Pages/Register.jsx
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

function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const appwriteAccount = new AppwriteAccount();

  function handleLogInNavigate() {
    navigate("/login");
  }

  async function handleUserRegistration(e) {
    if (e && e.preventDefault) e.preventDefault();

    setError("");
    if (!fullName.trim() || !email.trim() || !password.trim()) {
      setError("Please fill all fields.");
      return;
    }

    setLoading(true);
    try {
      await appwriteAccount.createAppwriteAccount(email, password, fullName);

      navigate("/login");
    } catch (err) {
      setError(err?.message || "Registration failed. Try again.");
      console.error("Signup error:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Register a new account</CardTitle>
          <CardDescription>
            Enter your details to register a new SkillForge AI account.
          </CardDescription>

          <CardAction>
            <Button onClick={handleLogInNavigate} variant="ghost">
              Log In
            </Button>
          </CardAction>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleUserRegistration} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="e.g., Sathwik Goud"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

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
                placeholder="******"
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
            onClick={handleUserRegistration}
            className="w-full"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </Button>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => alert("Google Sign Up not implemented yet")}
          >
            Sign Up with Google
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default Register;
