export const sanitizeNullObject = (param: object): object => {
    return Object.fromEntries(
        Object.entries(param).filter(([ , value ]) => value),
    );
};