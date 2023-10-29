export const raiseConsoleErrorWithListOfMissingData = (requiredData: any[]): void => {
    if (!requiredData[0]) {
        console.error("The siteId is missing from the request");
    }
    if (!requiredData[1]) {
        console.error("The equipmentTypeId is missing from the request");
    }
    if (!requiredData[2]) {
        console.error("The unitId is missing from the request");
    }
    if (!requiredData[3]) {
        console.error("The startDate is missing from the request");
    }
    if (!requiredData[4]) {
        console.error("The endDate is missing from the request");
    }
    if (!requiredData[5]) {
        console.error("The extras is missing from the request");
    }
    if (!requiredData[6]) {
        console.error("The bookingGuests is missing from the request");
    }
    if (!requiredData[7]) {
        console.error("The bookingPets is missing from the request");
    }
    if (!requiredData[8]) {
        console.error("The bookingVehicles is missing from the request");
    }
    if (!requiredData[9]) {
        console.error("The paymentAmount is missing from the request");
    }
    if (!requiredData[10]) {
        console.error("The paymentMethod is missing from the request");
    }
    if (!requiredData[11]) {
        console.error("The paymentDate is missing from the request");
    }
};