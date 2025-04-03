
import { useTranslation } from 'react-i18next';
import { Check, Globe } from 'lucide-react';

const LanguageSelector = () => {
  const { i18n, t } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('language', lng);
  };

  const currentLanguage = i18n.language;

  return (
    <div className="relative group">
      <button 
        className="flex items-center gap-1 hover:text-secondary transition-colors"
        aria-label="Change language"
      >
        <Globe className="w-4 h-4" />
        <span className="hidden md:inline">{currentLanguage === 'en' ? 'EN' : 'मराठी'}</span>
      </button>
      <div className="absolute right-0 mt-2 w-32 bg-white shadow-lg rounded-md overflow-hidden z-50 hidden group-hover:block">
        <button 
          onClick={() => changeLanguage('en')} 
          className="flex items-center justify-between w-full px-4 py-2 text-left hover:bg-gray-100 text-gray-800"
        >
          <span>{t('language.english')}</span>
          {currentLanguage === 'en' && <Check className="w-4 h-4 text-primary" />}
        </button>
        <button 
          onClick={() => changeLanguage('mr')} 
          className="flex items-center justify-between w-full px-4 py-2 text-left hover:bg-gray-100 text-gray-800"
        >
          <span>{t('language.marathi')}</span>
          {currentLanguage === 'mr' && <Check className="w-4 h-4 text-primary" />}
        </button>
      </div>
    </div>
  );
};

export default LanguageSelector;
