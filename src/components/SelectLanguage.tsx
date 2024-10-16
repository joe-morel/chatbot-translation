import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

interface SelectLanguageProps {
  languages: { name: string; language: string }[];
  onLanguageChange: (language: string) => void;
}

const SelectLanguage: React.FC<SelectLanguageProps> = ({
  languages,
  onLanguageChange,
}) => {
  return (
    <fieldset className="grid gap-6 rounded-lg border p-4">
      <legend className="-ml-1 px-1 text-sm font-medium">
        Language to Translate
      </legend>
      <Select onValueChange={onLanguageChange}>
        <SelectTrigger className="w-[180px]">
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
  );
};

export default SelectLanguage;
