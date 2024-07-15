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
    icon: 'table',
    component: './Contract',
  },
  // {
  //   path: '/costdetails',
  //   name: 'Детализация расходов',

  //   component: './AdminTariff',
  // },
  {
    path: '/clients',
    name: 'Клиентская база',
    icon: 'table',
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
    name: 'Услуги',
    icon: 'crown',
    // access: 'canAdmin',
    routes: [
    
      {
        path: '/admin/tariffs',
        name: 'Тарифные планы',
        component: './Tariff',
      },
      {
        path: '/admin/services',
        name: 'Подписки',
        component: './Services',
      },
    ],
  },
  // {
  //   name: 'list.table-list',
   
  //   path: '/list',
  //   component: './TableList',
  // },

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
