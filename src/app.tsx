import { AvatarName, Footer, MainComponent } from '@/components';
import { fetchUserInfo } from '@/services/ant-design-pro/api'; // Изменили импорт здесь
import { LinkOutlined } from '@ant-design/icons';
// import type { Settings as LayoutSettings } from '@ant-design/pro-components';
// import { SettingDrawer } from '@ant-design/pro-components';
import type { RunTimeLayoutConfig } from '@umijs/max';
import { Link, history } from '@umijs/max';
import defaultSettings from '../config/defaultSettings';
import { errorConfig } from './requestErrorConfig';
const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/user/login';

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: API.CurrentUser;
  loading?: boolean;
  fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
}> {
  const fetchUserInfo: () => Promise<API.CurrentUser | undefined> = async () => {
    try {
      // Используем новую функцию для получения данных о текущем пользователе
      const currentUser = await fetchUserInfo();
      return currentUser;
    } catch (error) {
      history.push(loginPath);
    }
    return undefined;
  };

  // Если не на странице входа, выполняем запрос на получение данных о текущем пользователе
  const { location } = history;
  if (location.pathname !== loginPath) {
    const currentUser: API.CurrentUser | undefined = await fetchUserInfo();
    return {
      fetchUserInfo,
      currentUser,
      settings: defaultSettings as Partial<LayoutSettings>,
    };
  }
  return {
    fetchUserInfo,
    settings: defaultSettings as Partial<LayoutSettings>,
  };
}

// ProLayout поддерживает API https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState, setInitialState }) => {
  return {
    actionsRender: () => [<MainComponent key="MainComponent" />],
    avatarProps: {
      src: initialState?.currentUser?.avatar,
      title: <AvatarName />,
      render: (_, avatarChildren) => {
        // return <AvatarDropdown>{avatarChildren}</AvatarDropdown>;
      },
    },
    waterMarkProps: {
      content: initialState?.currentUser?.name,
    },
    footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history;
      // Если пользователь не аутентифицирован, перенаправляем на страницу входа
      // if (!initialState?.currentUser && location.pathname !== loginPath) {
      //   history.push(loginPath);
      // }
    },
    bgLayoutImgList: [
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/D2LWSqNny4sAAAAAAAAAAAAAFl94AQBr',
        left: 85,
        bottom: 100,
        height: '303px',
      },
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/C2TWRpJpiC0AAAAAAAAAAAAAFl94AQBr',
        bottom: -68,
        right: -45,
        height: '303px',
      },
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/F6vSTbj8KpYAAAAAAAAAAAAAFl94AQBr',
        bottom: 0,
        left: 0,
        width: '331px',
      },
    ],
    links: isDev
      ? [
          // <Link key="openapi" to="/umi/plugin/openapi" target="_blank">
          //   <LinkOutlined />
          //   <span>OpenAPI Документация</span>
          // </Link>,
        ]
      : [],
    menuHeaderRender: undefined,
    // Добавляем статус загрузки
    childrenRender: (children) => {
      // if (initialState?.loading) return <PageLoading />;
      return (
        <>
          {children}
        
        </>
      );
    },
    ...initialState?.settings,
  };
};

/**
 * @name Конфигурация запроса, включая обработку ошибок
 * Он основан на axios и ahooks useRequest, предоставляющих единый подход к сетевым запросам и обработке ошибок.
 * @doc https://umijs.org/docs/max/request#Настройки
 */
export const request = {
  ...errorConfig,
};
