"use client";

import * as React from "react";
import { useEffect, useRef } from "react";
import { Send, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { useToast } from "../hooks/use-toast";
import { ToastAction } from "../components/ui/toast";
import { translateMessageAction } from "@/app/actions/translateMessage-action";
import LanguageSelector from "@/components/LanguageSelector";
import { Language } from "@/types/types";
import Link from "next/link";
import { User } from "@supabase/auth-js";
import { createClient } from "@/utils/supabase/client";


interface Props {
  languages: Language[];
  user?: User | null;
  initialMessages?: { role: "agent" | "user"; message: string }[];
}

export default function ChatCard({ languages, user, initialMessages }: Props) {
  const [selectedLanguage, setSelectedLanguage] = React.useState("");
  const [messages, setMessages] = React.useState(user?.email && initialMessages?.length ? initialMessages : [
    {
      role: "agent",
      message: "Hello, write me something and I will help you to translate it.",
    },
  ]);
  const [input, setInput] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const inputLength = input.trim().length;
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const signOut = async () => {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error logging out:", error.message);
      return;
    }

    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "agent", message: "You have been successfully logged out. Refreshing in two seconds..." },
    ]);

    setTimeout(() => {
      window.location.reload();
    }, 2000);
  };

  const handleSendMessage = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedLanguage) {
      toast({
        variant: "destructive",
        title: "Language not selected",
        description: "Please select a language before sending a message.",
      });
      return;
    }

    if (inputLength === 0) return;

    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", message: input },
    ]);

    setLoading(true);
    try {
      const translatedMessage = await translateMessageAction(input, selectedLanguage); // Llama a la acción del servidor

      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "agent", message: translatedMessage },
      ]);
    } catch (error) {
      console.error("Error translating the message:", error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description:
          "There was a problem with your request. Please check your connection.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    } finally {
      setLoading(false);
    }

    setInput("");
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-4">
        <LanguageSelector
          languages={languages}
          onLanguageChange={setSelectedLanguage}
        />
        <div className="flex items-center space-x-4">
          {user?.email ? (
            <>
              <div className="text-right max-md:hidden">
                <p className="text-sm font-medium leading-none">User</p>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
              <Avatar className="group">
                {/* Signout icon */}
                <Button onClick={signOut} className="hidden group-hover:block" asChild>
                  <Send />
                </Button>
                <AvatarFallback className="uppercase group-hover:hidden">
                  {user?.email?.slice(0, 2)}
                </AvatarFallback>
              </Avatar>
            </>
          ) : (
            <Button variant="outline" size="sm" asChild>
              <Link href="/login">
                Login
              </Link>
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col h-full min-h-56 max-h-96 overflow-y-auto py-4 sm:p-4" ref={scrollRef}>
          <div className="flex-1 flex flex-col space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  "flex w-fit max-w-[80%] sm:max-w-[60%] flex-col gap-2 rounded-lg px-3 py-2 text-sm",
                  message.role === "user"
                    ? "ml-auto bg-primary text-primary-foreground"
                    : "bg-muted",
                )}
              >
                {message.message}
              </div>
            ))}
            {loading && (
              <div className="flex items-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <span>Translating...</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <form
          onSubmit={handleSendMessage}
          className="flex w-full items-center space-x-2"
        >
          <Input
            id="message"
            placeholder="Type your message..."
            className="flex-1"
            autoComplete="off"
            value={input}
            onChange={(event) => setInput(event.target.value)}
          />
          <Button
            type="submit"
            size="icon"
            disabled={inputLength === 0 || loading}
          >
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
