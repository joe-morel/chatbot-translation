"use server";

import { createClient } from "@/utils/supabase/server";

export async function translateMessageAction(
  message: string,
  selectedLanguage: string,
) {
  try {
    const supabase = createClient();
    const { data: user } = await supabase.auth.getUser();


    const response = await fetch(
      `https://translation.googleapis.com/language/translate/v2?key=${process.env.NEXT_PUBLIC_GOOGLE_TRANSLATE_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ q: message, target: selectedLanguage }),
      },
    );

    if (!response.ok) {
      throw new Error("Error in translation");
    }

    const data = await response.json();
    const translatedText = data.data.translations[0].translatedText;

    // Saving message to database
    if (user.user?.id) {
      await supabase.from("messages").insert([
        {
          user_id: user.user.id,
          message: message,
          role: "user",
        },
        {
          user_id: user.user.id,
          message: translatedText,
          role: "agent",
        },
      ]);
    }
    return translatedText;
  } catch (error) {
    console.error("Translation error: ", error);
    throw new Error("Failed to translate message");
  }
}
  