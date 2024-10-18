import { fetchLanguages } from "@/lib/google-language-list";
import ChatCard from "@/components/ChatCard";
import * as React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { createClient } from "@/utils/supabase/server";

export default async function Home() {
  const supabase = createClient();
  const { data: user } = await supabase.auth.getUser();
  const { data: messages } = await supabase
    .from("messages")
    .select("*")
    .eq("user_id", user?.user?.id);
  const responseLangs = await fetchLanguages();
  const preferredLangs = ["es", "en"];
  const languages = responseLangs.sort((a) => {
    if (preferredLangs.includes(a.language)) {
      return -1;
    }
    return 1;
  });
  const initialMessages =
    messages?.map((message) => ({
      role: message.role,
      message: message.message,
    })) || [];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-10 bg-gray-50 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-2 w-full max-w-3xl items-center">
        <CardContent>
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight text-center mt-10 lg:text-5xl">
            Chatbot Translation App
          </h1>
          <p className="scroll-m-20  tracking-tight text-center mt-10 " >
            This is a chatbot translation app. You can chat with the chatbot in
            any language and it will translate the messages to the language you
            select. <strong>Login to save your chat history.</strong>
          </p>
        </CardContent>
        <ChatCard
          languages={languages}
          user={user?.user}
          initialMessages={initialMessages}
        />
        <span className="text-sm text-muted-foreground">by Joe Morel</span>
      </main>
    </div>
  );
}
