export const dateFormats = {
    default: "DD-MM-YYYY",
};

export const countDaysBetweenDates = (
    startDate: string,
    endDate: string,
): number => {
    const oneDay = 24 * 60 * 60 * 1000; // Liczba milisekund w jednym dniu

    // Konwertuj daty na obiekty typu Date
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Oblicz różnicę w dniach
    return Math.round(Math.abs((start.getTime() - end.getTime()) / oneDay));
};

export const dateCompare = (date1: string, date2: string): number => {
    const date1Obj = new Date(date1);
    const date2Obj = new Date(date2);

    if (date1Obj > date2Obj) {
        console.log("First date is later than second date");
        return 1;
    } else if (date1Obj < date2Obj) {
        console.log("First date is earlier than second date");
        return -1;
    } else {
        console.log("Both dates are equal");
        return 0;
    }
};
