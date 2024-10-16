"use server";

export async function translateMessageAction(
    message: string,
    selectedLanguage: string
  ) {
    try {
      const response = await fetch(
        `https://translation.googleapis.com/language/translate/v2?key=${process.env.NEXT_PUBLIC_GOOGLE_TRANSLATE_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ q: message, target: selectedLanguage }),
        }
      );
  
      if (!response.ok) {
        throw new Error("Error in translation");
      }
  
      const data = await response.json();
      return data.data.translations[0].translatedText;
    } catch (error) {
      console.error("Translation error: ", error);
      throw new Error("Failed to translate message");
    }
  }
  