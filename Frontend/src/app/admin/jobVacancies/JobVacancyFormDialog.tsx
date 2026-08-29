import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Plus, X } from 'lucide-react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '../../components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Label } from '../../components/ui/label';
import { Switch } from '../../components/ui/switch';
import { Button } from '../../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { ApiError } from '../../../utils/apiClient';
import { createJobVacancy, updateJobVacancy } from './api';
import { JOB_LEVELS, type AdminJobVacancy, type JobVacancyFormValues } from './types';

const EMPTY_FORM: JobVacancyFormValues = {
  title_id: '', title_en: '', title_zh: '',
  division_id: '', division_en: '', division_zh: '',
  location_id: '', location_en: '', location_zh: '',
  type_id: 'Penuh Waktu', type_en: 'Full-time', type_zh: '全职',
  level_id: 'Entry-level', level_en: '', level_zh: '',
  description_id: '', description_en: '', description_zh: '',
  full_description_id: '', full_description_en: '', full_description_zh: '',
  requirements_id: [], requirements_en: [], requirements_zh: [],
  deadline: '', is_active: true,
};

interface JobVacancyFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  job: AdminJobVacancy | null;
  onSaved: () => void;
}

export function JobVacancyFormDialog({ open, onOpenChange, job, onSaved }: JobVacancyFormDialogProps) {
  const [values, setValues] = useState<JobVacancyFormValues>(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (job) {
      setValues({
        title_id: job.title_id, title_en: job.title_en ?? '', title_zh: job.title_zh ?? '',
        division_id: job.division_id, division_en: job.division_en ?? '', division_zh: job.division_zh ?? '',
        location_id: job.location_id, location_en: job.location_en ?? '', location_zh: job.location_zh ?? '',
        type_id: job.type_id, type_en: job.type_en ?? '', type_zh: job.type_zh ?? '',
        level_id: job.level_id, level_en: job.level_en ?? '', level_zh: job.level_zh ?? '',
        description_id: job.description_id, description_en: job.description_en ?? '', description_zh: job.description_zh ?? '',
        full_description_id: job.full_description_id ?? '', full_description_en: job.full_description_en ?? '', full_description_zh: job.full_description_zh ?? '',
        requirements_id: job.requirements_id ?? [], requirements_en: job.requirements_en ?? [], requirements_zh: job.requirements_zh ?? [],
        deadline: job.deadline, is_active: job.is_active,
      });
    } else {
      setValues(EMPTY_FORM);
    }
    setErrors({});
  }, [open, job]);

  const field = (key: keyof JobVacancyFormValues) => ({
    value: values[key] as string,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setValues((prev) => ({ ...prev, [key]: e.target.value })),
  });

  const fieldError = (key: string) => errors[key]?.[0];

  const requirementsKey = (lang: 'id' | 'en' | 'zh') => `requirements_${lang}` as const;

  const addRequirement = (lang: 'id' | 'en' | 'zh') => {
    const key = requirementsKey(lang);
    setValues((prev) => ({ ...prev, [key]: [...prev[key], ''] }));
  };

  const updateRequirement = (lang: 'id' | 'en' | 'zh', index: number, value: string) => {
    const key = requirementsKey(lang);
    setValues((prev) => ({ ...prev, [key]: prev[key].map((r, i) => (i === index ? value : r)) }));
  };

  const removeRequirement = (lang: 'id' | 'en' | 'zh', index: number) => {
    const key = requirementsKey(lang);
    setValues((prev) => ({ ...prev, [key]: prev[key].filter((_, i) => i !== index) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrors({});
    try {
      const payload = {
        ...values,
        requirements_id: values.requirements_id.filter((r) => r.trim() !== ''),
        requirements_en: values.requirements_en.filter((r) => r.trim() !== ''),
        requirements_zh: values.requirements_zh.filter((r) => r.trim() !== ''),
      };
      if (job) {
        await updateJobVacancy(job.id, payload);
        toast.success('Lowongan berhasil diperbarui');
      } else {
        await createJobVacancy(payload);
        toast.success('Lowongan berhasil ditambahkan');
      }
      onSaved();
      onOpenChange(false);
    } catch (error) {
      if (error instanceof ApiError && error.errors) {
        setErrors(error.errors);
        toast.error(error.message);
      } else {
        toast.error('Gagal menyimpan lowongan');
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{job ? 'Edit Lowongan Kerja' : 'Tambah Lowongan Kerja'}</DialogTitle>
            <DialogDescription>
              Isi konten untuk setiap bahasa. Bahasa Indonesia wajib diisi; Inggris &amp; Mandarin opsional
              (akan otomatis memakai teks Indonesia jika kosong).
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-4">
            <Tabs defaultValue="id">
              <TabsList>
                <TabsTrigger value="id">Indonesia</TabsTrigger>
                <TabsTrigger value="en">English</TabsTrigger>
                <TabsTrigger value="zh">中文</TabsTrigger>
              </TabsList>
              {(['id', 'en', 'zh'] as const).map((lang) => (
                <TabsContent key={lang} value={lang} className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor={`title_${lang}`}>Posisi</Label>
                    <Input id={`title_${lang}`} {...field(`title_${lang}` as keyof JobVacancyFormValues)} />
                    {fieldError(`title_${lang}`) && <p className="text-xs text-destructive">{fieldError(`title_${lang}`)}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor={`division_${lang}`}>Divisi</Label>
                      <Input id={`division_${lang}`} {...field(`division_${lang}` as keyof JobVacancyFormValues)} />
                      {fieldError(`division_${lang}`) && <p className="text-xs text-destructive">{fieldError(`division_${lang}`)}</p>}
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor={`location_${lang}`}>Lokasi</Label>
                      <Input id={`location_${lang}`} {...field(`location_${lang}` as keyof JobVacancyFormValues)} />
                      {fieldError(`location_${lang}`) && <p className="text-xs text-destructive">{fieldError(`location_${lang}`)}</p>}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor={`type_${lang}`}>Tipe Pekerjaan</Label>
                      <Input id={`type_${lang}`} {...field(`type_${lang}` as keyof JobVacancyFormValues)} />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor={`level_${lang}`}>Level</Label>
                      <Input id={`level_${lang}`} {...field(`level_${lang}` as keyof JobVacancyFormValues)} />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor={`description_${lang}`}>Deskripsi Singkat</Label>
                    <Textarea id={`description_${lang}`} rows={2} {...field(`description_${lang}` as keyof JobVacancyFormValues)} />
                    {fieldError(`description_${lang}`) && <p className="text-xs text-destructive">{fieldError(`description_${lang}`)}</p>}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor={`full_description_${lang}`}>Deskripsi Lengkap</Label>
                    <Textarea id={`full_description_${lang}`} rows={4} {...field(`full_description_${lang}` as keyof JobVacancyFormValues)} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Persyaratan</Label>
                    {values[requirementsKey(lang)].map((req, i) => (
                      <div key={i} className="flex gap-2">
                        <Input value={req} onChange={(e) => updateRequirement(lang, i, e.target.value)} placeholder="misal: Pendidikan minimal S1" />
                        <Button type="button" variant="ghost" size="icon" onClick={() => removeRequirement(lang, i)} aria-label={`Hapus persyaratan ${i + 1}`}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button type="button" variant="outline" size="sm" onClick={() => addRequirement(lang)} className="w-fit">
                      <Plus className="h-4 w-4" />
                      Tambah Persyaratan
                    </Button>
                  </div>
                </TabsContent>
              ))}
            </Tabs>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="level-select">Level (untuk filter)</Label>
                <Select value={values.level_id} onValueChange={(value) => setValues((prev) => ({ ...prev, level_id: value }))}>
                  <SelectTrigger id="level-select">
                    <SelectValue placeholder="Pilih level" />
                  </SelectTrigger>
                  <SelectContent>
                    {JOB_LEVELS.map((lvl) => (
                      <SelectItem key={lvl.value} value={lvl.value}>{lvl.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="deadline">Batas Lamaran</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={values.deadline}
                  onChange={(e) => setValues((prev) => ({ ...prev, deadline: e.target.value }))}
                />
                {fieldError('deadline') && <p className="text-xs text-destructive">{fieldError('deadline')}</p>}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Switch
                id="is_active"
                checked={values.is_active}
                onCheckedChange={(checked) => setValues((prev) => ({ ...prev, is_active: checked }))}
              />
              <Label htmlFor="is_active">Aktif (tampil di website)</Label>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
