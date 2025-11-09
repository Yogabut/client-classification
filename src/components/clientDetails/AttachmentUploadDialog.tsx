import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Upload } from 'lucide-react';

interface AttachmentUploadDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onUpload: (file: File, description: string) => Promise<void>;
}

export function AttachmentUploadDialog({
  isOpen,
  onOpenChange,
  onUpload,
}: AttachmentUploadDialogProps) {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const file = formData.get('file') as File;
    const description = formData.get('description') as string;
    
    if (file) {
      await onUpload(file, description);
      e.currentTarget.reset();
    }
  };

  return (
    <div className="flex justify-end mb-4">
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogTrigger asChild>
          <Button size="sm">
            <Upload className="mr-2 h-4 w-4" />
            Upload File
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Attachment</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="attachment-file">Select File</Label>
              <Input
                id="attachment-file"
                name="file"
                type="file"
                required
                accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.jpg,.jpeg,.png"
              />
              <p className="text-xs text-muted-foreground">
                Max size: 20MB. Supported: PDF, DOC, DOCX, XLS, XLSX, TXT, JPG, PNG
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="attachment-description">Description (Optional)</Label>
              <Textarea
                id="attachment-description"
                name="description"
                placeholder="Brief description of this file..."
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Upload</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}