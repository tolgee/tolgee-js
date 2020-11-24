export class TextHelper {
    public static splitOnNonEscapedDelimiter(string: string, delimiter: string): string[] {
        const result = [];
        let actual = "";
        for (let i = 0; i < string.length; i++) {
            const char = string[i];
            if (char === delimiter) {
                if (!this.isCharEscaped(i, string)) {
                    result.push(this.removeEscapes(actual));
                    actual = "";
                    continue;
                }
            }
            actual += string[i];
        }
        result.push(this.removeEscapes(actual));
        return result;
    }

    public static isCharEscaped(position: number, fullString: string) {
        let escapeCharsCount = 0;
        while (position > -1 && fullString[position - 1] === "\\") {
            escapeCharsCount++;
            position--;
        }
        return escapeCharsCount % 2 == 1;
    }

    public static removeEscapes(text: string) {
        return text.replace(/\\?\\?/g, (match) => {
            if (match == "\\\\") {
                return "\\";
            }
            return "";
        });
    }
}


