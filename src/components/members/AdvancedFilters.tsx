import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, FilterIcon } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface FilterOptions {
  search: string;
  status: string;
  dateRange: {
    from: Date | null;
    to: Date | null;
  };
  type?: string;
}

interface AdvancedFiltersProps {
  options: FilterOptions;
  onFilterChange: (options: FilterOptions) => void;
  types?: Array<{ value: string; label: string }>;
  showTypeFilter?: boolean;
}

export function AdvancedFilters({
  options,
  onFilterChange,
  types = [],
  showTypeFilter = false,
}: AdvancedFiltersProps) {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...options, search: e.target.value });
  };

  const handleStatusChange = (value: string) => {
    onFilterChange({ ...options, status: value });
  };

  const handleTypeChange = (value: string) => {
    onFilterChange({ ...options, type: value });
  };

  const handleDateChange = (range: { from: Date | null; to: Date | null }) => {
    onFilterChange({ ...options, dateRange: range });
  };

  return (
    <div className="flex flex-wrap gap-4 items-center mb-6">
      <div className="flex-1 min-w-[200px]">
        <Input
          placeholder="Rechercher..."
          value={options.search}
          onChange={handleSearchChange}
          className="w-full"
        />
      </div>

      <Select value={options.status} onValueChange={handleStatusChange}>
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Statut" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tous</SelectItem>
          <SelectItem value="active">Actifs</SelectItem>
          <SelectItem value="completed">Terminés</SelectItem>
        </SelectContent>
      </Select>

      {showTypeFilter && (
        <Select value={options.type} onValueChange={handleTypeChange}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous</SelectItem>
            {types.map(type => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-[250px] justify-start">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {options.dateRange.from ? (
              options.dateRange.to ? (
                <>
                  {format(options.dateRange.from, 'P', { locale: fr })} -{' '}
                  {format(options.dateRange.to, 'P', { locale: fr })}
                </>
              ) : (
                format(options.dateRange.from, 'P', { locale: fr })
              )
            ) : (
              <span>Sélectionner les dates</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={options.dateRange.from}
            selected={options.dateRange}
            onSelect={handleDateChange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>

      <Button
        variant="ghost"
        onClick={() =>
          onFilterChange({
            search: '',
            status: 'all',
            type: 'all',
            dateRange: { from: null, to: null },
          })
        }
      >
        Réinitialiser
      </Button>
    </div>
  );
}
