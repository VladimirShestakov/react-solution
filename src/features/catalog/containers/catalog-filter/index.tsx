import { memo, useCallback, useMemo } from 'react';
import { useExternalState, useTranslate } from 'react-solution';
import { useSolution } from 'react-solution';
import SideLayout from '@src/ui/layout/side-layout';
import Select from '@src/ui/elements/select';
import Input from '@src/ui/elements/input';
import { ARTICLES_STORE } from '../../articles-store/token.ts';

function CatalogFilter() {
  const t = useTranslate();
  const articles = useSolution(ARTICLES_STORE);
  const articlesState = useExternalState(articles.state);

  const callbacks = {
    // Сортировка
    onSort: useCallback((sort: string) => articles.setParams({ sort }), [articles]),
    // Поиск
    onSearch: useCallback((query: string) => articles.setParams({ query, page: 1 }), [articles]),
    // Сброс
    onReset: useCallback(() => articles.resetParams({}), [articles]),
  };

  const options = {
    sort: useMemo(
      () => [
        { value: 'order', title: 'По порядку' },
        { value: 'title.ru', title: 'По именованию' },
        { value: '-price', title: 'Сначала дорогие' },
        { value: 'edition', title: 'Древние' },
      ],
      [],
    ),
  };

  return (
    <SideLayout padding="medium">
      <Select
        options={options.sort}
        value={articlesState.params.sort}
        onChange={callbacks.onSort}
      />
      <Input
        name="query"
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
