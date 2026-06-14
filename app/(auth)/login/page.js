"use client";

import axios from "axios";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { UseAuth } from "@/context/AuthContext";
import { ArrowLeftCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Stagger animation container config
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
};

export default function Login() {
  const [loader, setloader] = useState(false);
  const router = useRouter();
  const { setloaduserdata } = UseAuth();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onChange",
  });

  async function submit(data) {
    setloader(true);
    try {
      const res = await axios.post("/api/auth/login", data);

      toast.success("Welcome Back!", {
        description: res.data.message || "Logged in successfully.",
      });
      setloaduserdata((pre) => pre + 1);
      router.push("/dashboard/Chats");
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Something went wrong!";
      toast.error("Login Failed", { description: errorMsg });
      reset();
    } finally {
      setloader(false);
    }
  }

  return (
    <div className="relative md:border-20 border-blue-600  min-h-screen w-full flex items-center justify-center p-4 overflow-hidden">
      {/* Decorative floating blurred background shapes */}
      <motion.div
        animate={{ x: [0, 20, 0], y: [0, -20, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{ x: [0, -30, 0], y: [0, 30, 0] }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="w-full max-w-4xl z-10"
      >
        <Card className="w-full relative overflow-hidden p-0 shadow-2xl  border-2 md:border-4 border-blue-600 bg-card/80 backdrop-blur-md">
          <Tooltip asChild>
            <TooltipTrigger asChild>
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: "spring", duration: 0.5 }}
                className="absolute top-5 left-5 cursor-pointer active:scale-[0.96]"
              >
                <Link href="/">
                  <ArrowLeftCircle className="text-blue-600 w-8 h-8" />
                </Link>
              </motion.div>
            </TooltipTrigger>
            <TooltipContent>Home</TooltipContent>
          </Tooltip>

          <CardContent className="grid p-0 md:grid-cols-2">
            {/* Left Column: Interactive Form */}
            <form
              onSubmit={handleSubmit(submit)}
              className="p-6 md:p-10 flex flex-col justify-center gap-6"
            >
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="flex flex-col gap-5"
              >
                <motion.div
                  variants={itemVariants}
                  className="flex flex-col items-center gap-2 text-center mb-2"
                >
                  <h1 className="text-3xl font-extralight font-Gasoek bg-gradient-to-r from-blue-600 to-foreground/70 bg-clip-text text-transparent">
                    Login Here
                  </h1>
                  <p className="text-sm text-muted-foreground text-balance">
                    Enter your credentials to access your account
                  </p>
                </motion.div>

                {/* Email Field */}
                <motion.div variants={itemVariants} className="grid gap-2">
                  <Label
                    htmlFor="email"
                    className={errors.email ? "text-destructive" : ""}
                  >
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="aliahmad@gmail.com"
                    disabled={loader}
                    className={`transition-all duration-200 ${
                      errors.email
                        ? "border-destructive focus-visible:ring-destructive"
                        : "focus-visible:ring-primary/50"
                    }`}
                    {...register("email", { required: " Email is required" })}
                  />
                  {errors.email && (
                    <p className="text-xs font-medium text-destructive">
                      {errors.email.message}
                    </p>
                  )}
                </motion.div>

                {/* Password Field */}
                <motion.div variants={itemVariants} className="grid gap-2">
                  <Label
                    htmlFor="password"
                    className={errors.password ? "text-destructive" : ""}
                  >
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="******"
                    disabled={loader}
                    className={`transition-all duration-200 ${
                      errors.password
                        ? "border-destructive focus-visible:ring-destructive"
                        : "focus-visible:ring-primary/50"
                    }`}
                    {...register("password", {
                      required: " Password is required",
                      maxLength: {
                        value: 15,
                        message: " Password must be under 15 characters",
                      },
                      minLength: {
                        value: 8,
                        message: " Password must be above 8 characters",
                      },
                    })}
                  />
                  {errors.password && (
                    <p className="text-xs font-medium text-destructive">
                      {errors.password.message}
                    </p>
                  )}
                </motion.div>

                {/* Submit Button with Scale Effect */}
                <motion.div
                  variants={itemVariants}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <Button
                    type="submit"
                    className="w-full mt-2 bg-blue-600 text-white hover:bg-blue-500"
                    disabled={loader}
                  >
                    {loader ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Authenticating...
                      </>
                    ) : (
                      "Submit"
                    )}
                  </Button>
                </motion.div>

                {/* Link to Signup */}
                <motion.p
                  variants={itemVariants}
                  className="text-sm text-center text-muted-foreground mt-2"
                >
                  Don't have an account?{" "}
                  <Link
                    href="/signup"
                    className="underline underline-offset-4 hover:text-primary transition-colors"
                  >
                    Signup Here
                  </Link>
                </motion.p>
              </motion.div>
            </form>

            {/* Right Column: Decorative Image Split with Zoom effect */}
            <div className="relative hidden bg-muted md:block overflow-hidden">
              <motion.img
                initial={{ scale: 1.1, opacity: 0.8 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                src="https://inero-software.com/wp-content/uploads/2025/01/AI2.png"
                alt="Login Background Image"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
