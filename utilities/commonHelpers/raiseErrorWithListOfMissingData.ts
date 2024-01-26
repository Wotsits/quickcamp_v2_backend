export const raiseConsoleErrorWithListOfMissingData = (requiredData: {[key: string]: any}): void => {
    for (let key in requiredData) {
        if (!requiredData[key]) {
            console.error(`The ${key} is missing from the request`);
        }
    }
}