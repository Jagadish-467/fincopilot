import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Camera, Save, LogOut, Globe, Sun, Moon, Monitor } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockOverview, mockTransactions } from '@/data/mockData';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/hooks/use-toast';

const Settings = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { logout, scholarshipEnabled, setScholarshipEnabled, language, setLanguage, userProfile, updateProfile } = useAppContext();
  const [firstName, setFirstName] = useState(userProfile.firstName);
  const [lastName, setLastName] = useState(userProfile.lastName);
  const [profilePreview, setProfilePreview] = useState<string | null>(userProfile.profilePhoto);
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');

  const totalBalance = mockOverview.totalBalance;
  const monthlyIncome = mockTransactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { setProfilePreview(URL.createObjectURL(file)); }
  };

  const handleSave = () => {
    updateProfile({ firstName, lastName, profilePhoto: profilePreview });
    toast({ title: 'Profile saved!' });
  };

  const handleLanguageChange = (v: 'en' | 'hi' | 'te') => {
    setLanguage(v);
    i18n.changeLanguage(v);
  };

  const handleThemeChange = (value: 'light' | 'dark' | 'system') => {
    setTheme(value);
    const root = document.documentElement;
    if (value === 'dark') root.classList.add('dark');
    else if (value === 'light') root.classList.remove('dark');
    else { if (window.matchMedia('(prefers-color-scheme: dark)').matches) root.classList.add('dark'); else root.classList.remove('dark'); }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/auth');
  };

  return (
    <div className="max-w-lg mx-auto px-4 lg:px-8 py-6 lg:py-10 space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">{t('settings.title')}</h1>
        <p className="text-muted-foreground text-sm mt-1">{t('settings.subtitle')}</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="grid grid-cols-2 gap-3">
        <div className="surface-card p-4"><p className="text-xs text-muted-foreground mb-1">{t('settings.totalBalance')}</p><p className="text-lg font-bold text-foreground">₹{totalBalance.toLocaleString('en-IN')}</p></div>
        <div className="surface-card p-4"><p className="text-xs text-muted-foreground mb-1">{t('settings.monthlyIncome')}</p><p className="text-lg font-bold text-primary">₹{monthlyIncome.toLocaleString('en-IN')}</p></div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="surface-card p-6 flex flex-col items-center">
        <div className="relative mb-4">
          <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center overflow-hidden">
            {profilePreview ? <img src={profilePreview} alt="Profile" className="h-full w-full object-cover" /> : <User className="h-10 w-10 text-muted-foreground" />}
          </div>
          <label className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity">
            <Camera className="h-4 w-4" /><input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          </label>
        </div>
        <p className="text-xs text-muted-foreground">{t('settings.uploadPhoto')}</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="surface-card p-5 space-y-4">
        <div><label className="text-sm font-medium text-foreground mb-1 block">{t('settings.firstName')}</label><Input value={firstName} onChange={(e) => setFirstName(e.target.value)} /></div>
        <div><label className="text-sm font-medium text-foreground mb-1 block">{t('settings.lastName')}</label><Input value={lastName} onChange={(e) => setLastName(e.target.value)} /></div>
        <Button onClick={handleSave} className="w-full gap-2"><Save className="h-4 w-4" /> {t('settings.saveChanges')}</Button>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="surface-card p-5">
        <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2"><Globe className="h-4 w-4 text-primary" /> {t('settings.language')}</h2>
        <Select value={language} onValueChange={(v) => handleLanguageChange(v as 'en' | 'hi' | 'te')}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="hi">हिन्दी (Hindi)</SelectItem>
            <SelectItem value="te">తెలుగు (Telugu)</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="surface-card p-5">
        <h2 className="text-sm font-semibold text-foreground mb-3">{t('settings.theme')}</h2>
        <div className="flex gap-2">
          {[
            { value: 'light' as const, icon: Sun, label: t('settings.light') },
            { value: 'dark' as const, icon: Moon, label: t('settings.dark') },
            { value: 'system' as const, icon: Monitor, label: t('settings.system') },
          ].map((opt) => (
            <button key={opt.value} onClick={() => handleThemeChange(opt.value)} className={`flex-1 flex flex-col items-center gap-1.5 py-3 rounded-lg border transition-all ${theme === opt.value ? 'border-primary bg-primary/5 text-primary' : 'border-border text-muted-foreground hover:bg-muted/50'}`}>
              <opt.icon className="h-4 w-4" /><span className="text-xs font-medium">{opt.label}</span>
            </button>
          ))}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="surface-card p-5">
        <h2 className="text-sm font-semibold text-foreground mb-4">{t('settings.featureToggles')}</h2>
        <div className="flex items-center justify-between">
          <div><p className="text-sm font-medium text-foreground">{t('settings.enableScholarship')}</p><p className="text-xs text-muted-foreground">{t('settings.scholarshipNav')}</p></div>
          <Switch checked={scholarshipEnabled} onCheckedChange={setScholarshipEnabled} />
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
        <Button variant="outline" onClick={handleLogout} className="w-full gap-2 text-destructive border-destructive/30 hover:bg-destructive/10"><LogOut className="h-4 w-4" /> {t('settings.logout')}</Button>
      </motion.div>
    </div>
  );
};

export default Settings;
