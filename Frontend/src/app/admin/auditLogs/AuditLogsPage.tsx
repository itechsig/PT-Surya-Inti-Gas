import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Skeleton } from '../../components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { listAuditLogs } from './api';
import { AuditLogDetailDialog } from './AuditLogDetailDialog';
import { ACTION_TYPE_LABELS, ENTITY_TYPE_LABELS, isRestorable, type AuditLogRecord } from './types';

const dateTimeFormatter = new Intl.DateTimeFormat('id-ID', {
  day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit',
});

function actionLabel(actionType: string): string {
  return ACTION_TYPE_LABELS[actionType] ?? actionType;
}

function actionBadgeVariant(actionType: string): 'default' | 'secondary' | 'destructive' | 'outline' {
  if (actionType === 'delete_user' || actionType === 'deactivate_user') return 'destructive';
  if (actionType === 'create_user' || actionType === 'activate_user') return 'default';
  return 'secondary';
}

export function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLogRecord[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [actionFilter, setActionFilter] = useState('all');
  const [entityFilter, setEntityFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState<AuditLogRecord | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await listAuditLogs({ action_type: actionFilter, entity_type: entityFilter, page: currentPage });
      setLogs(res.data.data);
      setLastPage(res.data.last_page);
      setTotal(res.data.total);
    } catch {
      toast.error('Gagal memuat log aktivitas');
    } finally {
      setIsLoading(false);
    }
  }, [actionFilter, entityFilter, currentPage]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    setCurrentPage(1);
  }, [actionFilter, entityFilter]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Log Aktivitas</h1>
        <p className="text-muted-foreground">Riwayat tindakan yang dilakukan oleh seluruh role di dashboard admin.</p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <div>
            <CardTitle>Riwayat Tindakan</CardTitle>
            <CardDescription>{isLoading ? 'Memuat...' : `${total} catatan ditemukan`}</CardDescription>
          </div>
          <div className="flex gap-2">
            <Select value={entityFilter} onValueChange={setEntityFilter}>
              <SelectTrigger className="w-44">
                <SelectValue placeholder="Semua Modul" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Modul</SelectItem>
                {Object.entries(ENTITY_TYPE_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="w-52">
                <SelectValue placeholder="Semua Tindakan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Tindakan</SelectItem>
                {Object.entries(ACTION_TYPE_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex flex-col gap-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-14 w-full" />
              ))}
            </div>
          ) : logs.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">Belum ada aktivitas tercatat.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tindakan</TableHead>
                  <TableHead>Dilakukan Oleh</TableHead>
                  <TableHead>Target</TableHead>
                  <TableHead>Waktu</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow
                    key={log.id}
                    className="cursor-pointer"
                    onClick={() => setSelectedLog(log)}
                  >
                    <TableCell>
                      <Badge variant={actionBadgeVariant(log.action_type)}>{actionLabel(log.action_type)}</Badge>
                      <div className="mt-1 text-xs text-muted-foreground">{log.description}</div>
                    </TableCell>
                    <TableCell>
                      {log.user ? (
                        <div>
                          <div className="text-sm font-medium">{log.user.name}</div>
                          <div className="text-xs text-muted-foreground">{log.user.email}</div>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">Sistem</span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {log.entity_type ? `${ENTITY_TYPE_LABELS[log.entity_type] ?? log.entity_type}${log.entity_id ? ` #${log.entity_id}` : ''}` : '—'}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {dateTimeFormatter.format(new Date(log.created_at))}
                    </TableCell>
                    <TableCell className="text-sm">
                      {log.reverted_at ? (
                        <Badge variant="outline">Dipulihkan</Badge>
                      ) : isRestorable(log) ? (
                        <span className="text-xs text-muted-foreground">Dapat dipulihkan</span>
                      ) : (
                        '—'
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {!isLoading && lastPage > 1 && (
            <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
              <span>Halaman {currentPage} dari {lastPage}</span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                >
                  Sebelumnya
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage >= lastPage}
                  onClick={() => setCurrentPage((p) => Math.min(lastPage, p + 1))}
                >
                  Berikutnya
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <AuditLogDetailDialog
        open={!!selectedLog}
        onOpenChange={(open) => !open && setSelectedLog(null)}
        log={selectedLog}
        onRestored={load}
      />
    </div>
  );
}
