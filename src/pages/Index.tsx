import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Leaf, ArrowRight, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

const Index = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="flex items-center justify-between px-6 lg:px-12 py-5">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center">
            <Leaf className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">FinCopilot</span>
        </div>
        <Link to="/auth">
          <Button variant="outline" size="sm" className="text-sm">
            {t('landing.login')}
          </Button>
        </Link>
      </header>

      <section className="flex-1 flex flex-col items-center justify-center px-6 py-16 lg:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="max-w-3xl text-center"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium mb-8">
            <Brain className="h-3.5 w-3.5" />
            {t('landing.badge')}
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] mb-6">
            <span className="text-foreground">{t('landing.title1')}</span>
            <span className="text-gradient-sage">{t('landing.titleAccent')}</span>
            <br className="hidden sm:block" />
            <span className="text-foreground">{t('landing.title2')}</span>
          </h1>

          <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed mb-10 max-w-xl mx-auto">
            {t('landing.subtitle')}
          </p>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
            <Link to="/auth">
              <Button size="lg" className="h-12 px-8 text-base font-semibold rounded-xl gap-2">
                {t('landing.cta')}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="border-t border-border py-8 px-6 text-center space-y-2"
      >
        <p className="text-sm font-semibold text-foreground tracking-wide">
          {t('landing.footer1')}
        </p>
        <p className="text-xs text-muted-foreground tracking-widest uppercase font-medium">
          {t('landing.footer2')}
        </p>
      </motion.footer>
    </div>
  );
};

export default Index;
