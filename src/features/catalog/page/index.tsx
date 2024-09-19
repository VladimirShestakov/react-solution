import { useService } from '../../../../packages/container';
import { memo } from 'react';
import { useParams } from 'react-router-dom';
import { useInit } from '../../../../packages/render';
import useRefreshKey from '../../../../packages/router/use-refresh-key';
import useI18n from '../../../../packages/i18n/use-i18n.ts';
import Head from '@src/ui/layout/head';
import MainMenu from '@src/features/navigation/components/main-menu';
import PageLayout from '@src/ui/layout/page-layout';
import SideLayout from '@src/ui/layout/side-layout';
import Sider from '@src/ui/layout/sider';
import Content from '@src/ui/layout/content';
import LocaleSelect from '@src/features/example-i18n/components/locale-select';
import ArticleList from '../containers/article-list';
import CategoryTree from '../containers/category-tree';
import CatalogFilter from '../containers/catalog-filter';
import { ARTICLES_STORE } from '../articles-store/token.ts';
import { CATEGORIES_STORE } from '../categories-store/token.ts';

function CatalogPage() {
  const categories = useService(CATEGORIES_STORE);
  const articles = useService(ARTICLES_STORE);

  const { locale, t } = useI18n();
  const { categoryId } = useParams<{ categoryId: string }>();

  // Если при навигации через location.state передан признак refreshArticles=true,
  // то получим новый ключ и сможем перезагрузить список
  const refreshKey = useRefreshKey('refreshArticles');

  useInit(async () => {
    // Инициализация параметров каталога
    await articles.initParams({ category: categoryId });
  }, [categoryId, locale, refreshKey], { ssr: 'articles.init' });

  useInit(async () => {
    // Загрузка списка категорий
    await categories.load({ fields: '*', limit: 1000 });
  }, [locale], { ssr: 'categories.load' });

  return (
    <PageLayout>
      <Head title="React Skeleton"><LocaleSelect/></Head>
      <MainMenu/>
      <h2>{t('catalog.title')}</h2>
      <p>
        Отображение отфильтрованного списка загруженного из АПИ.
        Параметры списка: сортировка, пагинация, поиск - являются параметрами списка.
        Параметры могут сохранятся в адресе страницы и восстанавливаться из адреса при открытии
        страницы по прямой ссылке.
      </p>
      <p>
        Все действия происходят над параметрами списка (фильтра) - их установка, сброс,
        восстановление. Список элементов подгружается из АПИ с учётом установленных (текущих)
        параметров.
        Варианты значений для некоторых элементов фильтра загружаются отдельно.
        Для них отдельное внешнее состояние.
      </p>
      <SideLayout side="between" align="top" wrap={false}>
        <Sider>
          <CategoryTree/>
        </Sider>
        <Content>
          <CatalogFilter/>
          <ArticleList/>
        </Content>
      </SideLayout>
    </PageLayout>
  );
}

export default memo(CatalogPage);
