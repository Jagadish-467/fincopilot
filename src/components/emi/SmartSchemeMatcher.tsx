import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Trophy, Medal, Shield, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { universities, degreeTypes, loanSchemes, LoanScheme } from '@/data/loanSchemes';
import { useTranslation } from 'react-i18next';

interface Props {
  onCompareInSandbox: (scheme: LoanScheme) => void;
}

const SmartSchemeMatcher = ({ onCompareInSandbox }: Props) => {
  const { t } = useTranslation();
  const [university, setUniversity] = useState('');
  const [degree, setDegree] = useState('');
  const [loanAmount, setLoanAmount] = useState(800000);
  const [showResults, setShowResults] = useState(false);
  const [uniSearch, setUniSearch] = useState('');

  const filteredUnis = useMemo(() => {
    if (!uniSearch) return universities;
    return universities.filter((u) => u.name.toLowerCase().includes(uniSearch.toLowerCase()));
  }, [uniSearch]);

  const selectedTier = universities.find((u) => u.name === university)?.tier || 'C';

  const results = useMemo(() => {
    if (!showResults) return [];
    return loanSchemes
      .filter((s) => s.tiers.includes(selectedTier) && s.maxAmount >= loanAmount)
      .sort((a, b) => a.interestRate - b.interestRate)
      .slice(0, 3);
  }, [showResults, selectedTier, loanAmount]);

  const rankIcons = [
    { icon: Trophy, label: t('matcher.winner'), color: 'text-warning' },
    { icon: Medal, label: t('matcher.runnerUp'), color: 'text-primary' },
    { icon: Shield, label: t('matcher.backup'), color: 'text-muted-foreground' },
  ];

  return (
    <div className="space-y-5">
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-foreground mb-1.5 block">{t('matcher.university')}</label>
          <Select value={university} onValueChange={setUniversity}>
            <SelectTrigger><SelectValue placeholder={t('matcher.selectUniversity')} /></SelectTrigger>
            <SelectContent>
              <div className="px-2 pb-2">
                <Input placeholder={t('matcher.searchUniversity')} value={uniSearch} onChange={(e) => setUniSearch(e.target.value)} className="h-8 text-sm" />
              </div>
              {filteredUnis.map((u) => (
                <SelectItem key={u.name} value={u.name}>
                  {u.name} <span className="text-xs text-muted-foreground ml-1">({t('matcher.tier')} {u.tier})</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium text-foreground mb-1.5 block">{t('matcher.degreeType')}</label>
          <Select value={degree} onValueChange={setDegree}>
            <SelectTrigger><SelectValue placeholder={t('matcher.selectDegree')} /></SelectTrigger>
            <SelectContent>
              {degreeTypes.map((d) => (<SelectItem key={d} value={d}>{d}</SelectItem>))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-foreground">{t('matcher.loanAmount')}</label>
            <span className="text-sm font-semibold text-primary">₹{loanAmount.toLocaleString('en-IN')}</span>
          </div>
          <Slider value={[loanAmount]} onValueChange={(v) => setLoanAmount(v[0])} min={100000} max={5000000} step={50000} />
        </div>

        <Button
          onClick={() => setShowResults(true)}
          disabled={!university || !degree}
          className="w-full gap-2"
        >
          <Search className="h-4 w-4" />
          {t('matcher.findMatch')}
        </Button>
      </div>

      <AnimatePresence>
        {results.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-3">
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-primary" />
              {t('matcher.resultsFor')} <strong>{university}</strong> — {t('matcher.tier')} {selectedTier}
            </p>
            {results.map((scheme, i) => {
              const Rank = rankIcons[i] || rankIcons[2];
              return (
                <motion.div
                  key={scheme.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`surface-card p-4 space-y-2 ${i === 0 ? 'ring-2 ring-primary/30' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Rank.icon className={`h-4 w-4 ${Rank.color}`} />
                      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{Rank.label}</span>
                    </div>
                    <span className="text-lg font-bold text-primary">{scheme.interestRate}%</span>
                  </div>
                  <h3 className="text-sm font-semibold text-foreground">{scheme.schemeName}</h3>
                  <p className="text-xs text-muted-foreground">{scheme.bankName}</p>
                  <div className="flex flex-wrap gap-2 text-xs">
                    {!scheme.collateralRequired && (
                      <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">{t('matcher.noCollateral')}</span>
                    )}
                    <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                      {t('matcher.maxLabel')} ₹{(scheme.maxAmount / 100000).toFixed(0)}L
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                      {scheme.moratoriumYears}yr {t('matcher.moratorium')}
                    </span>
                    {scheme.processingFee === 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">{t('matcher.zeroFee')}</span>
                    )}
                  </div>
                  <Button variant="outline" size="sm" className="w-full gap-1 mt-1" onClick={() => onCompareInSandbox(scheme)}>
                    {t('matcher.compareInSandbox')} <ArrowRight className="h-3 w-3" />
                  </Button>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SmartSchemeMatcher;
