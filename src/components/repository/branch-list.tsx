import { type Branch } from "@/lib/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export function BranchList({ branches }: { branches: Branch[] }) {
  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Branch</TableHead>
            <TableHead>Last commit</TableHead>
            <TableHead className="text-right">Last updated</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {branches.map((branch) => (
            <TableRow key={branch.name}>
              <TableCell className="font-medium">
                  <Link href="#" className="flex items-center gap-2 hover:text-primary transition-colors">
                    {branch.name}
                    {branch.isDefault && <Badge variant="secondary">default</Badge>}
                  </Link>
              </TableCell>
              <TableCell className="text-muted-foreground font-mono">{branch.lastCommit}</TableCell>
              <TableCell className="text-right text-muted-foreground">{branch.lastUpdated}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
