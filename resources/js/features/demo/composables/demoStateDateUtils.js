/** Форматирование дат для демо-состояния (инспекция, день отчёта). */

export const formatDateToRu = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
};

export const formatDateToIso = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
};

export const getTodayDateIso = () => formatDateToIso(new Date());

export const getEndOfCurrentMonthDateRu = () => {
    const now = new Date();
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return formatDateToRu(lastDayOfMonth);
};
