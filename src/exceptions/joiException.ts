import { ValidationError } from 'joi';

export class JoiExceptions extends Error {
    private detailError: ValidationError;
    constructor(detailError: ValidationError) {
        super('Joi validation error');
        this.name = 'JoiExceptions';
        this.detailError = detailError;
    }

    public getDetailError(): object {
        const error: { [ key: string ]: unknown[]; } = {};
        this.detailError.details.forEach((e) => {
            /* MULTI ERROR MESSAGES
            
            const key = e.context?.key as string;
            const value = e.message.replace(/['"]/g, '');

            if (Object.prototype.hasOwnProperty.call(error, key)) {
                error[ key ].push(value);
            } else {
                error[ key ] = [ value ];
            } 
            */
            Object.assign(error, {
                [ e.context?.key as string ]: e.message.replace(/['"]/g, ''),
            });
        });
        return error;
    }
}