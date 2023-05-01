export class BibleExceptions extends Error {
    public statusCode: number;
    
    constructor(statusCode: number, message: string) {
        super(message);
        this.statusCode = statusCode;
        this.name = 'BibleExceptions';
    }
    
    override toString() {
        return `${this.statusCode}: ${this.message}`;
    }
}