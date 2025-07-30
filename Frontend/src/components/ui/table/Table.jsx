import React from "react";

// Table Component
const Table = ({ children, className = "" }) => {
    return <table className={`min-w-full ${className}`}>{children}</table>;
};

const TableHeader = ({ children, className = "" }) => {
    return <thead className={className}>{children}</thead>;
};

// TableBody Component
const TableBody = ({ children, className = "" }) => {
    return <tbody className={className}>{children}</tbody>;
};

// TableRow Component
const TableRow = ({ children, className = "" }) => {
    return <tr className={className}>{children}</tr>;
};

// TableCell Component
const TableCell = ({ children, isHeader = false, className = "", colSpan }) => {
    const CellTag = isHeader ? "th" : "td";
    return <CellTag className={className} colSpan={colSpan}>{children}</CellTag>;
};

export { Table, TableHeader, TableBody, TableRow, TableCell };
