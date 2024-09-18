"use client";

import React from "react";
import { Fugaz_One } from "next/font/google";
import { useState } from "react";
import Button from "./Button";
import { useAuth } from "@/context/AuthContext";

const fugaz = Fugaz_One({ subsets: ["latin"], weight: ["400"] });

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [authenticating, setAuthenticating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { signup, login } = useAuth();

  const errorMessages = {
    "auth/user-not-found": "No account with this email exists. Sign up below.",
    "auth/wrong-password": "Incorrect password. Please try again.",
    "auth/invalid-email":
      "Invalid email format. Please check your email and try again.",
    "auth/invalid-credential":
      "Invalid email or password. Please check your credentials and try again.",
    default: "Failed to authenticate. Please check your details and try again.",
  };

  async function handleSubmit() {
    setErrorMessage("");
    if (!email || !password || password.length < 6) {
      setErrorMessage(
        "Please enter a valid email and password of at least 6 characters."
      );
      return;
    }

    setAuthenticating(true);
    try {
      if (isRegister) {
        await signup(email, password);
      } else {
        await login(email, password);
      }
    } catch (err) {
      const message = errorMessages[err.code] || errorMessages.default;
      setErrorMessage(message);
    } finally {
      setAuthenticating(false);
    }
  }

  return (
    <div className="flex flex-col flex-1 justify-center items-center gap-4">
      <h3 className={"text-4xl sm:text-5xl md:text-6xl " + fugaz.className}>
        {isRegister ? "Register" : "Log In"}
      </h3>
      <p>You&#39;re one step away!</p>
      {errorMessage && <p className="text-red-600">{errorMessage}</p>}
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full max-w-[400px] mx-auto px-3 duration-200 hover:border-indigo-600 focus:border-indigo-600 py-2 sm:py3 border border-solid border-indigo-400 rounded-full outline-none"
        placeholder="Email"
      />
      <input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full max-w-[400px] mx-auto px-3 duration-200 hover:border-indigo-600 focus:border-indigo-600 py-2 sm:py3 border border-solid border-indigo-400 rounded-full outline-none"
        placeholder="Password"
        type="password"
      />
      <div className="max-w-[400px] w-full mx-auto">
        <Button
          clickHandler={handleSubmit}
          text={authenticating ? "Submitting" : "Submit"}
          full
        />
      </div>
      <p className="text-center">
        {isRegister ? "Already have an account? " : "Don't have an account? "}
        <button
          onClick={() => setIsRegister(!isRegister)}
          className="text-indigo-600"
        >
          {isRegister ? "Sign in" : "Sign up"}
        </button>
      </p>
    </div>
  );
}
