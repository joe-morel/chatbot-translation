import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {Language} from "@/types/types";

interface SelectLanguageProps {
  languages: Language[];
  onLanguageChange: (language: string) => void;
}

const LanguageSelector: React.FC<SelectLanguageProps> = ({
  languages,
  onLanguageChange,
}) => {
  return (
    <div className="flex flex-col gap-1">
      <Select onValueChange={onLanguageChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select a language" />
        </SelectTrigger>
        <SelectContent>
          {languages.map((language) => (
            <SelectItem key={language.language} value={language.language}>
              {language.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default LanguageSelector;
