import React from 'react';
import { twMerge } from 'tailwind-merge';

/**
 * Premium Generic Table Component
 * Custom Div-based Flex implementation with specific 5px radius
 * and a refined dark blue professional shade.
 */
const Table = ({
    rowData = [],
    columnDefs = [],
    className = "",
    paginationPageSize = 10,
    ...props
}) => {
    return (
        <div className={twMerge("w-full overflow-hidden flex flex-col h-full bg-dark-900 border border-dark-600/60 shadow-xl", className)} style={{ borderRadius: '5px' }}>
            {/* Header */}
            <div className="bg-dark-800 border-b border-dark-600/60 z-20 flex">
                {columnDefs.map((col, index) => {
                    const isFirst = index === 0;
                    const isLast = index === columnDefs.length - 1;
                    const style = {
                        width: col.width,
                        minWidth: col.minWidth,
                        flex: col.flex ? `${col.flex} 0 0px` : 'none'
                    };
                    if (!col.width && !col.minWidth && !col.flex) {
                        style.flex = '1 0 0px';
                    }

                    if (isFirst) {
                        style.position = 'sticky';
                        style.left = 0;
                        style.zIndex = 30;
                        style.boxShadow = '1px 0 0 0 rgba(63, 75, 91, 0.3)';
                    } else if (isLast) {
                        style.position = 'sticky';
                        style.right = 0;
                        style.zIndex = 30;
                        style.boxShadow = '-1px 0 0 0 rgba(63, 75, 91, 0.3)';
                    }

                    return (
                        <div
                            key={index}
                            style={style}
                            className={twMerge(
                                "px-6 py-4 text-[11px] font-bold text-primary uppercase tracking-wider whitespace-nowrap",
                                (isFirst || isLast) ? "bg-dark-800" : ""
                            )}
                        >
                            {col.headerName}
                        </div>
                    );
                })}
            </div>

            {/* Body */}
            <div className="overflow-y-auto flex-1 custom-scrollbar">
                {rowData.length > 0 ? (
                    rowData.map((row, rowIndex) => (
                        <div
                            key={rowIndex}
                            className="group hover:bg-dark-800/70 transition-all duration-200 flex border-b border-dark-600/30 last:border-0"
                        >
                            {columnDefs.map((col, colIndex) => {
                                const isFirst = colIndex === 0;
                                const isLast = colIndex === columnDefs.length - 1;
                                const value = col.field ? row[col.field] : null;
                                const params = {
                                    value,
                                    data: row,
                                    rowIndex
                                };

                                const style = {
                                    width: col.width,
                                    minWidth: col.minWidth,
                                    flex: col.flex ? `${col.flex} 0 0px` : 'none'
                                };
                                if (!col.width && !col.minWidth && !col.flex) {
                                    style.flex = '1 0 0px';
                                }

                                if (isFirst) {
                                    style.position = 'sticky';
                                    style.left = 0;
                                    style.zIndex = 20;
                                    style.boxShadow = '1px 0 0 0 rgba(63, 75, 91, 0.3)';
                                } else if (isLast) {
                                    style.position = 'sticky';
                                    style.right = 0;
                                    style.zIndex = 20;
                                    style.boxShadow = '-1px 0 0 0 rgba(63, 75, 91, 0.3)';
                                }

                                return (
                                    <div
                                        key={colIndex}
                                        style={style}
                                        className={twMerge(
                                            "px-6 py-5 text-[13px] text-text-primary flex items-center transition-colors group-hover:text-text-primary",
                                            (isFirst || isLast) ? "bg-dark-900 group-hover:bg-dark-800" : ""
                                        )}
                                    >
                                        {col.cellRenderer ? col.cellRenderer(params) : (
                                            <span className="opacity-90 group-hover:opacity-100 truncate">
                                                {value}
                                            </span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ))
                ) : (
                    <div className="w-full py-24 text-center flex flex-col items-center justify-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center border border-primary/10">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                        </div>
                        <span className="text-primary/50 font-bold text-[10px] uppercase tracking-widest">
                            No data synchronized
                        </span>
                    </div>
                )}
            </div>

            {/* Pagination Footer */}
            <div className="px-6 py-4 border-t border-dark-600/40 bg-dark-900 flex justify-between items-center text-[10px] font-bold text-text-muted uppercase tracking-widest z-10">
                <div className="flex items-center gap-3">
                    <span className="tracking-widest hidden sm:inline opacity-60">
                        TOTAL RECORDS: <span className="text-primary">{rowData.length}</span>
                    </span>
                </div>
                <div className="flex gap-6 items-center">
                    <button className="hover:text-primary transition-all disabled:opacity-20 cursor-pointer" disabled>
                        PREVIOUS
                    </button>
                    <button className="hover:text-primary transition-all disabled:opacity-20 cursor-pointer" disabled>
                        NEXT
                    </button>
                </div>
            </div>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 5px;
                    height: 5px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgb(var(--color-dark-700));
                    border-radius: 5px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #1A6DD9;
                }
            `}</style>
        </div>
    );
};

export default Table;
