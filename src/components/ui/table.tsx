
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
  <tr className={cn("border-b transition-colors hover:bg-muted/30 data-[state=selected]:bg-muted", className)} {...props}>
    {children}
  </tr>
);

interface TableCellProps extends React.HTMLAttributes<HTMLTableCellElement> {
  children: React.ReactNode;
}

const TableCell: React.FC<TableCellProps> = ({ className, children, ...props }) => (
  <td className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)} {...props}>
    {children}
  </td>
);

interface TableHeaderProps extends React.HTMLAttributes<HTMLTableCellElement> {
  children: React.ReactNode;
}

const TableHeader: React.FC<TableHeaderProps> = ({ className, children, ...props }) => (
  <th className={cn("h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0", className)} {...props}>
    {children}
  </th>
);

export { Table, TableBody, TableHead, TableRow, TableCell, TableHeader };
