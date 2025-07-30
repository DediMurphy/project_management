// src/components/auth/SignInForm.js
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, Eye, EyeOff } from "lucide-react";
import Label from "../ui/label/Label";
import Input from "../ui/input/InputField";
import Button from "../ui/button/Button";
import { useAuth } from "../../hooks/useAuth";

export default function SignInForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const { login, error } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await login(username, password);
        if (success) navigate("/");
    };

    return (
        <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-8 shadow-md bg-white dark:bg-gray-900">
                <div className="mb-5 sm:mb-8">
                    <h1 className="mb-2 text-center font-semibold text-grayx-800 text-title-sm dark:text-white/90 sm:text-title-md">
                        Sign In
                    </h1>
                    <p className="text-sm text-center text-gray-500 dark:text-gray-400">
                        Enter your username and password to sign in!
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="space-y-6">
                        <div>
                            <Label>
                                Username <span className="text-error-500">*</span>
                            </Label>
                            <Input
                                type="text"
                                value={username}
                                placeholder="username"
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>

                        <div>
                            <Label>
                                Password <span className="text-error-500">*</span>
                            </Label>
                            <div className="relative">
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                />
                                <span
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                                >
              {showPassword ? (
                  <Eye className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              ) : (
                  <EyeOff className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              )}
            </span>
                            </div>
                        </div>

                        {error && (
                            <div className="text-error-500 mb-3 text-center">{error}</div>
                        )}

                        <div>
                            <Button type="submit" className="w-full" size="sm">
                                Sign in
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
