import React, { memo } from 'react';
import { useParams } from 'react-router-dom';
import { Head as HeadMeta, HttpStatus, useSolution } from 'react-solution';
import { useInit } from 'react-solution';
import { useRefreshKey } from 'react-solution';
import { useI18n } from 'react-solution';
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
  const categories = useSolution(CATEGORIES_STORE);
  const articles = useSolution(ARTICLES_STORE);

  const { locale, t } = useI18n();
  const { categoryId } = useParams<{ categoryId: string }>();

  // Если при навигации через location.state передан признак refreshArticles=true,
  // то получим новый ключ и сможем перезагрузить список
  const refreshKey = useRefreshKey('refreshArticles');

  useInit(
    async () => {
      // Инициализация параметров каталога
      await articles.initParams({ category: categoryId });
    },
    [categoryId, locale, refreshKey],
    { ssr: 'articles.init' },
  );

  useInit(
    async () => {
      // Загрузка списка категорий
      await categories.load({ fields: '*', limit: 1000 });
    },
    [locale],
    { ssr: 'categories.load' },
  );

  return (
    <PageLayout>
      <HeadMeta>
        <title data-some={'10'}>{`Каталог! -{data-some}-{data-other}-`}</title>
        <link rel="icon" type="image/x-icon" href="/catalog/favicon.ico" />
        <HttpStatus>200</HttpStatus>
      </HeadMeta>
      <HeadMeta>
        <title data-other={'5550'}></title>
      </HeadMeta>
      <Head title="React Solution">
        <LocaleSelect />
      </Head>
      <MainMenu />
      <h2>{t('catalog.title')}</h2>
      <p>
        Отображение отфильтрованного списка. Список загружается из API. Параметры списка:
        сортировка, пагинация, поиск. Параметры могут сохраняться в адресе страницы и
        восстанавливаться при открытии страницы по ссылке.
      </p>
      <p>
        Все действия выполняются над параметрами списка, которые также являются параметрами фильтра
        или поиска. То есть вызывается действие изменения параметров в состоянии приложения, а не
        явное действие загрузки списка с указанными параметрами. Список элементов загружается из API
        автоматически после установки параметров.
      </p>
      <p>
        Варианты значений для некоторых элементов фильтра загружаются отдельно и хранятся в
        отдельном состоянии.
      </p>
      <SideLayout side="between" align="top" wrap={false}>
        <Sider>
          <CategoryTree />
        </Sider>
        <Content>
          <CatalogFilter />
          <ArticleList />
        </Content>
      </SideLayout>
    </PageLayout>
  );
}

export default memo(CatalogPage);
