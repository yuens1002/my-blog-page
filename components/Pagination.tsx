import { Select } from '@headlessui/react';
import { Button } from './ui/button';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ChevronsUpDown,
} from 'lucide-react';

type PaginationProps = {
  count: number;
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
};

export default function Pagination({
  count,
  currentPage,
  totalPages,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
}: PaginationProps) {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (page: number) => {
    onPageChange(page);
  };

  const handleItemsPerPageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    onItemsPerPageChange(Number(event.target.value));
    onPageChange(1);
  };

  const renderPageButtons = () => {
    const maxButtons = 5;
    const startPage = Math.max(
      1,
      currentPage - Math.floor(maxButtons / 2)
    );
    const endPage = Math.min(startPage + maxButtons - 1, totalPages);

    return Array.from(
      { length: endPage - startPage + 1 },
      (_, index) => {
        const pageNumber = startPage + index;
        return (
          <Button
            variant={
              currentPage === pageNumber ? 'default' : 'outline'
            }
            key={pageNumber}
            onClick={() => handlePageClick(pageNumber)}
          >
            {pageNumber}
          </Button>
        );
      }
    );
  };

  return (
    <div className="flex items-center justify-between pb-8">
      <div className="flex items-center">
        <span className="inline-block pt-[.20rem]">
          Showing{' '}
          <span className="text-lg font-bold">
            {(currentPage - 1) * itemsPerPage + 1}
          </span>{' '}
          -{' '}
          <span className="text-lg font-bold">
            {count > currentPage * itemsPerPage
              ? currentPage * itemsPerPage
              : count}{' '}
          </span>
          of <span className="text-lg font-bold">{count}</span>
        </span>
      </div>
      <div className="flex gap-2">
        <div className="relative mx-4">
          <Select
            name="posts-per-page"
            aria-label="Posts per page"
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            className="text-sm appearance-none w-[13rem] px-3 py-[0.55rem] border border-primary/6 rounded-md"
          >
            {[10, 25, 50].map((count) => (
              <option key={count} value={count} className="text-sm">
                show {count} per page
              </option>
            ))}
          </Select>
          <ChevronsUpDown
            size={18}
            className="inline-block absolute right-2.5 top-[11px] text-primary"
          />
        </div>
        <Button
          variant={'outline'}
          onClick={handlePrevious}
          disabled={currentPage === 1}
        >
          <ChevronLeft />
        </Button>
        {renderPageButtons()}
        <Button
          variant={'outline'}
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="pagination-button"
        >
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
}
