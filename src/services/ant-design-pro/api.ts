// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 获取当前的用户 GET /api/currentUser */
export async function currentUser(options?: { [key: string]: any }) {
  return request<{
    data: API.CurrentUser;
  }>('/api/currentUser', {
    method: 'GET',
    ...(options || {}),
  });
}

export async function checkAuth(options?: { [key: string]: any }) {
  try {
    const response = await fetch('https://localhost:7119/api/Account/check-auth', {
      method: 'GET',
      credentials: 'include',
      ...(options || {}),
    });
    
    console.log(response); // Выводим ответ от сервера для отладки
    if (!response.ok) {
      throw new Error('Ошибка при проверке аутентификации');
    }

    return await response.json(); // Возвращаем данные аутентифицированного пользователя
  } catch (error) {
    console.error(error);
    return { error: 'Ошибка при проверке аутентификации' }; // Возвращаем объект с ошибкой
  }
}

export async function outLogin(options?: { [key: string]: any }) {
  try {
    const response = await fetch('https://localhost:7119/api/Account/logout', {
      method: 'POST',
      ...(options || {}),
    });

    if (!response.ok) {
      throw new Error('Ошибка при выходе из системы');
    }

    return { success: true }; // Возвращаем объект, указывающий успешный выход из системы
  } catch (error) {
    console.error(error);
    return { error: 'Ошибка при выходе из системы' }; // Возвращаем объект с ошибкой
  }
}

export interface LoginResult {
  userData?: any;

  error?: string; // Добавляем поле для ошибки
}

export async function login(body: API.LoginParams, options?: { [key: string]: any }): Promise<LoginResult> {
  try {
    const response = await fetch('https://localhost:7119/api/Account/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      ...options,
    });

    if (!response.ok) {
      throw new Error('Ошибка аутентификации');
    }

    const userData = await response.json();
    
    // Сохраняем userId в localStorage
    localStorage.setItem('userId', userData.userId);

    return { userData };
  } catch (error) {
    console.error(error);
    return { error: 'Ошибка аутентификации' };
  }
}








/** 此处后端没有提供注释 GET /api/notices */
export async function getNotices(options?: { [key: string]: any }) {
  return request<API.NoticeIconList>('/api/notices', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 获取规则列表 GET /api/rule */
export async function rule(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.RuleList>('/api/rule', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 更新规则 PUT /api/rule */
export async function updateRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/rule', {
    method: 'POST',
    data:{
      method: 'update',
      ...(options || {}),
    }
  });
}

/** 新建规则 POST /api/rule */
export async function addRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/rule', {
    method: 'POST',
    data:{
      method: 'post',
      ...(options || {}),
    }
  });
}

/** 删除规则 DELETE /api/rule */
export async function removeRule(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/rule', {
    method: 'POST',
    data:{
      method: 'delete',
      ...(options || {}),
    }
  });
}
