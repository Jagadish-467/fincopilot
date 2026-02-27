import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, ArrowUpRight, ArrowDownLeft, AlertTriangle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { mockBudgetCategories, mockTransactions, mockOverview } from '@/data/mockData';
import { BudgetCategory, Transaction } from '@/types/finance';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTranslation } from 'react-i18next';

const colorOptions = ['#6366f1', '#f59e0b', '#3b82f6', '#ec4899', '#8b5cf6', '#10b981', '#f97316', '#06b6d4'];

const Budget = () => {
  const { t } = useTranslation();
  const [categories, setCategories] = useState<BudgetCategory[]>(mockBudgetCategories);
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [newName, setNewName] = useState('');
  const [newLimit, setNewLimit] = useState('');
  const [selectedColor, setSelectedColor] = useState(colorOptions[0]);
  const [txAmount, setTxAmount] = useState('');
  const [txCategory, setTxCategory] = useState('');
  const [txType, setTxType] = useState<'income' | 'expense'>('expense');
  const [txNote, setTxNote] = useState('');

  const monthlyIncome = mockOverview.monthlyIncome;
  const totalSpent = transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const totalIncome = transactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalAllocated = categories.reduce((s, c) => s + c.allocated, 0);
  const chartData = categories.map((c) => ({ name: c.name, value: c.spent, color: c.colorHex }));

  const newLimitNum = parseFloat(newLimit) || 0;
  const wouldExceed = totalAllocated + newLimitNum > monthlyIncome;

  const handleAddCategory = () => {
    if (!newName || !newLimit || wouldExceed) return;
    setCategories((prev) => [...prev, { id: Date.now().toString(), name: newName, allocated: parseFloat(newLimit), spent: 0, colorHex: selectedColor }]);
    setNewName(''); setNewLimit('');
  };

  const handleAddTransaction = () => {
    if (!txAmount || !txCategory) return;
    const newTx: Transaction = { id: Date.now().toString(), amount: parseFloat(txAmount), category: txCategory, date: new Date().toISOString().split('T')[0], note: txNote || undefined, type: txType };
    setTransactions((prev) => [newTx, ...prev]);
    // Update category spent if expense
    if (txType === 'expense') {
      setCategories((prev) => prev.map((c) => c.name.toLowerCase() === txCategory.toLowerCase() ? { ...c, spent: c.spent + parseFloat(txAmount) } : c));
    }
    setTxAmount(''); setTxCategory(''); setTxNote('');
  };

  const handleDeleteTransaction = (id: string) => setTransactions((prev) => prev.filter((t) => t.id !== id));

  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-8 py-6 lg:py-10 space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">{t('budget.title')}</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {t('budget.income')}: ₹{totalIncome.toLocaleString('en-IN')} · {t('budget.expenses')}: ₹{totalSpent.toLocaleString('en-IN')} · {t('budget.net')}: ₹{(totalIncome - totalSpent).toLocaleString('en-IN')}
        </p>
      </motion.div>

      {/* Chart + Categories */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="surface-card p-6">
        <div className="flex flex-col lg:flex-row items-center gap-6">
          <div className="w-56 h-56 flex-shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={chartData} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={3} dataKey="value" strokeWidth={0}>
                  {chartData.map((entry, i) => (<Cell key={i} fill={entry.color} />))}
                </Pie>
                <Tooltip formatter={(value: number) => `₹${value.toLocaleString('en-IN')}`} contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex-1 space-y-2 w-full">
            {categories.map((cat) => {
              const pct = Math.min((cat.spent / cat.allocated) * 100, 100);
              return (
                <motion.div key={cat.id} whileHover={{ y: -1 }} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-all cursor-default">
                  <div className="h-3 w-3 rounded-full flex-shrink-0" style={{ backgroundColor: cat.colorHex }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium text-foreground truncate">{cat.name}</span>
                      <span className="text-muted-foreground">₹{cat.spent.toLocaleString('en-IN')} / ₹{cat.allocated.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: cat.colorHex }} />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Add Category with validation */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="surface-card p-5">
        <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2"><Plus className="h-4 w-4 text-primary" /> {t('budget.addCategory')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
          <Input placeholder={t('budget.categoryName')} value={newName} onChange={(e) => setNewName(e.target.value)} />
          <div>
            <Input placeholder={t('budget.monthlyLimit')} type="number" value={newLimit} onChange={(e) => setNewLimit(e.target.value)} />
            {wouldExceed && newLimit && (
              <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                Error: Total allocated budget cannot exceed your monthly income (₹{monthlyIncome.toLocaleString('en-IN')}).
              </p>
            )}
          </div>
          <Button onClick={handleAddCategory} disabled={wouldExceed || !newName || !newLimit} className="w-full">{t('budget.addCategoryBtn')}</Button>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-muted-foreground">{t('budget.color')}</span>
          {colorOptions.map((c) => (
            <button key={c} onClick={() => setSelectedColor(c)} className={`h-6 w-6 rounded-full transition-all ${selectedColor === c ? 'ring-2 ring-offset-2 ring-primary scale-110' : 'hover:scale-105'}`} style={{ backgroundColor: c }} />
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Allocated: ₹{totalAllocated.toLocaleString('en-IN')} / ₹{monthlyIncome.toLocaleString('en-IN')} income
        </p>
      </motion.div>

      {/* Add Transaction */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="surface-card p-5">
        <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2"><Plus className="h-4 w-4 text-primary" /> {t('budget.logTransaction')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          <Input placeholder={t('budget.amount')} type="number" value={txAmount} onChange={(e) => setTxAmount(e.target.value)} />
          <Select value={txType} onValueChange={(v) => setTxType(v as 'income' | 'expense')}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="income">{t('budget.incomeType')}</SelectItem>
              <SelectItem value="expense">{t('budget.expenseType')}</SelectItem>
            </SelectContent>
          </Select>
          <Select value={txCategory} onValueChange={setTxCategory}>
            <SelectTrigger><SelectValue placeholder={t('budget.category')} /></SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input placeholder={t('budget.noteOptional')} value={txNote} onChange={(e) => setTxNote(e.target.value)} />
          <Button onClick={handleAddTransaction} className="w-full">{t('budget.add')}</Button>
        </div>
      </motion.div>

      {/* Transaction List */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="surface-card p-5">
        <h2 className="text-sm font-semibold text-foreground mb-4">{t('budget.allTransactions')}</h2>
        <div className="space-y-1">
          <AnimatePresence initial={false}>
            {transactions.map((tx) => (
              <motion.div key={tx.id} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 25 }} className="flex items-center justify-between py-3 px-3 rounded-lg hover:bg-muted/50 transition-colors group">
                <div className="flex items-center gap-3">
                  <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${tx.type === 'income' ? 'bg-primary/10' : 'bg-destructive/10'}`}>
                    {tx.type === 'income' ? <ArrowDownLeft className="h-4 w-4 text-primary" /> : <ArrowUpRight className="h-4 w-4 text-destructive" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{tx.category}</p>
                    <p className="text-xs text-muted-foreground">{tx.note || tx.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-sm font-semibold ${tx.type === 'income' ? 'text-primary' : 'text-foreground'}`}>
                    {tx.type === 'income' ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN')}
                  </span>
                  <button onClick={() => handleDeleteTransaction(tx.id)} className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default Budget;
