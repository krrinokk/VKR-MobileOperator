export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        name: 'login',
        path: '/user/login',
        component: './User/Login',
      },
    ],
  },
  {
    path: '/welcome',
    name: 'Главная',
    icon: 'smile',
    component: './Welcome',
  },
  {
    path: '/chat',
    name: 'Чат',
    icon: 'smile',
    component: './Chat',
  },
  {
    path: '/contracts',
    name: 'Контракты',
 
    component: './Contract',
  },
  {
    path: '/clients',
    name: 'Клиентская база',
  

    routes: [
      {
        path: '/clients/list',
        name: 'Список клиентов',
        component: './Clients',
      },
     
    ],
  },
  {
    path: '/admin',
    name: 'Тарифные планы',
    icon: 'crown',
    access: 'canAdmin',
    routes: [
      {
        path: '/admin',
        redirect: '/admin/sub-page',
      },
      {
        path: '/admin/tariffs',
        name: 'Тарифные планы',
        component: './Tariff',
      },
    ],
  },
  {
    name: 'list.table-list',
    icon: 'table',
    path: '/list',
    component: './TableList',
  },
  
  {
    path: '/',
    redirect: '/welcome',
  },
  {
    path: '*',
    layout: false,
    component: './404',
  },
];
