"use client";

import { useEffect, useState } from "react";

import { pagesArray, paginate } from "@/utils/paginate";

export function usePaginate(items) {
    const pageSize = 50;
    const [
        { currentPage, itemsCount, pageCount, pages, itemsCrop },
        setPaginateData,
    ] = useState({
        currentPage: 1,
        itemsCount: 0,
        pageCount: 0,
        pages: [],
        itemsCrop: [],
    });

    const handkeChangePage = (selectPage) => {
        setPaginateData((prev) => ({
            ...prev,
            currentPage: selectPage,
        }));
    };

    const handleClickPrevPage = () => {
        if (currentPage === 1 || pageCount(itemsCount, pageSize) === 0) {
            return;
        }

        const selectPage = currentPage - 1;

        setPaginateData((prev) => ({
            ...prev,
            currentPage: selectPage,
        }));
    };

    const handleClickNextPage = () => {
        if (
            currentPage === pageCount(itemsCount, pageSize) ||
            pageCount(itemsCount, pageSize) === 0
        ) {
            return;
        }

        const selectPage = currentPage + 1;
        setPaginateData((prev) => ({
            ...prev,
            currentPage: selectPage,
        }));
    };

    useEffect(() => {
        if (items?.length > 0) {
            const pageCount = Math.ceil(items.length / pageSize);
            const pages = pagesArray(pageCount);
            setPaginateData((prev) => ({
                ...prev,
                itemsCount: items.length,
                pageCount,
                pages: pages,
                itemsCrop: paginate(items, prev.currentPage, pageSize),
            }));
        }
    }, [items]);

    return {
        pageSize,
        itemsCount,
        currentPage,
        itemsCrop,
        pageCount,
        pages,
        onChangePage: handkeChangePage,
        onClickPrevPage: handleClickPrevPage,
        onClickNextPage: handleClickNextPage,
    };
}
