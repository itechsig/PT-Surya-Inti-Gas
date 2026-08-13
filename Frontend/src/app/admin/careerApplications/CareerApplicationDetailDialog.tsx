import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Download } from 'lucide-react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '../../components/ui/dialog';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { downloadCareerApplicationCv, updateCareerApplication } from './api';
import { STATUS_LABELS, type ApplicationStatus, type CareerApplication } from './types';

interface CareerApplicationDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  application: CareerApplication | null;
  onSaved: () => void;
}

export function CareerApplicationDetailDialog({ open, onOpenChange, application, onSaved }: CareerApplicationDetailDialogProps) {
  const [status, setStatus] = useState<ApplicationStatus>('pending');
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    if (!open || !application) return;
    setStatus(application.status);
    setNotes(application.notes ?? '');
  }, [open, application]);

  if (!application) return null;

  const handleDownloadCv = async () => {
    setIsDownloading(true);
    try {
      await downloadCareerApplicationCv(application.id, application.nama);
    } catch {
      toast.error('Gagal mengunduh CV');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateCareerApplication(application.id, { status, notes });
      toast.success('Status lamaran berhasil diperbarui');
      onSaved();
      onOpenChange(false);
    } catch {
      toast.error('Gagal memperbarui status lamaran');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{application.nama}</DialogTitle>
          <DialogDescription>Melamar posisi {application.posisi}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-2">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <Label className="text-muted-foreground">Email</Label>
              <p>{application.email}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">No. HP</Label>
              <p>{application.no_hp ?? '-'}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Pendidikan</Label>
              <p>{application.pendidikan ?? '-'}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Pengalaman</Label>
              <p>{application.pengalaman ?? '-'}</p>
            </div>
            <div className="col-span-2">
              <Label className="text-muted-foreground">Alamat</Label>
              <p>{application.alamat ?? '-'}</p>
            </div>
          </div>

          {application.cover_letter && (
            <div>
              <Label className="text-muted-foreground">Cover Letter</Label>
              <p className="mt-1 whitespace-pre-wrap rounded-md border p-3 text-sm">{application.cover_letter}</p>
            </div>
          )}

          {application.ai_summary && (
            <div>
              <Label className="text-muted-foreground">Ringkasan AI {application.ai_score !== null && `(Skor: ${application.ai_score})`}</Label>
              <p className="mt-1 rounded-md border p-3 text-sm">{application.ai_summary}</p>
            </div>
          )}

          <div className="flex items-center justify-between rounded-md border p-3">
            <div>
              <p className="text-sm font-medium">CV / Resume</p>
              <p className="text-xs text-muted-foreground">
                Dilamar pada {new Date(application.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={handleDownloadCv} disabled={isDownloading || !application.cv_path}>
              <Download className="h-4 w-4" />
              {isDownloading ? 'Mengunduh...' : 'Unduh CV'}
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="status">Status Lamaran</Label>
              <Select value={status} onValueChange={(value) => setStatus(value as ApplicationStatus)}>
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(STATUS_LABELS) as ApplicationStatus[]).map((s) => (
                    <SelectItem key={s} value={s}>{STATUS_LABELS[s]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-muted-foreground">Direview oleh</Label>
              <p className="text-sm">{application.reviewed_by?.name ?? '-'}</p>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="notes">Catatan Internal</Label>
            <Textarea id="notes" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Catatan untuk tim HR (tidak terlihat pelamar)" />
          </div>
        </div>

        <DialogFooter>
          <Badge variant="outline" className="mr-auto">{STATUS_LABELS[application.status]} saat ini</Badge>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Tutup</Button>
          <Button type="button" onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
