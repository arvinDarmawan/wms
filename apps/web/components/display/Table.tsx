'use client';

import { useState } from 'react';

interface TableProps<T> {
    data: T[];
    columns: { key: keyof T; label: string }[];
    total: number;
    rowsPerPage?: number;
    renderActions?: (row: T) => React.ReactNode;
}

const Table = <T,>({
    data,
    columns,
    total,
    rowsPerPage = 5,
    renderActions
}: TableProps<T>) => {
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(total / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const currentRows = data.slice(startIndex, startIndex + rowsPerPage);

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <div className="w-full overflow-x-auto">
            <table className="min-w-full border border-gray-300 rounded-lg">
                <thead className="border-b border-gray-100">
                    <tr>
                        {columns.map((col) => (
                            <th
                                key={String(col.key)}
                                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs">
                                {col.label}
                            </th>
                        ))}
                        {renderActions && (
                            <th className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs">
                                Actions
                            </th>
                        )}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {currentRows.length > 0 ? (
                        currentRows.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                {columns.map((col) => (
                                    <td
                                        key={String(col.key)}
                                        className="px-4 py-3 text-gray-500 text-start text-theme-sm">
                                        {String(row[col.key])}
                                    </td>
                                ))}
                                {renderActions && (
                                    <td className="px-4 py-3 text-gray-500 text-start text-theme-sm">
                                        {renderActions(row)}
                                    </td>
                                )}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td
                                colSpan={
                                    columns.length + (renderActions ? 1 : 0)
                                }
                                className="px-4 py-3 text-gray-500 text-center text-theme-sm">
                                No data available
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Pagination */}
            <div className="flex justify-center items-center mt-4 space-x-2">
                <button
                    className="px-3 py-1 border rounded disabled:opacity-50"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}>
                    Prev
                </button>

                {[...Array(totalPages)].map((_, i) => (
                    <button
                        key={i}
                        className={`px-3 py-1 border rounded ${
                            currentPage === i + 1
                                ? 'bg-blue-500 text-white'
                                : ''
                        }`}
                        onClick={() => handlePageChange(i + 1)}>
                        {i + 1}
                    </button>
                ))}

                <button
                    className="px-3 py-1 border rounded disabled:opacity-50"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}>
                    Next
                </button>
            </div>
        </div>
    );
};

export default Table;
