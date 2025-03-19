
import React from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { User, Edit, Trash2 } from 'lucide-react';
import { Recipient } from '@/hooks/useRecipients';

interface RecipientTableProps {
  recipients: Recipient[] | undefined;
  isLoading: boolean;
  onEditRecipient: (recipient: Recipient) => void;
  onDeleteRecipient: (recipientId: number) => void;
  user: any | null;
}

const RecipientTable: React.FC<RecipientTableProps> = ({
  recipients,
  isLoading,
  onEditRecipient,
  onDeleteRecipient,
  user
}) => {
  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-card">
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader className="text-muted-foreground">Name</TableHeader>
            <TableHeader className="text-muted-foreground">Email</TableHeader>
            <TableHeader className="text-muted-foreground">Phone</TableHeader>
            <TableHeader className="text-muted-foreground">Location</TableHeader>
            <TableHeader className="text-right text-muted-foreground">Actions</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {!user ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-foreground">
                Please sign in to view your recipients
              </TableCell>
            </TableRow>
          ) : isLoading ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-foreground">Loading recipients...</TableCell>
            </TableRow>
          ) : recipients && recipients.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-foreground">No recipients found</TableCell>
            </TableRow>
          ) : (
            recipients?.map((recipient: Recipient) => (
              <TableRow key={recipient.recipient_id} className="hover:bg-muted/50">
                <TableCell>
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-muted rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-foreground">{recipient.full_name}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-foreground">{recipient.email_address || "—"}</div>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-foreground">{recipient.telephone_number || "—"}</div>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-foreground">
                    {recipient.city && recipient.region ? `${recipient.city}, ${recipient.region}` : 
                      recipient.city || recipient.region || "—"}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => onEditRecipient(recipient)}
                      className="text-foreground hover:text-foreground/80 hover:bg-background/80"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => onDeleteRecipient(recipient.recipient_id)}
                      className="text-destructive hover:text-destructive/90 hover:bg-background/80"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default RecipientTable;
