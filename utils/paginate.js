export function paginate(items, pageNumber, pageSize) {
    const startIndex = (pageNumber - 1) * pageSize;
    return [...items].splice(startIndex, pageSize);
}

export function pagesArray(count) {
    const resultArray = Array.from({ length: count }, (_, index) => index + 1);
    return resultArray;
}
