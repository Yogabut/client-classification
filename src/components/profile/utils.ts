export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
};

export const getActionBadgeColor = (action: string): string => {
  switch (action) {
    case 'created': return 'bg-success/10 text-success';
    case 'updated': return 'bg-primary/10 text-primary';
    case 'deleted': return 'bg-destructive/10 text-destructive';
    default: return 'bg-muted text-muted-foreground';
  }
};