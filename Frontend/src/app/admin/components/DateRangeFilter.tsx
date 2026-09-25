import { useState } from 'react';
import { CalendarIcon } from 'lucide-react';
import type { DateRange } from 'react-day-picker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '../../components/ui/popover';
import { Calendar } from '../../components/ui/calendar';
import { Button } from '../../components/ui/button';
import type { AnalyticsRange, AnalyticsRangeParams } from '../analytics/types';

const PRESETS: { value: AnalyticsRange; label: string }[] = [
  { value: '7d', label: '7 Hari' },
  { value: '30d', label: '30 Hari' },
  { value: '90d', label: '3 Bulan' },
  { value: '180d', label: '6 Bulan' },
  { value: '365d', label: '1 Tahun' },
  { value: 'custom', label: 'Custom' },
];

function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/**
 * The date-range filter for the admin Analytics dashboard — 7d/30d/90d/180d/365d
 * presets + a custom range picker. Built entirely from shadcn primitives already in
 * the design system (Select/Popover/Calendar) that were installed but unused until now.
 */
export function DateRangeFilter({
  value,
  onChange,
}: {
  value: AnalyticsRangeParams;
  onChange: (next: AnalyticsRangeParams) => void;
}) {
  const [customOpen, setCustomOpen] = useState(false);
  const [draftRange, setDraftRange] = useState<DateRange | undefined>(
    value.start && value.end ? { from: new Date(value.start), to: new Date(value.end) } : undefined
  );

  const handlePresetChange = (next: string) => {
    if (next === 'custom') {
      setCustomOpen(true);
      onChange({ range: 'custom', start: value.start, end: value.end });
      return;
    }
    onChange({ range: next as AnalyticsRange });
  };

  const applyCustomRange = () => {
    if (draftRange?.from && draftRange?.to) {
      onChange({ range: 'custom', start: toIsoDate(draftRange.from), end: toIsoDate(draftRange.to) });
      setCustomOpen(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select value={value.range} onValueChange={handlePresetChange}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Periode" />
        </SelectTrigger>
        <SelectContent>
          {PRESETS.map((preset) => (
            <SelectItem key={preset.value} value={preset.value}>
              {preset.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {value.range === 'custom' && (
        <Popover open={customOpen} onOpenChange={setCustomOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <CalendarIcon className="h-4 w-4" />
              {value.start && value.end ? `${value.start} — ${value.end}` : 'Pilih tanggal'}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-auto p-0">
            <Calendar
              mode="range"
              selected={draftRange}
              onSelect={setDraftRange}
              numberOfMonths={2}
              defaultMonth={draftRange?.from}
            />
            <div className="flex justify-end gap-2 border-t p-3">
              <Button size="sm" onClick={applyCustomRange} disabled={!draftRange?.from || !draftRange?.to}>
                Terapkan
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}
