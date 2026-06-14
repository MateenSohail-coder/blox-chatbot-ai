"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

import {
  History,
  MessageSquareCode,
  MoreHorizontal,
  Plus,
  Settings,
  LogOut,
  Trash2,
  Edit2,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UseAuth } from "@/context/AuthContext";
import { Loader } from "lucide-react";
import { toast } from "sonner";
import { ArrowRightCircle } from "lucide-react";
import AnimatedIcon from "./sparkIcon";

// ─── Skeleton ───────────────────────────────────────────────────────────────
const ConversationSkeleton = () => (
  <div className="flex items-center gap-2 px-2 py-2.5 animate-pulse">
    <div className="h-3 w-32 rounded-xs bg-muted" />
    <div className="h-3.5 w-3.5 rounded-lg bg-muted flex-shrink-0" />
  </div>
);

// ─── Nav items ───────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { title: "New Chat", href: "/dashboard/Chats", icon: Plus },
  { title: "History", href: "/dashboard/history", icon: History },
  { title: "Settings", href: "/dashboard/settings", icon: Settings },
];

// ─── Component ───────────────────────────────────────────────────────────────
export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const {
    user,
    logout,
    conversation,
    GetConversations,
    trigger2,
    settrigger2,
    UpdateConversation,
    DeleteConversation,
  } = UseAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  const [renameText, setRenameText] = useState("");
  const [dialogeLoader, setdialogeLoader] = useState(false);
  // Fetch conversations
  useEffect(() => {
    setIsLoading(true);
    GetConversations(user.userId);
    const t = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(t);
  }, [user.userId, trigger2]);

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleDeleteClick = (chat) => {
    setSelectedChat(chat);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedChat) return;
    const mess = await DeleteConversation(selectedChat._id);
    toast.success(mess);
    settrigger2((pre) => pre + 1);
    setDeleteDialogOpen(false);
    setSelectedChat(null);
  };

  // ── Rename ────────────────────────────────────────────────────────────────
  const handleRenameClick = (chat) => {
    setSelectedChat(chat);
    setRenameText(chat.title);
    setRenameDialogOpen(true);
  };

  const handleRenameConfirm = async () => {
    setdialogeLoader(true);
    if (!selectedChat || !renameText.trim()) return;
    const mess = await UpdateConversation(selectedChat._id, renameText);
    toast.success(mess);

    settrigger2((pre) => pre + 1);
    setRenameDialogOpen(false);
    setSelectedChat(null);
    setRenameText("");
    setdialogeLoader(false);
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <Sidebar
      collapsible="offcanvas"
      className="border-r border-border bg-background text-foreground dark:bg-black dark:border-neutral-900"
    >
      {/* Header */}
      <SidebarHeader className="dark:bg-black px-4 py-5 ">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center ">
            <AnimatedIcon
              animation="draw"
              loop={1}
              color="#378ADD"
              size={50}
              speed={2}
            />{" "}
          </div>
          <div>
            <p className="font-extralight font-Gasoek text-base  leading-none text-foreground">
              Blox
            </p>
            <p className="mt-1 text-xs text-muted-foreground ">AI Workspace</p>
          </div>
        </div>
      </SidebarHeader>

      {/* Content */}
      <SidebarContent className="overflow-hidden  dark:bg-black">
        {/* Navigation */}
        <SidebarGroup className="px-2 pt-4">
          <SidebarGroupLabel className="mb-1.5 px-2 text-xs font-semibold  tracking-widest text-muted-foreground/70">
            Navigation
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {NAV_ITEMS.map(({ title, href, icon: Icon }) => {
                const active = pathname === href;
                return (
                  <SidebarMenuItem key={href}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      className={`
                        group rounded-sm px-3 py-2.5 transition-all duration-150 text-base
                        ${
                          active
                            ? "bg-accent text-accent-foreground font-medium"
                            : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                        }
                      `}
                    >
                      <Link href={href} className="flex items-center gap-2.5 ">
                        <Icon size={25} className="flex-shrink-0" />
                        <span>{title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Divider */}
        <div className="mx-4 my-3 border-t border-border dark:border-neutral-900" />

        {/* Conversations */}
        <SidebarGroup className="flex-1 px-2">
          <SidebarGroupLabel className="mb-1.5 px-2 text-xs font-semibold  tracking-widest text-muted-foreground/70">
            Conversations
          </SidebarGroupLabel>

          <SidebarGroupContent className="flex h-[80%] min-h-0 flex-col ">
            <ScrollArea className="flex-1 h-full ">
              <SidebarMenu className="space-y-1 ">
                {isLoading && (
                  <>
                    <ConversationSkeleton />
                    <ConversationSkeleton />
                    <ConversationSkeleton />
                    <ConversationSkeleton />
                  </>
                )}

                {!isLoading &&
                  conversation?.map((chat) => {
                    const active = pathname === `/dashboard/Chats/${chat._id}`;

                    return (
                      <SidebarMenuItem key={chat._id}>
                        <div className="group/item w-full grid grid-cols-[80%_20%]  items-start justify-between gap-2 rounded-sm">
                          {/* Title Area */}
                          <div className="flex-1 min-w-0">
                            <SidebarMenuButton
                              asChild
                              isActive={active}
                              className={`
                             
              w-full rounded-sm px-3 py-2.5
                transition-all duration-150 text-base
                ${
                  active
                    ? "!bg-blue-600 !text-white font-medium"
                    : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                }
              `}
                            >
                              <Link
                                href={`/dashboard/Chats/${chat._id}`}
                                className=""
                              >
                                <span className=" w-full truncate wrap-break-word">
                                  {chat.title}
                                </span>
                              </Link>
                            </SidebarMenuButton>
                          </div>

                          {/* Actions */}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button
                                className="
      
                  shrink-0
                  flex h-8 w-8 items-center justify-center
                  rounded-sm
                  opacity-0
                  group-hover/item:opacity-100
                  focus:opacity-100
                  focus:ring-0
                  focus:outline-0
                  text-muted-foreground
                  hover:text-foreground
                  hover:bg-accent
                  transition-all duration-150
                "
                              >
                                <MoreHorizontal size={16} />
                              </button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent
                              align="start"
                              className="
                w-44 rounded-sm
                bg-popover text-popover-foreground
                border border-border
                p-1 shadow-xl
                
                dark:bg-zinc-950
                dark:border-neutral-800
              "
                            >
                              <DropdownMenuItem
                                onClick={() => handleRenameClick(chat)}
                                className="
                  flex items-center gap-2
                  rounded-xs px-2 py-2
                  text-base
                  text-muted-foreground
                  hover:text-foreground
                  hover:bg-accent
                  cursor-pointer
                "
                              >
                                <Edit2 size={14} />
                                Rename
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                onClick={() => handleDeleteClick(chat)}
                                className="
                  flex items-center gap-2
                  rounded-xs px-2 py-2
                  text-base
                  text-destructive
                  hover:bg-destructive/10
                  cursor-pointer
                "
                              >
                                <Trash2 size={14} />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </SidebarMenuItem>
                    );
                  })}

                {!isLoading && conversation?.length === 0 && (
                  <div className="px-3 py-10 text-center flex flex-col items-center justify-center ">
                    <p className="text-sm text-muted-foreground ">
                      No conversations yet
                    </p>
                    <Link
                      href="/dashboard/Chats"
                      className="mt-2 flex items-center gap-2  text-sm text-foreground underline underline-offset-4 transition-colors"
                    >
                      Start one{" "}
                      <ArrowRightCircle className="w-5 h-5 dark:text-white text-black" />
                    </Link>
                  </div>
                )}
              </SidebarMenu>

              <ScrollBar
                orientation="vertical"
                className="w-1 bg-transparent"
              />
            </ScrollArea>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="border-t border-border p-3 dark:border-neutral-900 dark:bg-black">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="
                flex w-full items-center gap-3 px-3 py-2.5
                transition-all duration-150
              "
            >
              <Avatar className="h-8 w-8 rounded-sm flex-shrink-0">
                <AvatarFallback className="rounded-full bg-blue-600 text-white text-base font-medium ">
                  {user?.username?.charAt(0)?.toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 text-left overflow-hidden">
                <p className="text-base font-medium text-foreground truncate leading-none py-1 ">
                  {user?.username}
                </p>
                <p className="mt-1 text-xs text-muted-foreground truncate ">
                  {user?.userEmail}
                </p>
              </div>

              <MoreHorizontal
                size={16}
                className="text-muted-foreground flex-shrink-0"
              />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-52 rounded-sm bg-popover text-popover-foreground border border-border p-1 shadow-xl  dark:bg-zinc-950 dark:border-neutral-800"
          >
            <DropdownMenuItem
              onClick={() => router.push("/dashboard/settings")}
              className="flex items-center gap-2 rounded-xs px-2 py-2 text-base text-muted-foreground hover:text-foreground hover:bg-accent cursor-pointer"
            >
              <Settings size={14} />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={logout}
              className="flex items-center gap-2 rounded-xs px-2 py-2 text-base text-destructive hover:bg-destructive/10 cursor-pointer"
            >
              <LogOut size={14} />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>

      {/* ── Delete Dialog ────────────────────────────────────────────────── */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className=" bg-background text-foreground border border-border rounded-sm shadow-2xl max-w-sm dark:bg-zinc-950 dark:border-neutral-800">
          <DialogHeader>
            <DialogTitle className=" text-base text-foreground">
              Delete conversation
            </DialogTitle>
            <DialogDescription className="text-base text-muted-foreground mt-1">
              "{selectedChat?.title}" will be permanently removed. This can't be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 mt-3 rounded-b-none">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              className="rounded-sm border border-border text-muted-foreground hover:text-foreground text-base h-10"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              variant="destructive"
              disabled={dialogeLoader}
              className="rounded-sm text-base disabled:opacity-20 h-10"
            >
              {dialogeLoader ? (
                <div className="flex text-sm items-center gap-1">
                  <Loader className="text-black h-20 w-20 spin-in" />{" "}
                  Deleting{" "}
                </div>
              ) : (
                <div className="flex text-sm items-center gap-1">
                  <Trash2 size={14} className="mr-1.5" />
                  Delete
                </div>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Rename Dialog ────────────────────────────────────────────────── */}
      <Dialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen}>
        <DialogContent className=" bg-background text-foreground border border-border rounded-sm shadow-2xl max-w-sm dark:bg-zinc-950 dark:border-neutral-800">
          <DialogHeader>
            <DialogTitle className=" text-base text-foreground">
              Rename conversation
            </DialogTitle>
            <DialogDescription className="text-base text-muted-foreground mt-1">
              Give this conversation a new name.
            </DialogDescription>
          </DialogHeader>
          <Input
            value={renameText}
            onChange={(e) => setRenameText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleRenameConfirm()}
            placeholder="Conversation name"
            className="
              mt-2 h-10 rounded-sm bg-accent/50 border border-border
              text-foreground placeholder:text-muted-foreground text-base
              focus-visible:ring-1 focus-visible:ring-ring
            "
            autoFocus
          />
          <DialogFooter className="gap-2 mt-3 rounded-b-none">
            <Button
              variant="outline"
              onClick={() => setRenameDialogOpen(false)}
              className="rounded-sm border border-border text-muted-foreground hover:text-foreground text-base h-10"
            >
              Cancel
            </Button>
            <Button
              onClick={handleRenameConfirm}
              disabled={!renameText.trim() && dialogeLoader}
              className="rounded-sm bg-primary disabled:bg-primary/40 disabled:cursor-not-allowed text-primary-foreground hover:bg-primary/90 font-medium text-base h-10"
            >
              {dialogeLoader ? (
                <div className="flex text-sm items-center gap-1">
                  <Loader className="text-black h-20 w-20 spin-in" />{" "}
                  Renaming{" "}
                </div>
              ) : (
                <div className="flex text-sm items-center gap-1">
                  <Edit2 size={14} className="mr-1.5" />
                  Rename{" "}
                </div>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Sidebar>
  );
}
