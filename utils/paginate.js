export function itemsCrop(items, pageNumber, pageSize) {
    const startIndex = (pageNumber - 1) * pageSize;
    return [...items].splice(startIndex, pageSize);
}

export function pagesArray(count) {
    return Array.from({ length: count }, (_, index) => index + 1);
}
