
import { Button } from '@/components/ui/button';
import { BulkStatusDialog } from './BulkStatusDialog';
import { BulkNotesDialog } from './BulkNotesDialog';

interface BulkActionButtonsProps {
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
  onBulkUpdate: () => void;
}

export const BulkActionButtons = ({ selectedIds, onSelectionChange, onBulkUpdate }: BulkActionButtonsProps) => {
  if (selectedIds.length === 0) return null;

  return (
    <div className="flex items-center gap-2">
      <BulkStatusDialog
        selectedIds={selectedIds}
        onSelectionChange={onSelectionChange}
        onBulkUpdate={onBulkUpdate}
      />
      
      <BulkNotesDialog
        selectedIds={selectedIds}
        onSelectionChange={onSelectionChange}
        onBulkUpdate={onBulkUpdate}
      />

      <Button
        variant="outline"
        size="sm"
        onClick={() => onSelectionChange([])}
      >
        Clear Selection
      </Button>
    </div>
  );
};
