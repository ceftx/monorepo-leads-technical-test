import es from './es';

// Simple i18n hook - Spanish by default
const translations = es;

type TranslationKey = string;

export function useTranslation() {
  const t = (key: TranslationKey): string => {
    const keys = key.split('.');
    let value: any = translations;

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        console.warn(`Translation key not found: ${key}`);
        return key;
      }
    }

    return typeof value === 'string' ? value : key;
  };

  return { t };
}

export default useTranslation;
