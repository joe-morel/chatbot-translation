import {Language} from "@/types/types";

export async function fetchLanguages() {
  try {
    const response = await fetch(
      `https://translation.googleapis.com/language/translate/v2/languages?key=${process.env.NEXT_PUBLIC_GOOGLE_TRANSLATE_API_KEY}&target=en`
    );

    if (!response.ok) {
      throw new Error("Error fetching languages");
    }

    const data = await response.json();
    return data.data.languages as Language[];
  } catch (error) {
    console.error("Error fetching languages:", error);
    return [];
  }
}
