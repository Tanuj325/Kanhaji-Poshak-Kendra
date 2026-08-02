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
    <thead className="bg-muted-sand/10">
      <tr>
        {selectable && (
          <th className="w-10 px-3 py-3 text-left">
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
                'px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider text-natural-wood',
                col.sortable && isSortable && 'cursor-pointer select-none hover:text-dark-charcoal',
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
                      isSorted && 'text-royal-blue',
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
        'border-b border-muted-sand/20 transition-colors hover:bg-muted-sand/5',
        isSelected && 'bg-royal-blue/5',
        onRowClick && 'cursor-pointer',
      )}
      onClick={handleClick}
    >
      {selectable && (
        <td className="w-10 px-3 py-3">
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
          className="px-3 py-3 text-sm text-dark-charcoal"
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
        <tr key={i} className="border-b border-muted-sand/20">
          {selectable && (
            <td className="w-10 px-3 py-3">
              <Skeleton variant="rect" className="h-4 w-4 rounded" />
            </td>
          )}
          {columns.map((col) => (
            <td key={col.key} className="px-3 py-3">
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
    <div className={cn('w-full rounded-[28px] border border-white/70 bg-white/80 shadow-[0_18px_48px_rgba(44,40,36,0.08)] backdrop-blur-sm overflow-hidden', className)}>
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
            <div className="flex justify-center border-t border-muted-sand/20 px-4 py-4">
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
        <div className="flex justify-center border-t border-muted-sand/20 pt-4">
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

