import { useState } from 'react';
import { Check, ChevronsUpDown, Plus } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../../components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../../components/ui/command';
import { cn } from '../../components/ui/utils';

interface EntityOption {
  id: number;
  name: string;
}

interface EntityComboboxProps {
  options: EntityOption[];
  selectedId: string;
  newName: string;
  onSelectExisting: (id: string) => void;
  onCreateNew: (name: string) => void;
  placeholder: string;
}

/**
 * Combobox for industry/service-type: pick from the existing list, or type a value that
 * isn't in it yet to create a new one on submit. Mirrors shadcn's combobox recipe (Popover +
 * Command) since these fields previously used a plain <Select> that forced picking from a
 * fixed list with no way to add anything new.
 */
export function EntityCombobox({ options, selectedId, newName, onSelectExisting, onCreateNew, placeholder }: EntityComboboxProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  const selectedOption = options.find((o) => String(o.id) === selectedId);
  const triggerLabel = selectedOption?.name || newName || placeholder;
  const exactMatch = options.find((o) => o.name.toLowerCase() === query.trim().toLowerCase());

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn('w-full justify-between font-normal', !selectedOption && !newName && 'text-muted-foreground')}
        >
          <span className="truncate">
            {triggerLabel}
            {newName && <span className="text-muted-foreground"> (baru)</span>}
          </span>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput placeholder="Cari atau ketik baru..." value={query} onValueChange={setQuery} />
          <CommandList>
            <CommandEmpty>
              {query.trim() ? (
                <button
                  type="button"
                  className="flex w-full items-center gap-2 px-2 py-1.5 text-sm hover:bg-accent"
                  onClick={() => {
                    onCreateNew(query.trim());
                    setOpen(false);
                    setQuery('');
                  }}
                >
                  <Plus className="h-4 w-4" />
                  Tambah baru: "{query.trim()}"
                </button>
              ) : (
                'Tidak ada hasil.'
              )}
            </CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.id}
                  value={option.name}
                  onSelect={() => {
                    onSelectExisting(String(option.id));
                    setOpen(false);
                    setQuery('');
                  }}
                >
                  <Check className={cn('h-4 w-4', selectedId === String(option.id) ? 'opacity-100' : 'opacity-0')} />
                  {option.name}
                </CommandItem>
              ))}
              {query.trim() && !exactMatch && (
                <CommandItem
                  value={`__create__${query}`}
                  onSelect={() => {
                    onCreateNew(query.trim());
                    setOpen(false);
                    setQuery('');
                  }}
                >
                  <Plus className="h-4 w-4" />
                  Tambah baru: "{query.trim()}"
                </CommandItem>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
