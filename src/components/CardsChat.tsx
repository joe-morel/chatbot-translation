"use client";

import * as React from "react";
import { useEffect, useRef } from "react";
import { Check, Plus, Send, Loader2 } from "lucide-react"; // Asegúrate de importar Loader2
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

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../components/ui/tooltip";

// const TARGET_LANGUAGE = "en";

const languages = [
  { name: 'English', language: 'en' },
  { name: 'Spanish', language: 'es' },
  { name: 'French', language: 'fr' },
  { name: 'German', language: 'de' },
  { name: 'Italian', language: 'it' },
  { name: 'Portuguese', language: 'pt' },
  { name: 'Russian', language: 'ru' },
  { name: 'Chinese', language: 'zh' },
  { name: 'Japanese', language: 'ja' },
  { name: 'Arabic', language: 'ar' },
  { name: 'Korean', language: 'ko' },
  { name: 'Hindi', language: 'hi' },
  { name: 'Turkish', language: 'tr' },
  { name: 'Dutch', language: 'nl' },
  { name: 'Swedish', language: 'sv' },
  { name: 'Danish', language: 'da' },
  { name: 'Norwegian', language: 'no' },
  { name: 'Finnish', language: 'fi' },
  { name: 'Czech', language: 'cs' },
  { name: 'Greek', language: 'el' },
];

const users = [
  {
    name: "Olivia Martin",
    email: "m@example.com",
    avatar: "/avatars/01.png",
  },
  {
    name: "Isabella Nguyen",
    email: "isabella.nguyen@email.com",
    avatar: "/avatars/03.png",
  },
  {
    name: "Emma Wilson",
    email: "emma@example.com",
    avatar: "/avatars/05.png",
  },
  {
    name: "Jackson Lee",
    email: "lee@example.com",
    avatar: "/avatars/02.png",
  },
  {
    name: "William Kim",
    email: "will@email.com",
    avatar: "/avatars/04.png",
  },
] as const;

type User = (typeof users)[number];

export default function CardsChat() {
  const [open, setOpen] = React.useState(false);
  const [selectedUsers, setSelectedUsers] = React.useState<User[]>([]);
  const [messages, setMessages] = React.useState([
    {
      role: "agent",
      content: "Hello, write me something and I will help you to translate it.",
    },
  ]);
  const [input, setInput] = React.useState("");
  const [loading, setLoading] = React.useState(false); // Estado de loading
  const [selectedLanguage, setSelectedLanguage] = React.useState("en"); // Estado para el idioma seleccionado
  //const [languages, setLanguages] = React.useState([]); //Para el fetch de listado de idiomas
  const inputLength = input.trim().length;
  const scrollRef = useRef<HTMLDivElement>(null);

  //  para el fetch de litado de idiomas
  // useEffect(() => {
  //   const getLanguages = async () => {
  //     const langData = await fetchLanguages();
  //     setLanguages(langData);
  //   };

  //   getLanguages();
  // }, []);

  useEffect(() => {
    if (scrollRef.current) {
      // Ajustar el scroll al final
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

// funcion para traducir idioma sin selector  

  // const translateMessage = async (message: string) => {
  //   setLoading(true); // Iniciar loading
  //   try {
  //     // Simular un tiempo de espera mínimo (por ejemplo, 500 ms)
  //     await new Promise((resolve) => setTimeout(resolve, 200));
  //     const response = await fetch(
  //       `https://translation.googleapis.com/language/translate/v2?key=AIzaSyBTGnW1qen-dW1x8q332rrLjKeF5nB57Js`,
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({
  //           q: message,
  //           target: TARGET_LANGUAGE,
  //         }),
  //       }
  //     );

  //     if (!response.ok) {
  //       throw new Error("Error en la traducción");
  //     }

  //     const data = await response.json();
  //     return data.data.translations[0].translatedText;
  //   } catch (error) {
  //     console.error("Error traduciendo el mensaje:", error);
  //     return message; // Si hay un error, devuelve el mensaje original
  //   } finally {
  //     setLoading(false); // Detener loading
  //   }
  // };


//para traducir con selector
  const translateMessage = async (message: string) => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 200));
      const response = await fetch(
        `https://translation.googleapis.com/language/translate/v2?key=AIzaSyBTGnW1qen-dW1x8q332rrLjKeF5nB57Js`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            q: message,
            target: selectedLanguage, // Usar el idioma seleccionado
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Error en la traducción");
      }

      const data = await response.json();
      return data.data.translations[0].translatedText;
    } catch (error) {
      console.error("Error traduciendo el mensaje:", error);
      return message;
    } finally {
      setLoading(false);
    }
  };


  // funcion para buscar mensaje en google api 
  // funciona  pero los idiomas se muestran transparentes 
  // const fetchLanguages = async () => {
  //   try {
  //     const response = await fetch(
  //       `https://translation.googleapis.com/language/translate/v2/languages?key=AIzaSyBTGnW1qen-dW1x8q332rrLjKeF5nB57Js`
  //     );
  
  //     if (!response.ok) {
  //       throw new Error("Error fetching languages");
  //     }
  
  //     const data = await response.json();
  //     return data.data.languages; // Devuelve la lista de idiomas
  //   } catch (error) {
  //     console.error("Error fetching languages:", error);
  //     return [];
  //   }
  // };
  

  const handleSendMessage = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (inputLength === 0) return;

    // Agregar el mensaje original del usuario al estado de mensajes
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        role: "user",
        content: input,
      },
    ]);

    // Traducir el mensaje
    const translatedMessage = await translateMessage(input);

    // Agregar la traducción como un nuevo mensaje del agente
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
          <legend className="-ml-1 px-1 text-sm font-medium">Language to Trasnlate</legend>
          <Select onValueChange={setSelectedLanguage}>
            <SelectTrigger className="w-[180px] ">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
             <SelectContent>
                {/* <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Spanish</SelectItem>
                <SelectItem value="fr">French</SelectItem>
                <SelectItem value="de">German</SelectItem> */}
                {languages.map((language) => (
                <SelectItem
        key={language.language}
        value={language.language}
        className="text-black opacity-100"
      >
        {language.name}
      </SelectItem>
       ))}
              </SelectContent> 

      {/* <SelectContent>
              {languages.map((language) => (
                <SelectItem key={language.language} value={language.language}  className="text-black opacity-100">
                  {language.name} {/* Aquí usamos language.name 
                </SelectItem>
              ))}
            </SelectContent> */}
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
                <p className="text-sm font-medium leading-none">Chatbot Agent</p>
                <p className="text-sm text-muted-foreground">support@example.com</p>
              </div>
            </div>
            {/* <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="outline"
                    className="ml-auto rounded-full"
                    onClick={() => setOpen(true)}
                  >
                    <Plus className="h-4 w-4" />
                    <span className="sr-only">New message</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent sideOffset={10}>New message</TooltipContent>
              </Tooltip>
            </TooltipProvider> */}
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
                {loading && ( // Mostrar el spinner si loading es true
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
        {/* <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="gap-0 p-0 outline-none">
            <DialogHeader className="px-4 pb-4 pt-5">
              <DialogTitle>New message</DialogTitle>
              <DialogDescription>
                Invite a user to this thread. This will create a new group
                message.
              </DialogDescription>
            </DialogHeader>
            <Command className="overflow-hidden rounded-t-none border-t">
              <CommandInput placeholder="Search user..." />
              <CommandList>
                <CommandEmpty>No users found.</CommandEmpty>
                <CommandGroup className="p-2">
                  {users.map((user) => (
                    <CommandItem
                      key={user.email}
                      className="flex items-center px-2"
                      onSelect={() => {
                        if (selectedUsers.includes(user)) {
                          return setSelectedUsers(
                            selectedUsers.filter(
                              (selectedUser) => selectedUser !== user
                            )
                          );
                        }

                        return setSelectedUsers(
                          [...users].filter((u) =>
                            [...selectedUsers, user].includes(u)
                          )
                        );
                      }}
                    >
                      <Avatar>
                        <AvatarImage src={user.avatar} alt="Image" />
                        <AvatarFallback>{user.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="ml-2">
                        <p className="text-sm font-medium leading-none">
                          {user.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                      {selectedUsers.includes(user) ? (
                        <Check className="ml-auto flex h-5 w-5 text-primary" />
                      ) : null}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
            <DialogFooter className="flex items-center border-t p-4 sm:justify-between">
              {selectedUsers.length > 0 ? (
                <div className="flex -space-x-2 overflow-hidden">
                  {selectedUsers.map((user) => (
                    <Avatar
                      key={user.email}
                      className="inline-block border-2 border-background"
                    >
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>{user.name[0]}</AvatarFallback>
                    </Avatar>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Select users to add to this thread.
                </p>
              )}
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setOpen(false)}>Create</Button>
              </DialogFooter>
            </DialogFooter>
          </DialogContent>
        </Dialog> */}
      </div>
    </>
  );
}
