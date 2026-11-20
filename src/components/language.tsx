import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { Languages } from 'lucide-react';
import { translate, type Language } from '@/lib/translations';

const LanguageContext = createContext<{ language: Language; setLanguage: (language: Language) => void; t: (text: string) => string }>({ language: 'en', setLanguage: () => {}, t: (text) => text });
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');
  useEffect(() => {
    const saved = localStorage.getItem('ahadu-language');
    if (saved === 'ti' || saved === 'am' || saved === 'en') setLanguage(saved);
  }, []);
  useEffect(() => { document.documentElement.lang = language; }, [language]);
  const changeLanguage = (value: Language) => { setLanguage(value); localStorage.setItem('ahadu-language', value); };
  return <LanguageContext.Provider value={{ language, setLanguage: changeLanguage, t: (text) => translate(text, language) }}>{children}</LanguageContext.Provider>;
}
export const useLanguage = () => useContext(LanguageContext);
export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();
  return <label className="flex shrink-0 items-center gap-1.5 text-sm"><Languages aria-hidden="true" className="h-4 w-4 text-muted-foreground" /><select aria-label="Language" value={language} onChange={(event) => { const value = event.target.value; if (value === 'en' || value === 'ti' || value === 'am') setLanguage(value); }} className="max-w-28 rounded-sm border border-input bg-background px-2 py-2 outline-none focus:ring-2 focus:ring-ring"><option value="en">English</option><option value="ti">ትግርኛ</option><option value="am">አማርኛ</option></select></label>;
}