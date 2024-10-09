import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TableCell, TableRow } from '@/components/ui/table';
import { User } from 'lucide-react';

interface NameTableRowProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const NameTableRow = ({ value, onChange }: NameTableRowProps) => {
  return (
    <TableRow>
      <TableCell className="font-bold">
        <Label htmlFor="name" className="flex items-center">
          <User className="mr-2 h-4 w-4" />
          이름
        </Label>
      </TableCell>
      <TableCell>
        <Input
          id="name"
          name="name"
          value={value}
          onChange={onChange}
          placeholder="이름을 입력하세요"
        />
      </TableCell>
    </TableRow>
  );
};
