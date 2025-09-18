

const dictionary: Record<string, string> = {
    OPERATIONAL: "OPERACIONAL",
  
};

export function translate(word: string): string {
    return dictionary[word] || word;
}