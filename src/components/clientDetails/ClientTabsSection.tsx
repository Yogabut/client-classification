/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/clientDetails/ClientTabsSection.tsx

import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { InteractionsTab } from './InteractionsTab';
import { AttachmentsTab } from './AttachmentsTab';
import { Client, Interaction, Attachment } from './types';

interface ClientTabsSectionProps {
  client: Client;
  interactions: Interaction[];
  attachments: Attachment[];
  user: any;
  onAddInteraction: (type: string, note: string, userId: string) => Promise<boolean>;
  onUpdateInteraction: (id: string, type: string, note: string) => Promise<boolean>;
  onDeleteInteraction: (id: string) => Promise<boolean>;
  onUploadFile: (file: File, description: string, userId: string) => Promise<boolean>;
  onDownloadFile: (attachment: Attachment) => Promise<boolean>;
  onDeleteFile: (attachment: Attachment) => Promise<boolean>;
}

export function ClientTabsSection({
  client,
  interactions,
  attachments,
  user,
  onAddInteraction,
  onUpdateInteraction,
  onDeleteInteraction,
  onUploadFile,
  onDownloadFile,
  onDeleteFile,
}: ClientTabsSectionProps) {
  return (
    <Card className="md:col-span-2">
      <CardContent className="pt-6">
        <Tabs defaultValue="interactions">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="interactions">Interactions</TabsTrigger>
            <TabsTrigger value="attachments">Attachments</TabsTrigger>
          </TabsList>
          
          <TabsContent value="interactions" className="space-y-4">
            <InteractionsTab
              interactions={interactions}
              user={user}
              onAddInteraction={onAddInteraction}
              onUpdateInteraction={onUpdateInteraction}
              onDeleteInteraction={onDeleteInteraction}
            />
          </TabsContent>
          
          <TabsContent value="attachments" className="space-y-4">
            <AttachmentsTab
              attachments={attachments}
              user={user}
              onUploadFile={onUploadFile}
              onDownloadFile={onDownloadFile}
              onDeleteFile={onDeleteFile}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}