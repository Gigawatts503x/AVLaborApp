import React from 'react';
import '../styles/components/Table.css';

/**
 * Table Component - Reusable data table
 * Props:
 * - columns: Array of column definitions [{header, key, render}]
 * - data: Array of row data
 * - onRowClick: Row click handler
 * - striped: Alternate row colors
 * - hoverable: Highlight on hover
 */
export default function Table({
  columns,
  data,
  onRowClick,
  striped = true,
  hoverable = true,
}) {
  const tableClass = `
    table 
    ${striped ? 'table-striped' : ''} 
    ${hoverable ? 'table-hover' : ''}
  `.trim();

  return (
    <div className="table-wrapper">
      <table className={tableClass}>
        <thead>
          <tr>
            {columns.map((col, idx) => (
              <th key={idx}>{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="text-center text-muted">
                No data available
              </td>
            </tr>
          ) : (
            data.map((row, rowIdx) => (
              <tr
                key={rowIdx}
                onClick={() => onRowClick && onRowClick(row)}
                style={{ cursor: onRowClick ? 'pointer' : 'default' }}
              >
                {columns.map((col, colIdx) => (
                  <td key={colIdx}>
                    {col.render
                      ? col.render(row[col.key], row)
                      : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
