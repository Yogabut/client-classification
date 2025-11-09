/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@/components/ui/button';
import { Download, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { Attachment } from './types';

interface AttachmentsListProps {
  attachments: Attachment[];
  user: any;
  onDownload: (attachment: Attachment) => Promise<boolean>;
  onDelete: (attachment: Attachment) => Promise<void>;
}

export function AttachmentsList({
  attachments,
  user,
  onDownload,
  onDelete,
}: AttachmentsListProps) {
  if (attachments.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-8">
        No attachments uploaded yet
      </p>
    );
  }

  return (
    <>
      {attachments.map((attachment) => (
        <div 
          key={attachment.id} 
          className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
        >
          <div className="flex-1">
            <p className="font-medium">{attachment.file_name}</p>
            <p className="text-sm text-muted-foreground">
              {(attachment.file_size / 1024).toFixed(1)} KB • {format(new Date(attachment.created_at), 'MMM dd, yyyy')}
            </p>
            {attachment.description && (
              <p className="text-sm text-muted-foreground mt-1">{attachment.description}</p>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDownload(attachment)}
            >
              <Download className="h-4 w-4" />
            </Button>
            {attachment.user_id === user?.id && (
              <Button
                variant="outline"
                size="sm"
                className="text-destructive"
                onClick={() => onDelete(attachment)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      ))}
    </>
  );
}