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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

import { Input } from "../components/ui/input";
import { useToast } from "../hooks/use-toast"; // <--- useToast
import { ToastAction } from "../components/ui/toast"; // <---  ToastAction

export default function CardsChat() {
  const [messages, setMessages] = React.useState([
    {
      role: "agent",
      content: "Hello, write me something and I will help you to translate it.",
    },
  ]); // First message from the agent by default
  const [input, setInput] = React.useState("");
  const [loading, setLoading] = React.useState(false); // State for loadin
  const [selectedLanguage, setSelectedLanguage] = React.useState(""); // State for the language selected
  const [languages, setLanguages] = React.useState<
    { name: string; language: string }[]
  >([]);
  const inputLength = input.trim().length;
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast(); // <--- Use of the hook toast

  // Fetch for list of languages
  useEffect(() => {
    const getLanguages = async () => {
      const langData = await fetchLanguages();
      setLanguages(langData);
    };

    getLanguages();
  }, []);

  // Setting the scroll to the end
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);
  
  // Traslate with the selector
  const translateMessage = async (message: string) => {
    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 200));
      const response = await fetch(
        `https://translation.googleapis.com/language/translate/v2?key=${process.env.NEXT_PUBLIC_GOOGLE_TRANSLATE_API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            q: message,
            target: selectedLanguage, // Use the selected language
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Error in translation");
      }

      const data = await response.json();
      return data.data.translations[0].translatedText;
    } catch (error) {
      console.error("Error translating the message:", error);

      // toast for error message
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description:
          "There was a problem with your request. Please check your connection.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });

      return message;
    } finally {
      setLoading(false);
    }
  };

  // Function to search message in google api
  // Adding &target="en" to the final api for show on list of languages on the list in english
  const fetchLanguages = async () => {
    try {
      const response = await fetch(
        `https://translation.googleapis.com/language/translate/v2/languages?key=${process.env.NEXT_PUBLIC_GOOGLE_TRANSLATE_API_KEY}&target=en`
      );

      if (!response.ok) {
        throw new Error("Error fetching languages");
      }

      const data = await response.json();
      return data.data.languages; // Returns the list of languages
    } catch (error) {
      console.error("Error fetching languages:", error);
      return [];
    }
  };

  //Handle Error for send message
  //Supports the fact that the language is first selecting
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
      {
        role: "user",
        content: input,
      },
    ]);

    // Traslate the message
    const translatedMessage = await translateMessage(input);

    // Add the translation as a new agent message
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        role: "agent",
        content: translatedMessage,
      },
    ]);

    setInput("");
  };

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-2s">
        <div className="w-full max-w-xs mx-auto">
          <fieldset className="grid gap-6 rounded-lg border p-4">
            <legend className="-ml-1 px-1 text-sm font-medium">
              Language to Trasnlate
            </legend>
            <Select onValueChange={setSelectedLanguage}>
              <SelectTrigger className="w-[180px] ">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {languages.map((language) => (
                  <SelectItem key={language.language} value={language.language}>
                    {language.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </fieldset>
        </div>
        <Card className="w-full max-w-xs mx-auto">
          <CardHeader className="flex flex-row items-center">
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src="/avatars/01.png" alt="Image" />
                <AvatarFallback>OM</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium leading-none">
                  Chatbot Agent
                </p>
                <p className="text-sm text-muted-foreground">
                  support@example.com
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div
              className="flex flex-col h-80 overflow-y-auto p-4"
              ref={scrollRef}
            >
              <div className="flex-1 flex flex-col space-y-4 ">
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
                {loading && ( // Show spinner if loading is true
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
      </div>
    </>
  );
}
