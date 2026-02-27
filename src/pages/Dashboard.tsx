import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, ArrowUpRight, ArrowDownLeft, TrendingUp, TrendingDown, Wallet, PiggyBank } from 'lucide-react';
import { mockOverview, mockTransactions } from '@/data/mockData';
import { Transaction } from '@/types/finance';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '@/contexts/AppContext';

const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
};

const Dashboard = () => {
  const { t } = useTranslation();
  const { userProfile } = useAppContext();
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [note, setNote] = useState('');

  const overview = mockOverview;
  const dynamicExpenses = transactions.filter((tx) => tx.type === 'expense').reduce((s, tx) => s + tx.amount, 0);
  const dynamicIncome = transactions.filter((tx) => tx.type === 'income').reduce((s, tx) => s + tx.amount, 0);
  const savings = dynamicIncome - dynamicExpenses;

  const handleAddTransaction = () => {
    if (!amount || !category) return;
    const newTx: Transaction = { id: Date.now().toString(), amount: parseFloat(amount), category, date: new Date().toISOString().split('T')[0], note: note || undefined, type: 'expense' };
    setTransactions((prev) => [newTx, ...prev]);
    setAmount(''); setCategory(''); setNote('');
  };

  const displayName = userProfile.firstName || 'there';

  return (
    <div className="max-w-5xl mx-auto px-4 lg:px-8 py-6 lg:py-10 space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">{getGreeting()}, {displayName} 👋</h1>
        <p className="text-muted-foreground text-sm mt-1">{t('dashboard.snapshot')}</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: t('dashboard.totalBalance'), value: overview.totalBalance, icon: Wallet, positive: true },
          { label: t('dashboard.monthlyIncome'), value: dynamicIncome, icon: TrendingUp, positive: true },
          { label: t('dashboard.monthlyExpenses'), value: dynamicExpenses, icon: TrendingDown, positive: false },
          { label: 'Your Savings', value: savings, icon: PiggyBank, positive: savings >= 0 },
        ].map((card) => (
          <div key={card.label} className="surface-card p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground font-medium">{card.label}</span>
              <card.icon className={`h-4 w-4 ${card.positive ? 'text-primary' : 'text-destructive'}`} />
            </div>
            <p className={`text-xl lg:text-2xl font-bold ${card.positive ? 'text-foreground' : 'text-destructive'}`}>₹{card.value.toLocaleString('en-IN')}</p>
          </div>
        ))}
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="surface-card p-5">
        <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <Plus className="h-4 w-4 text-primary" /> {t('dashboard.logTransaction')}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <Input placeholder={t('dashboard.amount')} type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
          <Input placeholder={t('dashboard.category')} value={category} onChange={(e) => setCategory(e.target.value)} />
          <Input placeholder={t('dashboard.noteOptional')} value={note} onChange={(e) => setNote(e.target.value)} />
          <Button onClick={handleAddTransaction} className="w-full">{t('dashboard.addEntry')}</Button>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="surface-card p-5">
        <h2 className="text-sm font-semibold text-foreground mb-4">{t('dashboard.recentTransactions')}</h2>
        <div className="space-y-1">
          <AnimatePresence initial={false}>
            {transactions.slice(0, 6).map((tx) => (
              <motion.div key={tx.id} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 25 }} className="flex items-center justify-between py-3 px-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${tx.type === 'income' ? 'bg-primary/10' : 'bg-destructive/10'}`}>
                    {tx.type === 'income' ? <ArrowDownLeft className="h-4 w-4 text-primary" /> : <ArrowUpRight className="h-4 w-4 text-destructive" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{tx.category}</p>
                    <p className="text-xs text-muted-foreground">{tx.note || tx.date}</p>
                  </div>
                </div>
                <span className={`text-sm font-semibold ${tx.type === 'income' ? 'text-primary' : 'text-foreground'}`}>
                  {tx.type === 'income' ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN')}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
