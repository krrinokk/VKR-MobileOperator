import { UsergroupAddOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import UserModal from './User';
import AccountModal from './Account';
import { Popover, Button, message } from 'antd';
import axios from 'axios';
import { outLogin } from '@/services/ant-design-pro/api';
const MainComponent = () => {
  const [userModalVisible, setUserModalVisible] = useState(false);
  const [accountModalVisible, setAccountModalVisible] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        // Получаем userId из локального хранилища
        const userId = localStorage.getItem('userId');
        if (!userId) {
          console.error('User ID not found in localStorage');
          return;
        }

        // Выполняем запрос для получения информации о пользователе
        const response = await axios.get(`https://localhost:7119/api/User/${userId}`);
        const userData = response.data;

        // Проверяем роль пользователя
        if (userData && userData.roleId_FK == 1) {
          // Если пользователь имеет роль с ID 1, то спрячем кнопку открытия UserModal
          setUserRole('admin');
        } else {
          setUserRole('user');
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
      }
    };

    fetchUserRole();
  }, []);

  const handleEmptyModalButtonClick = () => {
    setUserModalVisible(true);
  };

  const handleAccountModalButtonClick = () => {
    setAccountModalVisible(true);
  };

  const handleUserModalClose = () => {
    setUserModalVisible(false);
  };

  const handleAccountModalClose = () => {
    setAccountModalVisible(false);
  };

  const handleLogout = async () => {
    try {
      message.info('Выход осуществится через 5 секунд');
      const result = await outLogin();
      if (result.success) {
        setTimeout(() => {
          window.location.href = '/user/login';
        }, 5000);
      } else {
        throw new Error('Ошибка при выходе из системы');
      }
    } catch (error) {
      console.error('Ошибка при разлогинивании:', error);
    }
  };

  const content = (
    <Button type="primary" onClick={handleLogout}>Выход</Button>
  );

  return (
    <>
      {userRole === 'admin' ? null : (
        <div
          style={{
            display: 'flex',
            height: 26,
          }}
          onClick={handleEmptyModalButtonClick}
        >
          <UsergroupAddOutlined />
        </div>
      )}
      <Popover content={content} placement="bottom">
        <div
          style={{
            display: 'flex',
            height: 26,
          }}
          onClick={handleAccountModalButtonClick}
        >
          <UserOutlined />
        </div>
      </Popover>
      <UserModal visible={userModalVisible} onClose={handleUserModalClose} />
      <AccountModal visible={accountModalVisible} onClose={handleAccountModalClose} />
    </>
  );
};

export default MainComponent;
