import { GripVertical, X } from 'lucide-react';
import {
  DndContext, closestCenter, PointerSensor, useSensor, useSensors, type DragEndEvent,
} from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy, useSortable, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';

export interface GalleryManagerItem {
  id: string;
  url: string;
}

interface SortableThumbProps {
  item: GalleryManagerItem;
  onRemove: (id: string) => void;
  disabled?: boolean;
}

function SortableThumb({ item, onRemove, disabled }: SortableThumbProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
    disabled,
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="group relative h-24 w-24 shrink-0">
      <img src={item.url} alt="Galeri" className="h-24 w-24 rounded-md border object-cover" />
      {!disabled && (
        <>
          <button
            type="button"
            {...attributes}
            {...listeners}
            className="absolute left-1 top-1 flex h-6 w-6 cursor-grab items-center justify-center rounded bg-black/50 text-white active:cursor-grabbing"
          >
            <GripVertical className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onRemove(item.id)}
            className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-destructive-foreground"
          >
            <X className="h-3 w-3" />
          </button>
        </>
      )}
    </div>
  );
}

interface PortfolioGalleryManagerProps {
  items: GalleryManagerItem[];
  onReorder: (items: GalleryManagerItem[]) => void;
  onRemove: (id: string) => void;
  onAddFiles: (files: File[]) => void;
  disabled?: boolean;
}

/** Drag-and-drop sortable gallery grid, backed by @dnd-kit. */
export function PortfolioGalleryManager({ items, onReorder, onRemove, onAddFiles, disabled }: PortfolioGalleryManagerProps) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = items.findIndex((i) => i.id === active.id);
    const newIndex = items.findIndex((i) => i.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    onReorder(arrayMove(items, oldIndex, newIndex));
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length) onAddFiles(files);
    e.target.value = '';
  };

  return (
    <div className="flex flex-col gap-2">
      <Label>Galeri Proyek</Label>
      <p className="text-xs text-muted-foreground">Seret gambar untuk mengubah urutan tampilan.</p>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items.map((i) => i.id)} strategy={rectSortingStrategy}>
          <div className="flex flex-wrap gap-2">
            {items.map((item) => (
              <SortableThumb key={item.id} item={item} onRemove={onRemove} disabled={disabled} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
      {!disabled && (
        <Input type="file" accept="image/png,image/jpeg,image/webp" multiple onChange={handleFileInput} />
      )}
    </div>
  );
}
