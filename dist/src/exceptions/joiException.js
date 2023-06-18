"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JoiExceptions = void 0;
const clientException_1 = require("./clientException");
class JoiExceptions extends Error {
    constructor(detailError) {
        super('Joi validation error');
        this.name = 'JoiExceptions';
        this.detailError = detailError;
    }
    getDetailError() {
        if (this.detailError instanceof clientException_1.BadRequestExceptions) {
            const message = this.detailError.message;
            const splitted = message.split(/[()]/).filter((e) => e !== '');
            return {
                [splitted[1].toLowerCase()]: splitted[0].trim(),
            };
        }
        const error = {};
        this.detailError.details.forEach((e) => {
            var _a;
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
                [(_a = e.context) === null || _a === void 0 ? void 0 : _a.key]: e.message.replace(/['"]/g, ''),
            });
        });
        return error;
    }
}
exports.JoiExceptions = JoiExceptions;
