/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/clientDetails/AttachmentsTab.tsx

import { useState } from 'react';
import { AttachmentsList } from './AttachmentsList';
import { AttachmentUploadDialog } from './AttachmentUploadDialog';
import { Attachment } from './types';

interface AttachmentsTabProps {
  attachments: Attachment[];
  user: any;
  onUploadFile: (file: File, description: string, userId: string) => Promise<boolean>;
  onDownloadFile: (attachment: Attachment) => Promise<boolean>;
  onDeleteFile: (attachment: Attachment) => Promise<boolean>;
}

export function AttachmentsTab({
  attachments,
  user,
  onUploadFile,
  onDownloadFile,
  onDeleteFile,
}: AttachmentsTabProps) {
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);

  const handleUpload = async (file: File, description: string) => {
    const success = await onUploadFile(file, description, user?.id);
    if (success) {
      setIsUploadDialogOpen(false);
    }
  };

  const handleDelete = async (attachment: Attachment) => {
    if (!confirm('Are you sure you want to delete this file?')) return;
    await onDeleteFile(attachment);
  };

  return (
    <>
      <AttachmentUploadDialog
        isOpen={isUploadDialogOpen}
        onOpenChange={setIsUploadDialogOpen}
        onUpload={handleUpload}
      />
      
      <AttachmentsList
        attachments={attachments}
        user={user}
        onDownload={onDownloadFile}
        onDelete={handleDelete}
      />
    </>
  );
}