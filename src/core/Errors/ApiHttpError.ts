export class ApiHttpError extends Error {
    constructor(public response: Response, public code?: string) {
        super("Api http error");

        // Set the prototype explicitly.
        Object.setPrototypeOf(this, ApiHttpError.prototype);
    }
}