import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Loader2, Leaf } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';

const Auth = () => {
  const { t } = useTranslation();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [hasScholarship, setHasScholarship] = useState(false);
  const [scholarshipAmount, setScholarshipAmount] = useState('');

  const { login, updateProfile } = useAppContext();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!email || !password) {
      toast({ title: t('auth.missingFields'), description: t('auth.enterEmailPassword'), variant: 'destructive' });
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setShowOnboarding(true);
  };

  const handleOnboardingComplete = () => {
    updateProfile({
      hasScholarship,
      scholarshipAmount: hasScholarship ? parseFloat(scholarshipAmount) || 0 : 0,
    });
    login();
    navigate('/dashboard');
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setShowOnboarding(true);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <AnimatePresence mode="wait">
        {!showOnboarding ? (
          <motion.div key="auth" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="w-full max-w-md">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 mb-4">
                <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
                  <Leaf className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-2xl font-bold text-foreground">FinCopilot</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {mode === 'login' ? t('auth.welcomeBack') : t('auth.createAccount')}
              </p>
            </div>

            <div className="surface-card p-6 space-y-4">
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">{t('auth.email')}</label>
                  <Input type="email" placeholder="you@college.edu" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">{t('auth.password')}</label>
                  <div className="relative">
                    <Input type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="pr-10" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <Button onClick={handleSubmit} disabled={loading} className="w-full gap-2">
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {mode === 'login' ? t('auth.signIn') : t('auth.createAccountBtn')}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-card px-3 text-muted-foreground">{t('auth.orContinueWith')}</span>
                </div>
              </div>

              <Button variant="outline" onClick={handleGoogleAuth} disabled={loading} className="w-full gap-2 bg-card hover:bg-muted">
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                {t('auth.continueGoogle')}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                {mode === 'login' ? t('auth.noAccount') : t('auth.haveAccount')}{' '}
                <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')} className="text-primary font-medium hover:underline">
                  {mode === 'login' ? t('auth.register') : t('auth.signInLink')}
                </button>
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div key="onboarding" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="w-full max-w-md">
            <div className="surface-card p-6 space-y-5">
              <div className="text-center">
                <h2 className="text-xl font-bold text-foreground">{t('auth.onboardingTitle')}</h2>
                <p className="text-sm text-muted-foreground mt-1">{t('auth.onboardingSubtitle')}</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">{t('auth.scholarshipQuestion')}</p>
                    <p className="text-xs text-muted-foreground">{t('auth.scholarshipHelp')}</p>
                  </div>
                  <Switch checked={hasScholarship} onCheckedChange={setHasScholarship} />
                </div>
                <AnimatePresence>
                  {hasScholarship && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                      <label className="text-sm font-medium text-foreground mb-1 block">{t('auth.scholarshipAmount')}</label>
                      <Input type="number" placeholder="e.g. 50000" value={scholarshipAmount} onChange={(e) => setScholarshipAmount(e.target.value)} />
                      <p className="text-xs text-primary mt-1.5">{t('auth.scholarshipDeduction')}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <Button onClick={handleOnboardingComplete} className="w-full">{t('auth.continueDashboard')}</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Auth;
