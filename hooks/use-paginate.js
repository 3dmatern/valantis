"use client";

import { useEffect, useState } from "react";

import { itemsCrop } from "@/utils/paginate";

export function usePaginate(items) {
    const pageSize = 50;
    const [
        { currentPage, itemsCount, pageCount, currentItems },
        setPaginateData,
    ] = useState({
        currentPage: 1,
        itemsCount: 0,
        pageCount: 0,
        currentItems: [],
    });

    const handkeChangePage = (selectPage) => {
        setPaginateData((prev) => ({
            ...prev,
            currentPage: selectPage,
            currentItems: itemsCrop(items, selectPage, pageSize),
        }));
    };

    const handleClickPrevPage = () => {
        if (currentPage === 1 || pageCount === 0) {
            return;
        }

        const selectPage = currentPage - 1;

        setPaginateData((prev) => ({
            ...prev,
            currentPage: selectPage,
            currentItems: itemsCrop(items, selectPage, pageSize),
        }));
    };

    const handleClickNextPage = () => {
        if (currentPage === pageCount || pageCount === 0) {
            return;
        }

        const selectPage = currentPage + 1;
        setPaginateData((prev) => ({
            ...prev,
            currentPage: selectPage,
            currentItems: itemsCrop(items, selectPage, pageSize),
        }));
    };

    useEffect(() => {
        if (items?.length > 0) {
            const pageCount = Math.ceil(items.length / pageSize);

            setPaginateData((prev) => ({
                ...prev,
                itemsCount: items.length,
                pageCount,
                currentItems: itemsCrop(items, prev.currentPage, pageSize),
            }));
        }
    }, [items]);

    return {
        pageSize,
        itemsCount,
        currentPage,
        currentItems,
        pageCount,
        onChangePage: handkeChangePage,
        onClickPrevPage: handleClickPrevPage,
        onClickNextPage: handleClickNextPage,
    };
}
