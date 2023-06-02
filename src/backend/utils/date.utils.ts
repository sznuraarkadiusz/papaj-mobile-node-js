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
    const diffInDays = Math.round(
        Math.abs((start.getTime() - end.getTime()) / oneDay),
    );

    return diffInDays;
};
