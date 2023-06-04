import { countDaysBetweenDates, dateCompare } from "../utils/date.utils";
import { expect, describe, it } from "@jest/globals";

describe("countDaysBetweenDates", () => {
    it("should return the correct number of days between two dates", () => {
        const startDate = "2023-05-01";
        const endDate = "2023-05-05";

        const result = countDaysBetweenDates(startDate, endDate);

        expect(result).toBe(4);
    });
});

describe("dateCompare", () => {
    it("should return 1 when the first date is later than the second date", () => {
        const date1 = "2023-05-10";
        const date2 = "2023-05-05";

        const result = dateCompare(date1, date2);

        expect(result).toBe(1);
    });

    it("should return -1 when the first date is earlier than the second date", () => {
        const date1 = "2023-05-01";
        const date2 = "2023-05-05";

        const result = dateCompare(date1, date2);

        expect(result).toBe(-1);
    });

    it("should return 0 when both dates are equal", () => {
        const date1 = "2023-05-01";
        const date2 = "2023-05-01";

        const result = dateCompare(date1, date2);

        expect(result).toBe(0);
    });
});
