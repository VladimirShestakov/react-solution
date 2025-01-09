import { memo, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useExternalState, useSolution } from 'react-solution';
import { ROUTER_SERVICE } from 'react-solution';
import Tree from '@src/ui/elements/tree';
import Spinner from '@src/ui/elements/spinner';
import { ARTICLES_STORE } from '../../articles-store/token.ts';
import { CATEGORIES_STORE } from '../../categories-store/token.ts';

function CategoryTree() {
  const router = useSolution(ROUTER_SERVICE);
  const categories = useSolution(CATEGORIES_STORE);
  const categoriesState = useExternalState(categories.state);
  const articles = useSolution(ARTICLES_STORE);
  const articlesState = useExternalState(articles.state);

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
              articles.exportParams({ page: 1 }, true),
              `/catalog/${item._id}`,
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
