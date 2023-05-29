import { ValidationError } from 'joi';
import { BadRequestExceptions } from './clientException';

export class JoiExceptions extends Error {
    private detailError: ValidationError;
    constructor(detailError: ValidationError) {
        super('Joi validation error');
        this.name = 'JoiExceptions';
        this.detailError = detailError;
    }

    public getDetailError(): object {
        if (this.detailError instanceof BadRequestExceptions) {
            const message = this.detailError.message;
            const splitted = message.split(/[()]/).filter((e) => e !== '');

            return {
                [ splitted[ 1 ].toLowerCase() ]: splitted[ 0 ].trim(),
            };
        }

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