import { memo, useCallback, useMemo, useSyncExternalStore } from 'react';
import { useTranslate } from '@packages/i18n/use-i18n.ts';
import useService from '@packages/container/use-service.ts';
import SideLayout from '@src/ui/layout/side-layout';
import Select from '@src/ui/elements/select';
import Input from '@src/ui/elements/input';
import { ARTICLES_STORE } from '../../articles-store/token.ts';

function CatalogFilter() {
  const t = useTranslate();
  const articles = useService(ARTICLES_STORE);
  const articlesState = useSyncExternalStore(articles.state.subscribe, articles.state.get, articles.state.get);

  const callbacks = {
    // Сортировка
    onSort: useCallback((sort: string) => articles.setParams({ sort }), [articles]),
    // Поиск
    onSearch: useCallback((query: string) => articles.setParams({ query, page: 1 }), [articles]),
    // Сброс
    onReset: useCallback(() => articles.resetParams({}), [articles]),
  };

  const options = {
    sort: useMemo(() => ([
      { value: 'order', title: 'По порядку' },
      { value: 'title.ru', title: 'По именованию' },
      { value: '-price', title: 'Сначала дорогие' },
      { value: 'edition', title: 'Древние' },
    ]), []),
  };

  return (
    <SideLayout padding="medium">
      <Select options={options.sort} value={articlesState.params.sort} onChange={callbacks.onSort}/>
      <Input name="query"
        value={articlesState.params.query}
        onChange={callbacks.onSearch}
        placeholder={'Поиск'}
        delay={1000}
      />
      <button onClick={callbacks.onReset}>{t('catalog.filter.reset')}</button>
    </SideLayout>
  );
}

export default memo(CatalogFilter);
