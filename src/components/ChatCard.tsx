"use client";

import * as React from "react";
import { useEffect, useRef } from "react";
import { Send, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
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
import { translateMessageAction } from "@/app/actions/translateMessage-action"; // Importa la acción del servidor

export default function ChatCard({
  selectedLanguage,
}: {
  selectedLanguage: string;
  languages: { name: string; language: string }[];
}) {
  const [messages, setMessages] = React.useState([
    {
      role: "agent",
      content: "Hello, write me something and I will help you to translate it.",
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
      { role: "user", content: input },
    ]);

    setLoading(true);
    try {
      const translatedMessage = await translateMessageAction(input, selectedLanguage); // Llama a la acción del servidor

      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "agent", content: translatedMessage },
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
    <Card className="w-full max-w-xs mx-auto">
      <CardHeader className="flex flex-row items-center">
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src="/avatars/01.png" alt="Image" />
            <AvatarFallback>OM</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium leading-none">Chatbot Agent</p>
            <p className="text-sm text-muted-foreground">support@example.com</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col h-80 overflow-y-auto p-4" ref={scrollRef}>
          <div className="flex-1 flex flex-col space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  "flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm",
                  message.role === "user"
                    ? "ml-auto bg-primary text-primary-foreground"
                    : "bg-muted"
                )}
              >
                {message.content}
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
