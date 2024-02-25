import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import { pagesArray } from "@/utils/paginate";

export function ProductPagination({
    className,
    currentPage,
    pageCount,
    onChangePage,
    onClickPrevPage,
    onClickNextPage,
}) {
    const pages = pagesArray(pageCount);

    return (
        pages?.length > 1 && (
            <Pagination className={cn("mt-4 mb-4", className)}>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            href="#"
                            onClick={onClickPrevPage}
                        />
                    </PaginationItem>
                    {pages.splice(currentPage - 1, 3).map((p) => (
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
                    <PaginationItem>
                        <PaginationNext href="#" onClick={onClickNextPage} />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        )
    );
}
