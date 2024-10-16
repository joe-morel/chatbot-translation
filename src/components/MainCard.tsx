"use client";

import * as React from "react";
import { useEffect } from "react";
import { fetchLanguages } from "@/lib/google-language-list";
import SelectLanguage from "./SelectLanguage";
import ChatCard from "./ChatCard";

export default function MainCard() {
  const [selectedLanguage, setSelectedLanguage] = React.useState("");
  const [languages, setLanguages] = React.useState<
    { name: string; language: string }[]
  >([]);

  // Obtener lista de lenguajes del servidor
  useEffect(() => {
    const getLanguages = async () => {
      const langData = await fetchLanguages();
      setLanguages(langData);
    };

    getLanguages();
  }, []);

  return (
    <div className="grid gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-2">
      <div className="w-full max-w-xs mx-auto">
        <SelectLanguage
          languages={languages}
          onLanguageChange={setSelectedLanguage}
        />
      </div>
      <ChatCard selectedLanguage={selectedLanguage} languages={languages} />
    </div>
  );
}
