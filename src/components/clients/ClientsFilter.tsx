import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

export interface FilterValues {
  country: string;
  industry: string;
  status: string;
  assignedTo: string;
  revenueRange: string;
}

interface ClientsFilterProps {
  filters: FilterValues;
  onFilterChange: (key: keyof FilterValues, value: string) => void;
  onClearFilters: () => void;
  countries: string[];
  industries: string[];
  users: { id: string; name: string }[];
}

export const ClientsFilter = ({
  filters,
  onFilterChange,
  onClearFilters,
  countries,
  industries,
  users,
}: ClientsFilterProps) => {
  const hasActiveFilters = Object.values(filters).some(value => value !== 'all');

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Filters</h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="h-8 text-xs"
          >
            <X className="h-3 w-3 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {/* Country Filter */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">Country</label>
          <Select value={filters.country} onValueChange={(value) => onFilterChange('country', value)}>
            <SelectTrigger>
              <SelectValue placeholder="All Countries" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Countries</SelectItem>
              {countries.map((country) => (
                <SelectItem key={country} value={country}>
                  {country}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Industry Filter */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">Industry</label>
          <Select value={filters.industry} onValueChange={(value) => onFilterChange('industry', value)}>
            <SelectTrigger>
              <SelectValue placeholder="All Industries" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Industries</SelectItem>
              {industries.map((industry) => (
                <SelectItem key={industry} value={industry}>
                  {industry}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Status Filter */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">Status</label>
          <Select value={filters.status} onValueChange={(value) => onFilterChange('status', value)}>
            <SelectTrigger>
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="negotiation">Negotiation</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Revenue Range Filter */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">Revenue</label>
          <Select value={filters.revenueRange} onValueChange={(value) => onFilterChange('revenueRange', value)}>
            <SelectTrigger>
              <SelectValue placeholder="All Revenue" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Revenue</SelectItem>
              <SelectItem value="0-500">$0 - $500</SelectItem>
              <SelectItem value="500-999">$500 - $1K</SelectItem>
              <SelectItem value="1000-4999">$1K - $5K</SelectItem>
              <SelectItem value="5000-9999">$5K - $10K</SelectItem>
              <SelectItem value="10000-49999">$10K - $50K</SelectItem>
              <SelectItem value="50000+">$50K+</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Assigned To Filter */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">Assigned To</label>
          <Select value={filters.assignedTo} onValueChange={(value) => onFilterChange('assignedTo', value)}>
            <SelectTrigger>
              <SelectValue placeholder="All Users" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
              <SelectItem value="unassigned">Unassigned</SelectItem>
              {users.map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  {user.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};