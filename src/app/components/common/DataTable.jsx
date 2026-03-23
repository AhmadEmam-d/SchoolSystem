import React from 'react';
import { COMPONENT_STYLES } from '../../lib/uiConstants';

/**
 * Reusable Data Table Component
 * Provides consistent table styling with dark mode support
 */
export function DataTable({ 
  columns = [], 
  data = [], 
  onRowClick,
  emptyMessage = 'No data available',
  className = '',
}) {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className={`overflow-x-auto rounded-lg border border-border ${className}`}>
      <table className="w-full">
        <thead className="bg-muted/50 border-b border-border">
          <tr>
            {columns.map((column, index) => (
              <th 
                key={index} 
                className={`px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider ${column.align === 'center' ? 'text-center' : column.align === 'right' ? 'text-right' : 'text-left'}`}
                style={{ width: column.width }}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-card divide-y divide-border">
          {data.map((row, rowIndex) => (
            <tr 
              key={rowIndex} 
              className={`hover:bg-accent/50 transition-colors ${onRowClick ? 'cursor-pointer' : ''}`}
              onClick={() => onRowClick && onRowClick(row)}
            >
              {columns.map((column, colIndex) => (
                <td 
                  key={colIndex} 
                  className={`px-6 py-4 whitespace-nowrap text-sm text-foreground ${column.align === 'center' ? 'text-center' : column.align === 'right' ? 'text-right' : 'text-left'}`}
                >
                  {column.render ? column.render(row) : row[column.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * Example usage:
 * 
 * const columns = [
 *   { header: 'Name', accessor: 'name' },
 *   { header: 'Email', accessor: 'email' },
 *   { 
 *     header: 'Status', 
 *     accessor: 'status',
 *     render: (row) => <StatusBadge status={row.status} />
 *   },
 * ];
 * 
 * <DataTable columns={columns} data={students} />
 */