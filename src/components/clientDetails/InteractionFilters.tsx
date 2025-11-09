import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Filter, Plus } from 'lucide-react';

interface InteractionFiltersProps {
  filterType: string;
  filterDateFrom: string;
  filterDateTo: string;
  onFilterTypeChange: (value: string) => void;
  onFilterDateFromChange: (value: string) => void;
  onFilterDateToChange: (value: string) => void;
  onClearFilters: () => void;
  onOpenDialog: () => void;
}

export function InteractionFilters({
  filterType,
  filterDateFrom,
  filterDateTo,
  onFilterTypeChange,
  onFilterDateFromChange,
  onFilterDateToChange,
  onClearFilters,
  onOpenDialog,
}: InteractionFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={filterType} onValueChange={onFilterTypeChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Email">Email</SelectItem>
                  <SelectItem value="Call">Call</SelectItem>
                  <SelectItem value="Meeting">Meeting</SelectItem>
                  <SelectItem value="Note">Note</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Date From</Label>
              <Input
                type="date"
                value={filterDateFrom}
                onChange={(e) => onFilterDateFromChange(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Date To</Label>
              <Input
                type="date"
                value={filterDateTo}
                onChange={(e) => onFilterDateToChange(e.target.value)}
              />
            </div>
            <Button variant="outline" size="sm" onClick={onClearFilters} className="w-full">
              Clear Filters
            </Button>
          </div>
        </PopoverContent>
      </Popover>
      <div className="ml-auto">
        <Button size="sm" onClick={onOpenDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Log Interaction
        </Button>
      </div>
    </div>
  );
}