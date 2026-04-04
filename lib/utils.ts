import dayjs from "dayjs";

/**
 * Formats a number as U.S. currency.
 *
 * @param value    - The numeric value to format.
 * @param currency - The ISO 4217 currency code (defaults to "USD").
 * @returns A formatted currency string (e.g. "$1,234.56"), or a plain
 *          "$0.00"-style fallback if formatting fails.
 */
export function formatCurrency(value: number, currency: string = "USD"): string {
    try {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(value);
    } catch {
        // Fallback: manual "$0.00" format using USD symbol
        const fixed = Math.abs(value).toFixed(2);
        const formatted = Number(fixed).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
        return `${value < 0 ? "-" : ""}$${formatted}`;
    }
}

export const formatSubscriptionDateTime = (value?: string): string => {
    if (!value) return "Not provided";
    const parsedDate = dayjs(value);
    return parsedDate.isValid() ? parsedDate.format("MM/DD/YYYY") : "Not provided";
};

export const formatStatusLabel = (value?: string): string => {
    if (!value) return "Unknown";
    return value.charAt(0).toUpperCase() + value.slice(1);
};