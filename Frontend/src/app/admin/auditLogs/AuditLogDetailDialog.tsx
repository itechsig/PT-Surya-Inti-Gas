import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../../components/ui/dialog';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '../../components/ui/alert-dialog';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { useAuth } from '../../../context/AuthContext';
import { ApiError } from '../../../utils/apiClient';
import { restoreAuditLog } from './api';
import { ACTION_TYPE_LABELS, isRestorable, type AuditLogRecord } from './types';

const dateTimeFormatter = new Intl.DateTimeFormat('id-ID', {
  day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit',
});

function formatValue(value: unknown): string {
  if (value === null || value === undefined || value === '') return '—';
  if (typeof value === 'boolean') return value ? 'Ya' : 'Tidak';
  if (Array.isArray(value)) return value.length ? value.join(', ') : '—';
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

interface AuditLogDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  log: AuditLogRecord | null;
  onRestored: () => void;
}

export function AuditLogDetailDialog({ open, onOpenChange, log, onRestored }: AuditLogDetailDialogProps) {
  const { hasRole } = useAuth();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  const keys = useMemo(() => {
    if (!log) return [];
    const old = log.old_values ?? {};
    const next = log.new_values ?? {};
    return Array.from(new Set([...Object.keys(old), ...Object.keys(next)])).filter((k) => k !== 'permissions');
  }, [log]);

  if (!log) return null;

  const canRestore = hasRole('super_admin') && isRestorable(log);

  const handleRestore = async () => {
    setIsRestoring(true);
    try {
      await restoreAuditLog(log.id);
      toast.success('Aktivitas berhasil dipulihkan');
      setConfirmOpen(false);
      onRestored();
      onOpenChange(false);
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : 'Gagal memulihkan aktivitas');
    } finally {
      setIsRestoring(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>{ACTION_TYPE_LABELS[log.action_type] ?? log.action_type}</DialogTitle>
            <DialogDescription>{log.description}</DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-2 text-sm">
            <div className="grid grid-cols-2 gap-3 rounded-md border p-3 text-muted-foreground">
              <div>
                <div className="text-xs uppercase tracking-wide">Dilakukan Oleh</div>
                <div className="text-foreground">{log.user ? `${log.user.name} (${log.user.email})` : 'Sistem'}</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wide">Waktu</div>
                <div className="text-foreground">{dateTimeFormatter.format(new Date(log.created_at))}</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wide">Alamat IP</div>
                <div className="text-foreground">{log.ip_address ?? '—'}</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wide">Status</div>
                <div className="text-foreground">
                  {log.reverted_at ? (
                    <Badge variant="outline">
                      Dipulihkan {dateTimeFormatter.format(new Date(log.reverted_at))}
                      {log.reverted_by_user ? ` oleh ${log.reverted_by_user.name}` : ''}
                    </Badge>
                  ) : (
                    '—'
                  )}
                </div>
              </div>
            </div>

            {keys.length > 0 && (
              <div className="flex flex-col gap-2">
                <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Perubahan Data</div>
                <div className="overflow-x-auto rounded-md border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50 text-left text-xs uppercase text-muted-foreground">
                        <th scope="col" className="p-2">Field</th>
                        <th scope="col" className="p-2">Sebelum</th>
                        <th scope="col" className="p-2">Sesudah</th>
                      </tr>
                    </thead>
                    <tbody>
                      {keys.map((key) => {
                        const oldVal = log.old_values?.[key];
                        const newVal = log.new_values?.[key];
                        const changed = JSON.stringify(oldVal) !== JSON.stringify(newVal);
                        return (
                          <tr key={key} className="border-b last:border-0">
                            <td className="p-2 font-medium text-muted-foreground">{key}</td>
                            <td className={`p-2 ${changed ? 'text-destructive' : ''}`}>{formatValue(oldVal)}</td>
                            <td className={`p-2 ${changed ? 'font-medium text-emerald-600' : ''}`}>{formatValue(newVal)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            {canRestore && (
              <Button variant="destructive" onClick={() => setConfirmOpen(true)}>
                Pulihkan
              </Button>
            )}
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Pulihkan aktivitas ini?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini akan mengembalikan data terkait ke kondisi sebelum aktivitas "{log.description}" dilakukan.
              Aksi ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction disabled={isRestoring} onClick={handleRestore}>
              {isRestoring ? 'Memulihkan...' : 'Pulihkan'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
