import React, { useState, useEffect } from 'react';
import { Modal, message } from 'antd';
import {
  ProForm,
  ProFormList,
  ProFormText,
  ProCard,
} from '@ant-design/pro-components';
const AccountModal = ({ visible, onClose }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Получаем userId из localStorage
        const userId = localStorage.getItem('userId');

        // Если userId присутствует, выполняем запрос на сервер для получения данных пользователя
        if (userId) {
          const response = await fetch(`https://localhost:7119/api/User/${userId}`);

          if (!response.ok) {
            throw new Error('Ошибка получения данных пользователя');
          }

          const userData = await response.json();
          setUserData(userData);
          setLoading(false);
        } else {
          message.error('Пользователь не аутентифицирован');
          onClose();
        }
      } catch (error) {
        console.error(error);
        message.error('Ошибка получения данных пользователя');
        onClose();
      }
    };

    fetchUserData();
  }, [visible, onClose]);

  return (
    <Modal visible={visible} onCancel={onClose} footer={null}>
    {loading ? (
      <p>Loading...</p>
    ) : (
      <ProCard
        title="Данные пользователя"
        bordered
        style={{ marginBlockEnd: 16 }}
      >
        <>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontWeight: "bold" }}>ID пользователя: </label>
            <span>{userData?.userId}</span>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontWeight: "bold" }}>Роль: </label>
            <span>{userData?.roleId_FK === 2 ? "Администратор" : "Оператор"}</span>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontWeight: "bold" }}>ФИО: </label>
            <span>{userData?.name}</span>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontWeight: "bold" }}>Логин: </label>
            <span>{userData?.login}</span>
          </div>
        </>
      </ProCard>
    )}
  </Modal>
  
  
  
  );
};

export default AccountModal;
