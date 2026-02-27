import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Loader2, Leaf } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import RainingRupees from '@/components/RainingRupees';

const Auth = () => {
  const { t } = useTranslation();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        navigate('/dashboard');
      }
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate('/dashboard');
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSubmit = async () => {
    if (!email || !password) {
      toast({ title: t('auth.missingFields'), description: t('auth.enterEmailPassword'), variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      if (mode === 'register') {
        if (!firstName) {
          toast({ title: 'First name required', variant: 'destructive' });
          setLoading(false);
          return;
        }
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { first_name: firstName, last_name: lastName },
            emailRedirectTo: window.location.origin,
          },
        });
        if (error) throw error;
        toast({ title: 'Check your email', description: 'We sent you a verification link to confirm your account.' });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 relative">
      <RainingRupees />

      <motion.div key="auth" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md relative z-10">
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

        <div className="bg-card rounded-xl border border-border shadow-xl p-6 space-y-4 isolate">
          <div className="space-y-3">
            <AnimatePresence>
              {mode === 'register' && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">First Name</label>
                    <Input placeholder="Priya" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">Last Name</label>
                    <Input placeholder="Sharma" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
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

          <p className="text-xs text-center text-muted-foreground">
            {mode === 'login' ? t('auth.noAccount') : t('auth.haveAccount')}{' '}
            <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')} className="text-primary font-medium hover:underline">
              {mode === 'login' ? t('auth.register') : t('auth.signInLink')}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
