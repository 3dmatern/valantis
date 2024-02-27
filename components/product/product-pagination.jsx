import { cn } from "@/lib/utils";
import { pagesArray } from "@/utils/paginate";

import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

export function ProductPagination({
    className,
    currentPage,
    pageCount,
    onChangePage,
    onClickPrevPage,
    onClickNextPage,
}) {
    const pages = pagesArray(pageCount);

    const getThirdPageNumber = () => {
        if (pages.length >= 1 && pages.length <= 3) {
            return pages.map((p) => (
                <PaginationItem key={p}>
                    <PaginationLink
                        href="#"
                        onClick={() => onChangePage(p)}
                        isActive={currentPage === p}
                    >
                        {p}
                    </PaginationLink>
                </PaginationItem>
            ));
        }

        if (currentPage >= 3 && currentPage <= pages.length - 2) {
            return (
                <>
                    {pages.splice(0, 1).map((p) => (
                        <PaginationItem key={p}>
                            <PaginationLink
                                href="#"
                                onClick={() => onChangePage(p)}
                            >
                                {p}
                            </PaginationLink>
                        </PaginationItem>
                    ))}
                    <PaginationItem>
                        <PaginationEllipsis />
                    </PaginationItem>
                    {pages.splice(currentPage - 3, 1).map((p) => (
                        <PaginationItem key={p}>
                            <PaginationLink
                                href="#"
                                onClick={() => onChangePage(p)}
                            >
                                {p}
                            </PaginationLink>
                        </PaginationItem>
                    ))}
                    {pages.splice(currentPage - 3, 1).map((p) => (
                        <PaginationItem key={p}>
                            <PaginationLink
                                href="#"
                                onClick={() => onChangePage(p)}
                                isActive={currentPage === p}
                            >
                                {p}
                            </PaginationLink>
                        </PaginationItem>
                    ))}
                    {pages.splice(currentPage - 3, 1).map((p) => (
                        <PaginationItem key={p}>
                            <PaginationLink
                                href="#"
                                onClick={() => onChangePage(p)}
                            >
                                {p}
                            </PaginationLink>
                        </PaginationItem>
                    ))}
                    <PaginationItem>
                        <PaginationEllipsis />
                    </PaginationItem>
                    {pages.splice(pages.length - 1, 1).map((p) => (
                        <PaginationItem key={p}>
                            <PaginationLink
                                href="#"
                                onClick={() => onChangePage(p)}
                            >
                                {p}
                            </PaginationLink>
                        </PaginationItem>
                    ))}
                </>
            );
        }

        if (currentPage > pages.length - 2) {
            return (
                <>
                    {pages.splice(0, 1).map((p) => (
                        <PaginationItem key={p}>
                            <PaginationLink
                                href="#"
                                onClick={() => onChangePage(p)}
                                isActive={currentPage === p}
                            >
                                {p}
                            </PaginationLink>
                        </PaginationItem>
                    ))}
                    <PaginationItem>
                        <PaginationEllipsis />
                    </PaginationItem>
                    {pages.splice(pages.length - 3).map((p) => (
                        <PaginationItem key={p}>
                            <PaginationLink
                                href="#"
                                onClick={() => onChangePage(p)}
                                isActive={currentPage === p}
                            >
                                {p}
                            </PaginationLink>
                        </PaginationItem>
                    ))}
                </>
            );
        }

        return (
            <>
                {pages.splice(0, 3).map((p) => (
                    <PaginationItem key={p}>
                        <PaginationLink
                            href="#"
                            onClick={() => onChangePage(p)}
                            isActive={currentPage === p}
                        >
                            {p}
                        </PaginationLink>
                    </PaginationItem>
                ))}
                <PaginationItem>
                    <PaginationEllipsis />
                </PaginationItem>
                {pages.splice(pages.length - 1, 1).map((p) => (
                    <PaginationItem key={p}>
                        <PaginationLink
                            href="#"
                            onClick={() => onChangePage(p)}
                            isActive={currentPage === p}
                        >
                            {p}
                        </PaginationLink>
                    </PaginationItem>
                ))}
            </>
        );
    };

    return (
        pages?.length > 1 && (
            <Pagination className={cn("pt-4", className)}>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            href="#"
                            onClick={onClickPrevPage}
                        />
                    </PaginationItem>
                    {getThirdPageNumber()}
                    <PaginationItem>
                        <PaginationNext href="#" onClick={onClickNextPage} />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        )
    );
}
