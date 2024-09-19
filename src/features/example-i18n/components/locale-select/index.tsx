import { memo, useCallback, useMemo } from 'react';
import useI18n from '../../../../../packages/i18n/use-i18n.ts';
import Select from '@src/ui/elements/select';

function LocaleSelect() {

  const { locale, locales, setLocale, t } = useI18n();

  const options = useMemo(
    () => locales.map(locale => ({ value: locale, title: t(`example-i18n.locales.${locale}`) })),
    [locale, t]
  );

  const onChange = useCallback((locale: string) => {
    setLocale(locale);
  }, [setLocale]);

  return (
    <Select onChange={onChange} value={locale} options={options}/>
  );
}

export default memo(LocaleSelect);
