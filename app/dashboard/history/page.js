"use client";

import React, { useEffect, useState } from "react";
import { UseAuth } from "@/context/AuthContext";
import axios from "axios";
import Link from "next/link";
import { toast } from "sonner";
import { 
  Search, 
  Trash2, 
  MessageSquare, 
  MoreVertical, 
  Pencil, 
  Loader2, 
  Calendar 
} from "lucide-react";

// Shadcn UI Component Imports
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { Edit2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function ChatHistoryPage() {
  const {
    GetConversations,
    conversation = [],
    user,
    conversationLoader,
    DeleteConversation,
    UpdateConversation,
    settrigger2,
  } = UseAuth();
  
  // State variables
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const [editItem, setEditItem] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const [isSavingTitle, setIsSavingTitle] = useState(false);

  useEffect(() => {
    if (user?.userId) {
      GetConversations(user.userId);
    }
  }, [user?.userId]);

  // Handle Delete Operation
  async function handleDelete() {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
     const res= DeleteConversation(deleteId);
        toast.success(res);
        settrigger2(pre=>pre+1);
      if (user?.userId) GetConversations(user.userId);
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete conversation");
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  }

  // Handle Rename/Edit Operation
  async function handleRename() {
    if (!editItem || !newTitle.trim()) return;
    setIsSavingTitle(true);
    try {
       const res= await UpdateConversation(editItem.id,newTitle.trim());
        toast.success(res);
        settrigger2(pre=>pre+1);
      if (user?.userId) GetConversations(user.userId);
      setEditItem(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update conversation title");
    } finally {
      setIsSavingTitle(false);
    }
  }

  // Filtered array handling client search queries matching native properties
  const filteredConversations = conversation.filter((item) =>
    item?.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full min-h-screen w-full bg-neutral-50 text-neutral-900 dark:bg-black dark:text-neutral-100 transition-colors duration-200">
      <div className="max-w-5xl mx-auto px-4 py-8 md:py-12 flex flex-col gap-6">
        {/* Header Block Container */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800/60 pb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-extralight tracking-tight font-Gasoek">
              Saved Conversations
            </h1>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 ">
              Manage and review your historical conversations with Blox.
            </p>
          </div>

          {/* Search Input Bar */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 dark:text-neutral-500" />
            <Input
              type="text"
              placeholder="Search chat history..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-full bg-white dark:bg-neutral-900/60 border-neutral-200 dark:border-neutral-800 rounded-sm focus-visible:ring-2 focus-visible:ring-blue-500/40 focus-visible:border-blue-500 text-sm h-10 transition-all"
            />
          </div>
        </div>

        {/* Content Body Layout */}
        <div className="w-full">
          {conversationLoader ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 border border-neutral-200/80 dark:border-neutral-900 bg-white dark:bg-neutral-900/40 rounded-sm"
                >
                  <div className="flex-1 min-w-0 pr-4">
                    {/* Title */}
                    <Skeleton className="h-4 w-48 mb-2" />

                    {/* Date */}
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-3 w-3 rounded-full" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>

                  {/* Menu Button */}
                  <Skeleton className="h-8 w-8 rounded-lg" />
                </div>
              ))}
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="w-full py-24 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl flex flex-col items-center justify-center text-center px-4">
              <MessageSquare className="h-10 w-10 text-neutral-300 dark:text-neutral-700 mb-3" />
              <h3 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                No chats found
              </h3>
              <p className="text-xs text-neutral-400 dark:text-neutral-500 max-w-xs mt-1">
                {searchQuery
                  ? "No logs match that specific inquiry term."
                  : "Start a conversation to view your log histories here."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-2.5">
              {filteredConversations.map((item) => (
                <div
                  key={item._id}
                  className="group flex items-center justify-between p-4 border border-neutral-200/80 dark:border-neutral-900 bg-white dark:bg-neutral-900/40 rounded-sm hover:border-neutral-300 dark:hover:border-neutral-800 transition-all shadow-sm hover:shadow-md"
                >
                  <Link
                    href={`/dashboard/Chats/${item._id}`}
                    className="flex-1 min-w-0 pr-4 block"
                  >
                    <div className="font-medium text-sm text-neutral-800 dark:text-neutral-200 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {item.title || "Untitled Conversation"}
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-neutral-400 dark:text-neutral-500 mt-1.5 ">
                      <Calendar size={12} />
                      <span>
                        {new Date(item.created_at).toLocaleDateString(
                          undefined,
                          { dateStyle: "medium" },
                        )}
                      </span>
                    </div>
                  </Link>

                  {/* Dropdown Options Trigger Menu */}
                  <div className="flex items-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-lg text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                        >
                          <MoreVertical size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-40 rounded-sm border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900"
                      >
                        <DropdownMenuItem
                          onClick={() => {
                            setEditItem({ id: item._id, title: item.title });
                            setNewTitle(item.title);
                          }}
                          className="text-xs gap-2 py-2 cursor-pointer focus:bg-neutral-100 dark:focus:bg-neutral-800"
                        >
                          <Pencil size={14} />
                          <span>Rename</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setDeleteId(item._id)}
                          className="text-xs gap-2 py-2 text-red-600 dark:text-red-400 focus:bg-red-50 dark:focus:bg-red-950/30 focus:text-red-600 cursor-pointer"
                        >
                          <Trash2 size={14} />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Shadcn Delete Confirmation Alert Dialog */}
      {/* Delete Dialog */}
      <Dialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <DialogContent className=" bg-background text-foreground border border-border rounded-sm shadow-2xl max-w-sm dark:bg-zinc-950 dark:border-neutral-800">
          <DialogHeader>
            <DialogTitle className=" text-base text-foreground">
              Delete conversation?
            </DialogTitle>
            <DialogDescription className="text-base text-muted-foreground mt-1">
              This action cannot be undone. This will permanently clear this
              conversation from our servers.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 mt-3 rounded-b-none">
            <Button
              variant="outline"
              onClick={() => setDeleteId(null)}
              className="rounded-sm border border-border text-muted-foreground hover:text-foreground text-base h-10"
            >
              Cancel
            </Button>
            <Button
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              variant="destructive"
              disabled={isDeleting}
              className="rounded-sm text-base disabled:opacity-20 h-10"
            >
              {isDeleting ? (
                <div className="flex text-sm items-center gap-1">
                  <Loader className="text-black h-20 w-20 spin-in" />{" "}
                  Deleting...{" "}
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

      {/* Rename Dialog */}
      <Dialog
        open={!!editItem}
        onOpenChange={(open) => !open && setEditItem(null)}
      >
        <DialogContent className=" bg-background text-foreground border border-border rounded-sm shadow-2xl max-w-sm dark:bg-zinc-950 dark:border-neutral-800">
          <DialogHeader>
            <DialogTitle className=" text-base text-foreground">
              Rename Title
            </DialogTitle>
          </DialogHeader>
          <Input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" &&
              !isSavingTitle &&
              newTitle.trim() &&
              handleRename()
            }
            placeholder="Enter a new conversation title..."
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
              onClick={() => setEditItem(null)}
              className="rounded-sm border border-border text-muted-foreground hover:text-foreground text-base h-10"
            >
              Cancel
            </Button>
            <Button
              onClick={handleRename}
              disabled={isSavingTitle || !newTitle.trim()}
              className="rounded-sm bg-primary disabled:bg-primary/40 disabled:cursor-not-allowed text-primary-foreground hover:bg-primary/90 font-medium text-base h-10"
            >
              {isSavingTitle ? (
                <div className="flex text-sm items-center gap-1">
                  <Loader className="text-black h-20 w-20 spin-in" />{" "}
                  Saving...{" "}
                </div>
              ) : (
                <div className="flex text-sm items-center gap-1">
                  <Edit2 size={14} className="mr-1.5" />
                  Save changes{" "}
                </div>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}