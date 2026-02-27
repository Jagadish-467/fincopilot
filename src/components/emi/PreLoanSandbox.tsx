import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { GitCompareArrows, TrendingUp, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line, LineChart, Legend } from 'recharts';
import { LoanScheme } from '@/data/loanSchemes';
import { useTranslation } from 'react-i18next';

interface BankInputs {
  name: string;
  principal: number;
  rate: number;
  tenure: number;
  moratorium: number;
}

interface Props {
  prefillScheme: LoanScheme | null;
}

const defaultBank: BankInputs = { name: '', principal: 800000, rate: 8.5, tenure: 10, moratorium: 4 };

const PreLoanSandbox = ({ prefillScheme }: Props) => {
  const { t } = useTranslation();
  const [bankA, setBankA] = useState<BankInputs>(
    prefillScheme
      ? { name: `${prefillScheme.bankName} — ${prefillScheme.schemeName}`, principal: 800000, rate: prefillScheme.interestRate, tenure: 10, moratorium: prefillScheme.moratoriumYears }
      : { ...defaultBank, name: t('sandbox.bankA') }
  );
  const [bankB, setBankB] = useState<BankInputs>({ ...defaultBank, name: t('sandbox.bankB'), rate: 9.5, moratorium: 5 });
  const [showChart, setShowChart] = useState(false);

  const updateBank = (setter: React.Dispatch<React.SetStateAction<BankInputs>>, field: keyof BankInputs, val: number | string) => {
    setter((prev) => ({ ...prev, [field]: val }));
  };

  const chartData = useMemo(() => {
    if (!showChart) return [];
    const data: { year: string; bankA: number; bankB: number }[] = [];
    const calcDebt = (bank: BankInputs) => {
      const r = bank.rate / 100;
      let balance = bank.principal;
      const balances: number[] = [balance];
      for (let y = 1; y <= bank.tenure + bank.moratorium; y++) {
        if (y <= bank.moratorium) {
          balance = balance * (1 + r);
        } else {
          const monthlyRate = bank.rate / 100 / 12;
          const remainingMonths = (bank.tenure + bank.moratorium - y + 1) * 12;
          const emi = (balance * monthlyRate * Math.pow(1 + monthlyRate, remainingMonths)) / (Math.pow(1 + monthlyRate, remainingMonths) - 1);
          for (let m = 0; m < 12; m++) {
            balance = balance * (1 + monthlyRate) - emi;
          }
        }
        balances.push(Math.max(0, Math.round(balance)));
      }
      return balances;
    };

    const balsA = calcDebt(bankA);
    const balsB = calcDebt(bankB);
    const maxLen = Math.max(balsA.length, balsB.length);
    for (let i = 0; i < maxLen; i++) {
      data.push({
        year: `${t('sandbox.yr')}${i}`,
        bankA: balsA[i] ?? 0,
        bankB: balsB[i] ?? 0,
      });
    }
    return data;
  }, [showChart, bankA, bankB, t]);

  const totalPaidA = useMemo(() => {
    if (!showChart) return 0;
    const r = bankA.rate / 100;
    let bal = bankA.principal;
    for (let y = 0; y < bankA.moratorium; y++) bal *= (1 + r);
    const monthlyRate = bankA.rate / 100 / 12;
    const months = bankA.tenure * 12;
    const emi = (bal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
    return Math.round(emi * months);
  }, [showChart, bankA]);

  const totalPaidB = useMemo(() => {
    if (!showChart) return 0;
    const r = bankB.rate / 100;
    let bal = bankB.principal;
    for (let y = 0; y < bankB.moratorium; y++) bal *= (1 + r);
    const monthlyRate = bankB.rate / 100 / 12;
    const months = bankB.tenure * 12;
    const emi = (bal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
    return Math.round(emi * months);
  }, [showChart, bankB]);

  const diff = Math.abs(totalPaidA - totalPaidB);
  const winner = totalPaidA < totalPaidB ? bankA.name || t('sandbox.bankA') : bankB.name || t('sandbox.bankB');
  const loser = totalPaidA < totalPaidB ? bankB.name || t('sandbox.bankB') : bankA.name || t('sandbox.bankA');

  const BankForm = ({ bank, setter, label }: { bank: BankInputs; setter: React.Dispatch<React.SetStateAction<BankInputs>>; label: string }) => (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-foreground">{label}</h3>
      <Input placeholder={t('sandbox.bankNamePlaceholder')} value={bank.name} onChange={(e) => updateBank(setter, 'name', e.target.value)} className="h-8 text-sm" />
      {[
        { label: t('sandbox.rate'), key: 'rate' as const, val: bank.rate, min: 5, max: 18, step: 0.1, suffix: '%' },
        { label: t('sandbox.tenure'), key: 'tenure' as const, val: bank.tenure, min: 1, max: 25, step: 1, suffix: 'yrs' },
        { label: t('sandbox.moratorium'), key: 'moratorium' as const, val: bank.moratorium, min: 0, max: 6, step: 1, suffix: 'yrs' },
      ].map((f) => (
        <div key={f.key}>
          <div className="flex justify-between mb-1">
            <span className="text-xs text-muted-foreground">{f.label}</span>
            <span className="text-xs font-semibold text-primary">{f.val}{f.suffix}</span>
          </div>
          <Slider value={[f.val]} onValueChange={(v) => updateBank(setter, f.key, v[0])} min={f.min} max={f.max} step={f.step} />
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-5">
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-foreground">{t('sandbox.principal')}</label>
          <span className="text-sm font-semibold text-primary">₹{bankA.principal.toLocaleString('en-IN')}</span>
        </div>
        <Slider value={[bankA.principal]} onValueChange={(v) => { updateBank(setBankA, 'principal', v[0]); updateBank(setBankB, 'principal', v[0]); }} min={100000} max={5000000} step={50000} />
        <p className="text-xs text-muted-foreground mt-1">{t('sandbox.sharedPrincipal')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <BankForm bank={bankA} setter={setBankA} label={t('sandbox.bankALabel')} />
        <BankForm bank={bankB} setter={setBankB} label={t('sandbox.bankBLabel')} />
      </div>

      <Button onClick={() => setShowChart(true)} className="w-full gap-2">
        <GitCompareArrows className="h-4 w-4" />
        {t('sandbox.compare')}
      </Button>

      {showChart && chartData.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="surface-card p-5">
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              {t('sandbox.debtCurve')}
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="year" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => `₹${(v / 100000).toFixed(1)}L`} />
                  <Tooltip
                    formatter={(value: number, name: string) => [`₹${value.toLocaleString('en-IN')}`, name === 'bankA' ? (bankA.name || t('sandbox.bankA')) : (bankB.name || t('sandbox.bankB'))]}
                    contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))', fontSize: '12px' }}
                  />
                  <Legend formatter={(v) => v === 'bankA' ? (bankA.name || t('sandbox.bankA')) : (bankB.name || t('sandbox.bankB'))} />
                  <Line type="monotone" dataKey="bankA" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="bankB" stroke="hsl(var(--destructive))" strokeWidth={2} dot={false} strokeDasharray="5 5" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="surface-card p-5 border-primary/20 bg-primary/5">
            <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-warning" />
              {t('sandbox.verdict')}
            </h3>
            <p className="text-sm text-foreground leading-relaxed">
              <strong>{winner}</strong> {t('sandbox.verdictSaves')} <span className="text-primary font-bold">₹{diff.toLocaleString('en-IN')}</span> {t('sandbox.verdictComparedTo')} <strong>{loser}</strong> {t('sandbox.verdictOverLife')}.
            </p>
            <div className="grid grid-cols-2 gap-3 mt-3 text-sm">
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground">{bankA.name || t('sandbox.bankA')} {t('sandbox.totalRepayment')}</p>
                <p className="font-semibold text-foreground">₹{totalPaidA.toLocaleString('en-IN')}</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground">{bankB.name || t('sandbox.bankB')} {t('sandbox.totalRepayment')}</p>
                <p className="font-semibold text-foreground">₹{totalPaidB.toLocaleString('en-IN')}</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default PreLoanSandbox;
