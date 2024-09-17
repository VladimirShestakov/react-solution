import { memo, useMemo, useSyncExternalStore } from 'react';
import { Link } from 'react-router-dom';
import { useService } from '@packages/container/use-service.ts';
import { ROUTER } from '@packages/router/token.ts';
import Tree from '@src/ui/elements/tree';
import Spinner from '@src/ui/elements/spinner';
import { ARTICLES_STORE } from '../../articles-store/token.ts';
import { CATEGORIES_STORE } from '../../categories-store/token.ts';

function CategoryTree() {
  const router = useService(ROUTER);

  const categories = useService(CATEGORIES_STORE);
  const categoriesState = useSyncExternalStore(categories.state.subscribe, categories.state.get, categories.state.get);

  const articles = useService(ARTICLES_STORE);
  const articlesState = useSyncExternalStore(articles.state.subscribe, articles.state.get, articles.state.get);

  const items = useMemo(() => {
    return [{ _id: '', title: 'Все' }, ...categoriesState.roots];
  }, [categoriesState.roots]);

  return (
    <Spinner active={categoriesState.wait}>
      <Tree
        items={items}
        renderItem={item => (
          <Link
            style={{ fontWeight: articlesState.params.category === item._id ? 'bold' : 'normal' }}
            state={{ refreshArticles: true }} //Чтобы товары перезагрузились на том же адресе
            to={router.makeHref(
              // Учитываем в адресе параметры фильтра, но сбрасываем номер страницы
              articles.exportParams({ page: 1 }, true), `/catalog/${item._id}`
            )}
          >
            {item.title}
          </Link>
        )}
      />
    </Spinner>
  );
}

export default memo(CategoryTree);
