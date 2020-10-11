export class TranslationData {
    constructor(
        public sourceFullPath: string,
        public translations: { [key: string]: string }) {
    }
}
