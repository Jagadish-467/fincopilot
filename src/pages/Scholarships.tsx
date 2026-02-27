import { useState } from 'react';
import { motion } from 'framer-motion';
import { Pencil, Plus, Trash2, Check, GraduationCap, Sparkles, TrendingDown } from 'lucide-react';
import { Scholarship } from '@/types/finance';
import { useAppContext } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTranslation } from 'react-i18next';

const initialScholarships: Scholarship[] = [
  { id: '1', name: 'NSP Merit Scholarship', deadline: '2026-04-15', amount: 25000, status: 'submitted' },
  { id: '2', name: 'State BC Welfare Fund', deadline: '2026-03-30', amount: 50000, status: 'draft' },
  { id: '3', name: 'AICTE Pragati', deadline: '2026-05-01', amount: 30000, status: 'awarded' },
];

const recommendedScholarships = [
  { id: 'r1', name: 'MHRD Central Sector Scheme', amount: 20000, savingsProjection: '₹50,000 loan reduction, cuts 8 months off EMI', match: '92%' },
  { id: 'r2', name: 'Vidyalakshmi Portal Grant', amount: 35000, savingsProjection: '₹87,500 loan reduction, cuts 14 months off EMI', match: '85%' },
  { id: 'r3', name: 'Inspire SHE Scholarship', amount: 80000, savingsProjection: '₹2,00,000 loan reduction, cuts 2 years off EMI', match: '78%' },
];

const defaultColumns = ['Draft', 'Submitted', 'Awarded'];
const statusMap: Record<string, Scholarship['status']> = { Draft: 'draft', Submitted: 'submitted', Awarded: 'awarded' };

const Scholarships = () => {
  const { t } = useTranslation();
  const { scholarshipEnabled } = useAppContext();
  const [scholarships, setScholarships] = useState<Scholarship[]>(initialScholarships);
  const [columns, setColumns] = useState(defaultColumns);
  const [editingCol, setEditingCol] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', deadline: '', amount: '' });

  if (!scholarshipEnabled) {
    return (
      <div className="max-w-5xl mx-auto px-4 lg:px-8 py-20 text-center">
        <GraduationCap className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
        <h2 className="text-lg font-semibold text-foreground">{t('scholarships.disabled')}</h2>
        <p className="text-sm text-muted-foreground mt-1">{t('scholarships.disabledHelp')}</p>
      </div>
    );
  }

  const handleRenameColumn = (idx: number) => { if (editValue.trim()) setColumns((prev) => prev.map((c, i) => (i === idx ? editValue : c))); setEditingCol(null); };
  const handleAdd = () => { if (!form.name || !form.amount) return; setScholarships((prev) => [...prev, { id: Date.now().toString(), name: form.name, deadline: form.deadline, amount: parseFloat(form.amount), status: 'draft' }]); setForm({ name: '', deadline: '', amount: '' }); setShowForm(false); };

  return (
    <div className="max-w-5xl mx-auto px-4 lg:px-8 py-6 lg:py-10 space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">{t('scholarships.title')}</h1>
          <p className="text-muted-foreground text-sm mt-1">{t('scholarships.subtitle')}</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} size="sm" className="gap-1"><Plus className="h-4 w-4" /> {t('scholarships.add')}</Button>
      </motion.div>

      {showForm && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="surface-card p-5">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <Input placeholder={t('scholarships.name')} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <Input type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
            <Input placeholder={t('scholarships.amount')} type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
            <Button onClick={handleAdd}>{t('scholarships.save')}</Button>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {columns.map((col, colIdx) => {
          const status = statusMap[defaultColumns[colIdx]] || 'draft';
          const items = scholarships.filter((s) => s.status === status);
          return (
            <motion.div key={colIdx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: colIdx * 0.1 }} className="surface-card p-4">
              <div className="flex items-center justify-between mb-4">
                {editingCol === colIdx ? (
                  <div className="flex items-center gap-1 flex-1">
                    <Input value={editValue} onChange={(e) => setEditValue(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleRenameColumn(colIdx)} className="h-7 text-sm" autoFocus />
                    <button onClick={() => handleRenameColumn(colIdx)} className="text-primary"><Check className="h-4 w-4" /></button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-foreground">{col}</h3>
                    <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">{items.length}</span>
                    <button onClick={() => { setEditingCol(colIdx); setEditValue(col); }} className="text-muted-foreground hover:text-foreground"><Pencil className="h-3 w-3" /></button>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                {items.map((s) => (
                  <motion.div key={s.id} whileHover={{ y: -2 }} className="p-3 rounded-lg bg-muted/50 border border-border/50 group">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-2">
                        <GraduationCap className="h-4 w-4 text-primary mt-0.5" />
                        <div><p className="text-sm font-medium text-foreground">{s.name}</p><p className="text-xs text-muted-foreground mt-0.5">₹{s.amount.toLocaleString('en-IN')} · Due {s.deadline}</p></div>
                      </div>
                      <button onClick={() => setScholarships((prev) => prev.filter((x) => x.id !== s.id))} className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all"><Trash2 className="h-3.5 w-3.5" /></button>
                    </div>
                  </motion.div>
                ))}
                {items.length === 0 && <p className="text-xs text-muted-foreground text-center py-6">{t('scholarships.noApplications')}</p>}
              </div>
            </motion.div>
          );
        })}
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" /> {t('scholarships.aiRecommended')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {recommendedScholarships.map((rs) => (
            <motion.div key={rs.id} whileHover={{ y: -2 }} className="surface-card p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div><p className="text-sm font-semibold text-foreground">{rs.name}</p><p className="text-xs text-muted-foreground mt-0.5">₹{rs.amount.toLocaleString('en-IN')}{t('scholarships.year')}</p></div>
                <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full">{rs.match} {t('scholarships.match')}</span>
              </div>
              <div className="flex items-start gap-2 p-2 rounded-lg bg-primary/5 border border-primary/10"><TrendingDown className="h-3.5 w-3.5 text-primary flex-shrink-0 mt-0.5" /><p className="text-xs text-primary font-medium">{rs.savingsProjection}</p></div>
              <Button variant="outline" size="sm" className="w-full text-xs">{t('scholarships.applyNow')}</Button>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Scholarships;
