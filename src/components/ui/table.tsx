
import React from "react";
import { cn } from "@/lib/utils";

interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  children: React.ReactNode;
}

const Table: React.FC<TableProps> = ({ className, children, ...props }) => (
  <table className={cn("w-full caption-bottom text-sm", className)} {...props}>
    {children}
  </table>
);

interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  children: React.ReactNode;
}

const TableBody: React.FC<TableBodyProps> = ({ className, children, ...props }) => (
  <tbody className={cn("divide-y divide-border", className)} {...props}>
    {children}
  </tbody>
);

interface TableHeadProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  children: React.ReactNode;
}

const TableHead: React.FC<TableHeadProps> = ({ className, children, ...props }) => (
  <thead className={cn("bg-muted/50 border-b border-border", className)} {...props}>
    {children}
  </thead>
);

interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  children: React.ReactNode;
}

const TableRow: React.FC<TableRowProps> = ({ className, children, ...props }) => (
  <tr 
    className={cn(
      "border-b border-border transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
      className
    )} 
    {...props}
  >
    {children}
  </tr>
);

interface TableCellProps extends React.HTMLAttributes<HTMLTableCellElement> {
  children?: React.ReactNode;
  colSpan?: number;
}

const TableCell: React.FC<TableCellProps> = ({ className, children, colSpan, ...props }) => (
  <td 
    className={cn("p-4 align-middle text-foreground [&:has([role=checkbox])]:pr-0", className)} 
    colSpan={colSpan} 
    {...props}
  >
    {children}
  </td>
);

interface TableHeaderProps extends React.HTMLAttributes<HTMLTableCellElement> {
  children?: React.ReactNode;
  colSpan?: number;
}

const TableHeader: React.FC<TableHeaderProps> = ({ className, children, colSpan, ...props }) => (
  <th 
    className={cn(
      "h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0", 
      className
    )} 
    colSpan={colSpan} 
    {...props}
  >
    {children}
  </th>
);

export { Table, TableBody, TableHead, TableRow, TableCell, TableHeader };
