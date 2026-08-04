import { memo, useCallback } from 'react';
import { cn } from '@/utils/cn';
import Checkbox from '@/components/forms/Checkbox';
import Skeleton from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import ErrorState from '@/components/ui/ErrorState';
import Pagination from '@/components/navigation/Pagination';

const TableHeader = memo(function TableHeader({
  columns,
  sortBy,
  sortOrder,
  onSort,
  isSortable,
  selectedRows,
  allSelected,
  onSelectAll,
  selectable,
}) {
  return (
    <thead className="bg-amber-50/60 border-b border-amber-900/10 font-heading">
      <tr>
        {selectable && (
          <th className="w-10 px-4 py-3.5 text-left">
            <Checkbox
              checked={allSelected}
              isIndeterminate={selectedRows?.size > 0 && !allSelected}
              onChange={onSelectAll}
              size="sm"
              aria-label="Select all rows"
            />
          </th>
        )}
        {columns.map((col) => {
          const isSorted = sortBy === col.key;
          return (
            <th
              key={col.key}
              className={cn(
                'px-4 py-3.5 text-left text-xs font-extrabold uppercase tracking-wider text-amber-950',
                col.sortable && isSortable && 'cursor-pointer select-none hover:text-amber-800',
              )}
              style={col.width ? { width: col.width } : undefined}
              onClick={() => {
                if (col.sortable && isSortable) {
                  const newOrder = isSorted && sortOrder === 'asc' ? 'desc' : 'asc';
                  onSort?.(col.key, newOrder);
                }
              }}
              aria-sort={
                isSorted
                  ? sortOrder === 'asc' ? 'ascending' : 'descending'
                  : undefined
              }
            >
              <div className="inline-flex items-center gap-1">
                <span>{col.label}</span>
                {col.sortable && isSortable && (
                  <svg
                    className={cn(
                      'h-3 w-3 transition-transform',
                      isSorted && 'text-amber-800',
                    )}
                    viewBox="0 0 12 12"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    {isSorted && sortOrder === 'asc' ? (
                      <path d="M6 2l4 8H2l4-8z" />
                    ) : isSorted && sortOrder === 'desc' ? (
                      <path d="M6 10l4-8H2l4 8z" />
                    ) : (
                      <path d="M6 2l4 8H2l4-8z" opacity="0.3" />
                    )}
                  </svg>
                )}
              </div>
            </th>
          );
        })}
      </tr>
    </thead>
  );
});

const TableRow = memo(function TableRow({
  row,
  columns,
  index,
  isSelected,
  onSelect,
  onRowClick,
  selectable,
}) {
  const handleClick = useCallback(() => {
    onRowClick?.(row);
  }, [row, onRowClick]);

  return (
    <tr
      className={cn(
        'border-b border-amber-900/10 transition-colors hover:bg-amber-50/40 font-body',
        isSelected && 'bg-amber-100/50',
        onRowClick && 'cursor-pointer',
      )}
      onClick={handleClick}
    >
      {selectable && (
        <td className="w-10 px-4 py-3.5">
          <Checkbox
            checked={isSelected}
            onChange={() => onSelect?.(row)}
            size="sm"
            aria-label={`Select row ${index + 1}`}
          />
        </td>
      )}
      {columns.map((col) => (
        <td
          key={col.key}
          className="px-4 py-3.5 text-xs sm:text-sm text-amber-950 font-medium"
        >
          {col.render ? col.render(row[col.key], row, index) : row[col.key]}
        </td>
      ))}
    </tr>
  );
});

function LoadingRows({ columns, selectable, count = 5 }) {
  return (
    <tbody>
      {Array.from({ length: count }).map((_, i) => (
        <tr key={i} className="border-b border-amber-900/10">
          {selectable && (
            <td className="w-10 px-4 py-3.5">
              <Skeleton variant="rect" className="h-4 w-4 rounded" />
            </td>
          )}
          {columns.map((col) => (
            <td key={col.key} className="px-4 py-3.5">
              <Skeleton variant="text" className="h-4 w-3/4" />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
}

function Table({
  columns = [],
  data = [],
  isLoading = false,
  isSortable = false,
  sortBy,
  sortOrder,
  onSort,
  onRowClick,
  emptyMessage = 'No data available',
  emptyIcon,
  emptyAction,
  selectedRows = new Set(),
  onSelectionChange,
  error,
  onRetry,
  pagination,
  className,
}) {
  const selectable = !!onSelectionChange;
  const allSelected = data.length > 0 && selectedRows.size === data.length;

  const handleSelectAll = useCallback(() => {
    if (allSelected) {
      onSelectionChange?.(new Set());
    } else {
      onSelectionChange?.(new Set(data.map((_, i) => i)));
    }
  }, [allSelected, data, onSelectionChange]);

  const handleSelect = useCallback(
    (row) => {
      const index = data.indexOf(row);
      const newSet = new Set(selectedRows);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      onSelectionChange?.(newSet);
    },
    [data, selectedRows, onSelectionChange],
  );

  if (error) {
    return (
      <ErrorState
        title="Failed to load data"
        message={error}
        onRetry={onRetry}
        className="py-12"
      />
    );
  }

  if (!isLoading && data.length === 0) {
    return (
      <EmptyState
        title={emptyMessage}
        icon={emptyIcon}
        action={emptyAction}
        className="py-12"
      />
    );
  }

  return (
    <div className={cn('w-full rounded-3xl border border-amber-900/10 bg-white shadow-[0_4px_20px_rgba(44,40,36,0.03)] overflow-hidden font-display', className)}>
      <div className="responsive-table w-full overflow-x-auto" tabIndex={0} aria-label="Scrollable data table">
        <table className="w-full border-collapse" role="table">
          <TableHeader
            columns={columns}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={onSort}
            isSortable={isSortable}
            selectedRows={selectedRows}
            allSelected={allSelected}
            onSelectAll={handleSelectAll}
            selectable={selectable}
          />
          {isLoading ? (
            <LoadingRows columns={columns} selectable={selectable} count={5} />
          ) : (
            <tbody>
              {data.map((row, index) => (
                <TableRow
                  key={row.id || row._id || index}
                  row={row}
                  columns={columns}
                  index={index}
                  isSelected={selectedRows.has(index)}
                  onSelect={handleSelect}
                  onRowClick={onRowClick}
                  selectable={selectable}
                />
              ))}
            </tbody>
          )}
        </table>
      </div>
      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center border-t border-amber-900/10 p-4">
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={pagination.onPageChange}
            size="sm"
          />
        </div>
      )}
    </div>
  );
}

export default Table;
