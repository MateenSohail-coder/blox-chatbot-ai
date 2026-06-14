"use client";

import React, { useState, useEffect } from "react";
import { UseAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import {
  LogOut,
  User,
  Mail,
  Moon,
  Sun,
  Edit2,
  Check,
  X,
  ShieldCheck,
  History,
} from "lucide-react";
import Link from "next/link";

// Shadcn UI Components
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

// Skeleton component for loading state
function SkeletonLoader({ className = "" }) {
  return (
    <div
      className={`bg-neutral-200 dark:bg-neutral-800 animate-pulse rounded-xs ${className}`}
    />
  );
}

export default function Settings() {
  const { user, logout, UpdateUsername, setloadUsername } = UseAuth();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isEditingName, setIsEditingName] = useState(false);
  const [username, setUsername] = useState(""); // Changed from "Guest" to empty
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingUser, setIsLoadingUser] = useState(true); // New loading state

  // Effect to load user data when component mounts or user changes
  useEffect(() => {
    if (user) {
      setIsLoadingUser(false);
      setUsername(user?.username || ""); // Sync with actual user.username
    } else {
      setIsLoadingUser(true);
      setUsername("");
    }
  }, [user]);

  // Handle name update submission
  const handleSaveName = async () => {
    if (!username.trim()) {
      toast.error("Username cannot be empty");
      return;
    }
    setIsSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const res = await UpdateUsername(user.userId, username.trim());
      toast.success(res);
      setUsername(username.trim()); // Update to saved value
      setloadUsername((pre) => pre + 1);
      setIsEditingName(false);
    } catch (err) {
      toast.error("Failed to update username");
    } finally {
      setIsSaving(false);
    }
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
    toast(`${!isDarkMode ? "Dark" : "Light"} mode enabled`, {
      position: "bottom-right",
    });
  };

  const handleLogoutConfirm = () => {
    logout?.();
    toast.success("Logged out successfully");
  };

  // Fixed: Handle cancel edit - reset to original user username
  const handleCancelEdit = () => {
    setUsername(user?.username || ""); // Reset to ORIGINAL username from user object
    setIsEditingName(false);
  };

  return (
    <ScrollArea className="h-full min-h-screen w-full overflow-y-auto pb-20 bg-neutral-50 text-neutral-900 dark:bg-black dark:text-neutral-100 transition-colors duration-200">
      <div className="max-w-2xl mx-auto px-4 py-10 flex flex-col gap-8">
        {/* Header Block Container */}
        <div className="border-b border-neutral-200 dark:border-neutral-800/60 pb-5">
          <h1 className="text-xl font-semibold tracking-tight font-sans">
            Account Settings
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 font-sans">
            Manage your digital profile identities and system preferences.
          </p>
        </div>

        {/* Profile Identity Avatar row */}
        <div className="flex items-center gap-4 p-4 border border-neutral-200 dark:border-neutral-900 bg-white dark:bg-neutral-900/40 rounded-sm">
          <div className="h-16 w-16 rounded-full bg-blue-600 text-neutral-200 text-2xl flex items-center justify-center font-bold tracking-tight border border-neutral-200 dark:border-neutral-700">
            {isLoadingUser ? (
              <SkeletonLoader className="h-8 w-8 rounded-full" />
            ) : (
              username.slice(0, 1).toUpperCase()
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-neutral-400 dark:text-neutral-500 font-sans">
              Profile Account
            </p>
            {isLoadingUser ? (
              <SkeletonLoader className="h-5 w-32 mt-1" />
            ) : (
              <h2 className="text-base font-semibold text-neutral-800 dark:text-neutral-100 truncate">
                {username || "No username"}
              </h2>
            )}
          </div>
        </div>

        {/* Section 1: Information Inputs */}
        <div className="flex flex-col gap-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 font-sans">
            User Credentials
          </h3>

          {/* Username Field Row */}
          <div className="flex flex-col gap-1.5 p-3.5 border border-neutral-200 dark:border-neutral-900 bg-white dark:bg-neutral-900/20 rounded-sm">
            <label className="text-[11px] font-medium text-neutral-400 dark:text-neutral-500 flex items-center gap-1.5 font-sans">
              <User size={12} /> USERNAME
            </label>
            <div className="flex items-center gap-2 mt-1">
              {isLoadingUser ? (
                <SkeletonLoader className="h-8 w-full" />
              ) : isEditingName ? (
                <div className="flex items-center gap-2 w-full">
                  <Input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="h-8 text-sm bg-neutral-50 dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 rounded-xs focus-visible:ring-1 focus-visible:ring-blue-500"
                    disabled={isSaving}
                  />
                  <Button
                    size="icon"
                    onClick={handleSaveName}
                    disabled={isSaving}
                    className="h-8 w-8 bg-blue-600 hover:bg-blue-700 text-white rounded-xs shrink-0"
                  >
                    <Check size={14} />
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={handleCancelEdit} // Fixed: Now uses handleCancelEdit
                    disabled={isSaving}
                    className="h-8 w-8 rounded-xs border-neutral-200 dark:border-neutral-800 shrink-0"
                  >
                    <X size={14} />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-between w-full">
                  <span className="text-sm font-medium tracking-wide">
                    {username || "No username"}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditingName(true)}
                    className="h-7 text-xs text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 gap-1 rounded-xs px-2"
                  >
                    <Edit2 size={12} /> Edit
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* User Email Row (Read Only) */}
          <div className="flex flex-col gap-1.5 p-3.5 border border-neutral-200 dark:border-neutral-900 bg-white dark:bg-neutral-900/20 rounded-sm opacity-90">
            <label className="text-[11px] font-medium text-neutral-400 dark:text-neutral-500 flex items-center gap-1.5 font-sans">
              <Mail size={12} /> EMAIL ADDRESS
            </label>
            <div className="flex items-center justify-between mt-1">
              {isLoadingUser ? (
                <SkeletonLoader className="h-5 w-48" />
              ) : (
                <span className="text-sm text-neutral-600 dark:text-neutral-300 select-all font-sans">
                  {user?.userEmail || "no-email-connected@domain.com"}
                </span>
              )}
              <span className="text-[10px] font-medium tracking-wider bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 text-neutral-400 dark:text-neutral-500 rounded-xs flex items-center gap-1 font-sans">
                <ShieldCheck size={10} className="text-emerald-500" /> VERIFIED
              </span>
            </div>
          </div>
        </div>

        {/* Section 2: Preferences Configurations */}
        <div className="flex flex-col gap-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 font-sans">
            Preferences
          </h3>

          {/* Theme Switcher List Row */}
          <div className="flex items-center justify-between p-3.5 border border-neutral-200 dark:border-neutral-900 bg-white dark:bg-neutral-900/20 rounded-sm">
            <div className="flex flex-col">
              <span className="text-sm font-medium">Interface Theme</span>
              <span className="text-[11px] text-neutral-400 dark:text-neutral-500 font-sans">
                Toggle between clear bright environments and pitch black
                screens.
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={toggleTheme}
              className="h-8 rounded-xs px-3 border-neutral-200 dark:border-neutral-800 bg-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-medium gap-1.5"
            >
              {isDarkMode ? (
                <>
                  <Sun size={13} className="text-amber-500" />
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  <Moon size={13} className="text-indigo-400" />
                  <span>Dark Mode</span>
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Section 3: Navigation Actions */}
        <div className="flex flex-col gap-2 pt-4 border-t border-neutral-200 dark:border-neutral-800/60">
          <Link
            href="/dashboard/history"
            className="flex items-center justify-between p-3 border border-neutral-200 dark:border-neutral-900 bg-white dark:bg-neutral-900/20 rounded-sm hover:border-neutral-300 dark:hover:border-neutral-800 text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors font-sans"
          >
            <div className="flex items-center gap-2">
              <History size={14} className="text-neutral-400" />
              <span>Review & Clean Historical Logs</span>
            </div>
            <span className="text-[10px] text-neutral-400">→</span>
          </Link>

          {/* Shadcn Alert Dialog Action Context */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                className="w-full h-10 mt-2 bg-red-600/10 dark:bg-red-500/10 hover:bg-red-600 dark:hover:bg-red-500 dark:hover:text-white hover:text-white text-red-600 dark:text-red-400 text-xs font-medium rounded-sm border border-red-200 dark:border-red-950/40 transition-all flex items-center justify-center gap-2 font-sans cursor-pointer"
              >
                <LogOut size={14} /> Log Out of System Session
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="rounded-sm border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 max-w-sm">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-base font-medium">
                  Log out of your account?
                </AlertDialogTitle>
                <AlertDialogDescription className="text-xs text-neutral-500 dark:text-neutral-400 font-sans">
                  You will need to re-authenticate with your security parameters
                  to access dashboard tracking logs next time.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="gap-2 sm:gap-0">
                <AlertDialogCancel className="rounded-xs text-xs border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleLogoutConfirm}
                  className="rounded-xs text-xs bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
                >
                  Confirm Log Out
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </ScrollArea>
  );
}
