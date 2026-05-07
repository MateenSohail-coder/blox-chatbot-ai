"use client";
import { UseAuth } from "@/context/AuthContext";
import axios from "axios";
import { History } from "lucide-react";
import { ArrowRightCircle } from "lucide-react";
import { MessageSquareCode } from "lucide-react";
import { MenuIcon } from "lucide-react";
import { LogOut } from "lucide-react";
import { X } from "lucide-react";
import { PlusCircle } from "lucide-react";
import { ArrowLeftCircle } from "lucide-react";
import { Settings2 } from "lucide-react";
import Link from "next/link";
import { redirect, usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";

const Sidebar = ({ className }) => {
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const { user, GetConversations, conversation, logout, userloader, trigger } =
    UseAuth();
  const topRef = useRef(null);
  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation.length, isOpen]);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  useEffect(() => {
    if (user && user.userId) {
      GetConversations(user.userId);
    }
  }, [user.userId, trigger]);

  async function NewChat() {
    redirect("/dashboard/Chats");
  }
  const navigationItems = [
    {
      id: 2,
      name: "Settings",
      icon: <Settings2 size={25} />,
      path: "/dashboard/settings",
    },
    {
      id: 4,
      name: "History",
      icon: <History size={25} />,
      path: "/dashboard/history",
    },
  ];

  return (
    <div className={className}>
      <button
        aria-label="Toggle Menu"
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-amber-800 rounded-lg shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <X size={25} color="#FDE68A" />
        ) : (
          <MenuIcon size={25} color="#FDE68A" />
        )}
      </button>

      <div
        className={`fixed inset-0 bg-black bg-opacity-10 transition-opacity md:hidden ${
          isOpen ? "opacity-60 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setIsOpen(false)}
      />

      <aside
        className={`fixed md:relative top-0 left-0 h-screen bg-amber-950 dark:bg-amber-950 shadow-xl transition-all duration-300 ease-in-out z-40 ${
          isOpen
            ? "w-64 translate-x-0"
            : "w-64 -translate-x-full md:w-20 md:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-amber-200 ">
            <div className="flex flex-col items-center justify-center h-12">
              <MessageSquareCode size={30} color="#FDE68A" />
              <span className="font-mono text-amber-200 text-xs">Blox</span>
            </div>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="hidden md:flex absolute z-[1000] -right-3 top-5 bg-amber-200 rounded-full p-1.5 border-amber-950  cursor-pointer shadow-lg"
            aria-label="Toggle Sidebar"
          >
            {
              isOpen ? (
                <ArrowLeftCircle size={16} color="#451a03" />
              ) : (
                //   <FiChevronLeft size={16} />

                <ArrowRightCircle size={16} color="#451a03" />
              )
              //   <FiChevronRight size={16} />
            }
          </button>

          <nav className="flex-1  overflow-hidden py-4">
            <ul className="space-y-2  px-0">
              <li className="px-2 mb-10 border-b-1 pb-5 border-b-amber-200">
                <button
                  onClick={() => NewChat()}
                  className="w-full flex items-center justify-center text-2xl font-mono px-3 py-2 rounded-sm bg-amber-200 text-amber-950 font-bold hover:opacity-90 cursor-pointer text-amber-200  hover:bg-amber-800"
                >
                  <span className="text-xl">
                    <PlusCircle size={25} color="#451a03" />{" "}
                  </span>
                  <span
                    className={`ml-3 transition-all duration-600 ${!isOpen && "md:hidden"}`}
                  >
                    Create new
                  </span>
                </button>
              </li>
              {navigationItems.map((item) => (
                <li key={item.id}>
                  <Link href={item.path}>
                    <button
                      className={`w-full flex ${!isOpen && "justify-center"} items-center cursor-pointer text-2xl font-mono px-3 py-2 rounded-0 transition-colors duration-200 ${
                        pathname === item.path
                          ? "bg-amber-200 text-amber-950"
                          : "hover:opacity-70 text-amber-200  hover:bg-amber-800"
                      }`}
                    >
                      <span className="text-xl">{item.icon}</span>
                      <span
                        className={`ml-3 transition-all duration-150 ${!isOpen && "md:hidden"}`}
                      >
                        {item.name}
                      </span>
                    </button>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          {isOpen && (
            <div
              ref={topRef}
              className="space-y-2 mt-5 border-t-1 h-[35%] flex flex-col  border-t-amber-200 pt-5 overflow-y-auto"
            >
              {conversation.map((item, index) => (
                <Link href={`/dashboard/Chats/${item._id}`} key={index}>
                  <div />
                  <div className="hover:bg-amber-900 max-w-full cursor-pointer transition-all duration-150 rounded-sm px-2 py-1">
                    <p
                      className={`text-sm font-mono truncate rounded-sm  text-amber-200 font-bold px-2 py-1 ${pathname === `/dashboard/Chats/${item._id}` && "bg-amber-200 text-amber-950"}`}
                    >
                      {item.title}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className=" flex flex-col gap-5 py-4">
            <div
              onClick={() => logout()}
              className="z-[100] bg-red-800 hover:opacity-100 flex items-center gap-5 justify-center font-mono opacity-50 px-5 text-2xl text-amber-50 cursor-pointer mt-1 py-2 border-t-2 border-b-2 border-red-800"
            >
              {isOpen ? (
                <>
                  <p className="">logout</p> <LogOut size={25} />
                </>
              ) : (
                <LogOut size={25} />
              )}
            </div>
            <Link
              href="/dashboard/settings"
              className="flex items-center space-x-3 px-5"
            >
              <div className="h-8 w-8 font-mono text-2xl bg-amber-200 rounded-full flex items-center justify-center">
                {(!userloader && user?.username?.slice(0, 1)?.toUpperCase()) ||
                  "?"}
              </div>
              <div className={`${!isOpen && "md:hidden"}`}>
                <p className="text-xs font-bold font-mono text-amber-200">
                  {!userloader && user?.username}
                </p>
              </div>
            </Link>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default Sidebar;
