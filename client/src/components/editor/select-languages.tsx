import * as React from "react";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { languageOptions } from "@/utils/config";

export type selectedLanguageOptionProps = {
    language: string;
    version: string;
    aliases: string[];
    runtime?: string;
};

interface SelectLanguagesProps {
    onSelect: (value: selectedLanguageOptionProps) => void;
    selectedLanguageOption: selectedLanguageOptionProps;
}

export const SelectLanguages: React.FC<SelectLanguagesProps> = ({
    onSelect,
    selectedLanguageOption,
}) => {
    const handleValueChange = (value: string) => {
        const selectedLanguage = languageOptions.find(option => option.language === value);
        if (selectedLanguage) onSelect(selectedLanguage);
    };

    return (
        <Select onValueChange={handleValueChange} value={selectedLanguageOption.language}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a language" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Languages</SelectLabel>
                    {languageOptions.map(option => (
                        <SelectItem key={option.language} value={option.language}>
                            {option.language}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
};
