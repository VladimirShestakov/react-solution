import { memo, useCallback } from 'react';
import { useExternalState, useSolutionMap } from 'react-solution';
import { ROUTER_SERVICE } from 'react-solution';
import Pagination from '@src/ui/navigation/pagination';
import Spinner from '@src/ui/elements/spinner';
import { ARTICLES_STORE } from '../../articles-store/token.ts';

function ArticleList() {
  const { articles, router } = useSolutionMap({
    articles: ARTICLES_STORE,
    router: ROUTER_SERVICE,
  });

  //тест
  const articlesState = useExternalState(articles.state);

  const callbacks = {
    // Пагинация
    onPaginate: useCallback(
      (page: number) => {
        articles.setParams({ page });
      },
      [articles],
    ),
    // генератор ссылки для пагинатора
    makePaginatorLink: useCallback((page: number) => {
      return router.makeHref(articles.exportParams({ page }));
    }, []),
  };

  return (
    <Spinner active={articlesState.wait}>
      <ul>
        {articlesState.data.items.map((item: any) => (
          <li key={item._id}>
            {item.title} | {item.madeIn.title} | {item.category.title} | {item.price} руб
          </li>
        ))}
      </ul>
      <Pagination
        count={articlesState.data.count}
        page={articlesState.params.page}
        limit={articlesState.params.limit}
        onChange={callbacks.onPaginate}
        makeLink={callbacks.makePaginatorLink}
      />
    </Spinner>
  );
}

export default memo(ArticleList);
