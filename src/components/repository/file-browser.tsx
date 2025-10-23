import { type FileNode } from "@/lib/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Folder, FileText } from "lucide-react";
import Link from "next/link";

export function FileBrowser({ files }: { files: FileNode[] }) {
  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Last commit message</TableHead>
            <TableHead className="text-right">Last updated</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {files.map((file) => (
            <TableRow key={file.name}>
              <TableCell className="font-medium">
                <Link href="#" className="flex items-center gap-3 hover:text-primary transition-colors">
                  {file.type === 'folder' ? <Folder className="h-4 w-4 text-primary" /> : <FileText className="h-4 w-4 text-muted-foreground" />}
                  <span>{file.name}</span>
                </Link>
              </TableCell>
              <TableCell className="text-muted-foreground">{file.commit}</TableCell>
              <TableCell className="text-right text-muted-foreground">{file.lastUpdated}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
