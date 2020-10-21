export class ApiHttpError extends Error {
    constructor(public response: Response) {
        super("Api http error");
    }
}