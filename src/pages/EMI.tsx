import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, ShieldAlert, Lightbulb, Loader2, TrendingUp, Search, GitCompareArrows } from 'lucide-react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, Line } from 'recharts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslation } from 'react-i18next';
import SmartSchemeMatcher from '@/components/emi/SmartSchemeMatcher';
import PreLoanSandbox from '@/components/emi/PreLoanSandbox';
import { LoanScheme } from '@/data/loanSchemes';

interface SimVar { label: string; key: string; value: number; min: number; max: number; step: number; prefix?: string; suffix?: string; }

const EMI = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('matcher');
  const [prefillScheme, setPrefillScheme] = useState<LoanScheme | null>(null);

  // Loan Decompiler state
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);

  // EMI Calculator state
  const [principal, setPrincipal] = useState(800000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenure, setTenure] = useState(10);
  const [monthlyPayment, setMonthlyPayment] = useState(10000);

  const handleCompareInSandbox = (scheme: LoanScheme) => {
    setPrefillScheme(scheme);
    setActiveTab('sandbox');
  };

  const handleFileDrop = (e: React.DragEvent) => { e.preventDefault(); const file = e.dataTransfer.files[0]; if (file?.type === 'application/pdf') setUploadedFile(file); };
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => { const file = e.target.files?.[0]; if (file) setUploadedFile(file); };
  const handleAnalyze = async () => { if (!uploadedFile) return; setIsAnalyzing(true); await new Promise((r) => setTimeout(r, 2500)); setIsAnalyzing(false); setAnalysisComplete(true); };

  const variables: SimVar[] = [
    { label: t('emi.principalAmount'), key: 'principal', value: principal, min: 100000, max: 5000000, step: 50000, prefix: '₹' },
    { label: t('emi.interestRate'), key: 'interestRate', value: interestRate, min: 1, max: 20, step: 0.5, suffix: '%' },
    { label: t('emi.tenure'), key: 'tenure', value: tenure, min: 1, max: 30, step: 1, suffix: 'yrs' },
    { label: t('emi.monthlyPayment'), key: 'monthlyPayment', value: monthlyPayment, min: 1000, max: 50000, step: 500, prefix: '₹' },
  ];

  const setters: Record<string, (v: number) => void> = { principal: setPrincipal, interestRate: setInterestRate, tenure: setTenure, monthlyPayment: setMonthlyPayment };

  const chartData = useMemo(() => {
    const data = []; const monthlyRate = interestRate / 100 / 12; let balanceA = principal; let balanceB = principal;
    const standardEMI = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenure * 12)) / (Math.pow(1 + monthlyRate, tenure * 12) - 1);
    for (let m = 0; m <= tenure * 12; m++) {
      if (m % 3 === 0) data.push({ month: `${Math.floor(m / 12)}y${m % 12 ? ` ${m % 12}m` : ''}`, scenarioA: Math.max(0, Math.round(balanceA)), scenarioB: Math.max(0, Math.round(balanceB)) });
      if (m < tenure * 12) { balanceA = balanceA * (1 + monthlyRate) - monthlyPayment; balanceB = balanceB * (1 + monthlyRate) - standardEMI; }
    }
    return data;
  }, [principal, interestRate, tenure, monthlyPayment]);

  const finalA = chartData[chartData.length - 1]?.scenarioA || 0;
  const standardEMI = useMemo(() => { const r = interestRate / 100 / 12; return Math.round((principal * r * Math.pow(1 + r, tenure * 12)) / (Math.pow(1 + r, tenure * 12) - 1)); }, [principal, interestRate, tenure]);

  const suggestions = [
    { condition: monthlyPayment < standardEMI, text: `Your payment ₹${monthlyPayment.toLocaleString('en-IN')} is below the standard EMI of ₹${standardEMI.toLocaleString('en-IN')}. You won't fully repay the loan in ${tenure} years.` },
    { condition: monthlyPayment > standardEMI * 1.2, text: `Great! Paying ₹${(monthlyPayment - standardEMI).toLocaleString('en-IN')} extra/month could save you lakhs in interest and close the loan years early.` },
    { condition: interestRate > 9, text: 'Consider refinancing. Government education loans often offer rates between 7-9%. Even 1% less saves significantly over the loan term.' },
  ].filter((s) => s.condition);

  return (
    <div className="max-w-5xl mx-auto px-4 lg:px-8 py-6 lg:py-10 space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">{t('emi.title')}</h1>
        <p className="text-muted-foreground text-sm mt-1">{t('emi.subtitle')}</p>
      </motion.div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 mb-4">
          <TabsTrigger value="matcher" className="gap-1 text-xs sm:text-sm">
            <Search className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">{t('matcher.tab')}</span>
            <span className="sm:hidden">{t('matcher.tabShort')}</span>
          </TabsTrigger>
          <TabsTrigger value="sandbox" className="gap-1 text-xs sm:text-sm">
            <GitCompareArrows className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">{t('sandbox.tab')}</span>
            <span className="sm:hidden">{t('sandbox.tabShort')}</span>
          </TabsTrigger>
          <TabsTrigger value="decompiler" className="gap-1 text-xs sm:text-sm">
            <FileText className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">{t('emi.loanDecompiler')}</span>
            <span className="sm:hidden">PDF</span>
          </TabsTrigger>
          <TabsTrigger value="calculator" className="gap-1 text-xs sm:text-sm">
            <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">{t('emi.calculator')}</span>
            <span className="sm:hidden">EMI</span>
          </TabsTrigger>
        </TabsList>

        {/* Smart Scheme Matcher */}
        <TabsContent value="matcher">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="surface-card p-5">
            <h2 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <Search className="h-4 w-4 text-primary" />
              {t('matcher.title')}
            </h2>
            <SmartSchemeMatcher onCompareInSandbox={handleCompareInSandbox} />
          </motion.div>
        </TabsContent>

        {/* Pre-Loan Sandbox */}
        <TabsContent value="sandbox">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="surface-card p-5">
            <h2 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <GitCompareArrows className="h-4 w-4 text-primary" />
              {t('sandbox.title')}
            </h2>
            <PreLoanSandbox prefillScheme={prefillScheme} />
          </motion.div>
        </TabsContent>

        {/* Loan Decompiler */}
        <TabsContent value="decompiler">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="surface-card p-5">
              <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2"><FileText className="h-4 w-4 text-primary" /> {t('emi.loanDecompiler')}</h2>
              <div onDragOver={(e) => e.preventDefault()} onDrop={handleFileDrop} className="border-2 border-dashed border-border rounded-xl p-10 text-center hover:border-primary/50 transition-colors">
                {uploadedFile ? (
                  <div className="space-y-2"><FileText className="h-10 w-10 text-primary mx-auto" /><p className="text-sm font-medium text-foreground">{uploadedFile.name}</p><p className="text-xs text-muted-foreground">{(uploadedFile.size / 1024).toFixed(1)} KB</p></div>
                ) : (
                  <div className="space-y-3"><Upload className="h-10 w-10 text-muted-foreground mx-auto" /><p className="text-sm text-muted-foreground">{t('emi.dragDrop')}</p><label className="inline-block"><span className="text-xs text-primary cursor-pointer hover:underline">{t('emi.browseFiles')}</span><input type="file" accept=".pdf" onChange={handleFileSelect} className="hidden" /></label></div>
                )}
              </div>
              {uploadedFile && !analysisComplete && (
                <Button onClick={handleAnalyze} disabled={isAnalyzing} className="w-full mt-4 gap-2">
                  {isAnalyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
                  {isAnalyzing ? t('emi.analyzing') : t('emi.analyzeBtn')}
                </Button>
              )}
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              {isAnalyzing && (<div className="surface-card p-5 space-y-3"><div className="h-4 w-3/4 bg-muted animate-pulse rounded" /><div className="h-4 w-1/2 bg-muted animate-pulse rounded" /><div className="h-20 w-full bg-muted animate-pulse rounded-lg" /><div className="h-4 w-2/3 bg-muted animate-pulse rounded" /></div>)}
              {analysisComplete && (
                <>
                  <div className="surface-card p-5">
                    <h3 className="text-sm font-semibold text-foreground mb-3">{t('emi.extractedDetails')}</h3>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      {[{ label: t('emi.principal'), value: '₹8,00,000' }, { label: t('emi.interestRate'), value: '8.5% p.a.' }, { label: t('emi.moratorium'), value: '4 years' }, { label: t('emi.calculatedAmount'), value: '₹11,12,949' }].map((d) => (
                        <div key={d.label} className="p-3 rounded-lg bg-muted/50"><p className="text-xs text-muted-foreground">{d.label}</p><p className="font-semibold text-foreground">{d.value}</p></div>
                      ))}
                    </div>
                  </div>
                  <div className="surface-card p-5 bg-destructive/5 border-destructive/20">
                    <h3 className="text-sm font-semibold text-destructive mb-2 flex items-center gap-2"><ShieldAlert className="h-4 w-4" /> {t('emi.darkSecrets')}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{t('emi.darkSecretsText')}</p>
                  </div>
                  <div className="surface-card p-5 border-primary/20 bg-primary/5">
                    <h3 className="text-sm font-semibold text-primary mb-2 flex items-center gap-2"><Lightbulb className="h-4 w-4" /> {t('emi.optimalPath')}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{t('emi.optimalPathText')}</p>
                  </div>
                </>
              )}
              {!isAnalyzing && !analysisComplete && (
                <div className="surface-card p-5 flex flex-col items-center justify-center h-full text-center">
                  <FileText className="h-10 w-10 text-muted-foreground/30 mb-3" /><p className="text-sm text-muted-foreground">{t('emi.uploadPrompt')}</p>
                </div>
              )}
            </motion.div>
          </div>
        </TabsContent>

        {/* EMI Calculator */}
        <TabsContent value="calculator" className="space-y-6">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="surface-card p-6 space-y-5">
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2"><TrendingUp className="h-4 w-4 text-primary" /> {t('emi.calculator')}</h2>
            {variables.map((v) => (
              <div key={v.key}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">{v.label}</span>
                  <div className="flex items-center gap-1">
                    {v.prefix && <span className="text-xs text-muted-foreground">{v.prefix}</span>}
                    <Input type="number" value={v.value} onChange={(e) => { const num = parseFloat(e.target.value); if (!isNaN(num)) setters[v.key](Math.min(v.max, Math.max(v.min, num))); }} className="w-28 h-7 text-sm text-right font-semibold text-primary" />
                    {v.suffix && <span className="text-xs text-muted-foreground">{v.suffix}</span>}
                  </div>
                </div>
                <Slider value={[v.value]} onValueChange={(val) => setters[v.key](val[0])} min={v.min} max={v.max} step={v.step} />
              </div>
            ))}
            <div className="flex items-center justify-between pt-2 border-t border-border">
              <span className="text-sm text-muted-foreground">{t('emi.standardEMI')}</span>
              <span className="text-sm font-bold text-primary">₹{standardEMI.toLocaleString('en-IN')}/month</span>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="surface-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-foreground flex items-center gap-2"><TrendingUp className="h-4 w-4 text-primary" /> {t('emi.repaymentProjection')}</h2>
              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-primary" /> {t('emi.yourPlan')}</span>
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-muted-foreground" /> {t('emi.standardEMILabel')}</span>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs><linearGradient id="scenarioAGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="hsl(101, 22%, 61%)" stopOpacity={0.3} /><stop offset="95%" stopColor="hsl(101, 22%, 61%)" stopOpacity={0} /></linearGradient></defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => `₹${(v / 100000).toFixed(1)}L`} />
                  <Tooltip formatter={(value: number, name: string) => [`₹${value.toLocaleString('en-IN')}`, name === 'scenarioA' ? t('emi.yourPlan') : t('emi.standardEMILabel')]} contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))', fontSize: '12px' }} />
                  <Area type="monotone" dataKey="scenarioA" stroke="hsl(101, 22%, 61%)" fill="url(#scenarioAGrad)" strokeWidth={2} />
                  <Line type="monotone" dataKey="scenarioB" stroke="hsl(var(--muted-foreground))" strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            {finalA > 0 && <p className="text-xs text-destructive mt-2 text-center">⚠️ With ₹{monthlyPayment.toLocaleString('en-IN')}/month, you'll still owe ₹{finalA.toLocaleString('en-IN')} after {tenure} years.</p>}
          </motion.div>

          {suggestions.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
              {suggestions.map((s, i) => (<div key={i} className="surface-card p-4 flex items-start gap-3"><Lightbulb className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" /><p className="text-sm text-muted-foreground">{s.text}</p></div>))}
            </motion.div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EMI;
