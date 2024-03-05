import React, { useState, useEffect } from 'react';
import { Modal, Button, message, Popconfirm, Input, Checkbox } from 'antd';
import { ProList } from '@ant-design/pro-components';
import { Tag } from 'antd';
import axios from 'axios';
import {
  ProForm,
  ProFormText,
  ProFormSelect,
} from '@ant-design/pro-components';

type UserItem = {
  userId: number;
  name: string;
  login: string;
  password: string;
  roleId_FK: number;
};

const ModalContent = ({ openRegistrationModal, reloadData }: { openRegistrationModal: () => void, reloadData: () => void }) => {
  const [data, setData] = useState<UserItem[]>([]);
  const [searchText, setSearchText] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<number | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get('https://localhost:7119/api/User/');
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    fetchData();
  }, [reloadData]);

  const handleDelete = async (userId: number) => {
    try {
      await axios.delete(`https://localhost:7119/api/User/${userId}`);
      message.success('Пользователь успешно удален');
      reloadData(); // Reload data after deletion
    } catch (error) {
      console.error('Error deleting user:', error);
      message.error('Ошибка при удалении пользователя');
    }
  };

  const handleSearch = async (value: string) => {
    setSearchText(value); // Update search text
    if (value.trim() !== '') {
      try {
        const response = await axios.get(`https://localhost:7119/api/User/?name=${value}`);
        setData(response.data);
      } catch (error) {
        console.error('Error searching users:', error);
        message.error('Ошибка при поиске пользователей');
      }
    } else {
      // If search text is empty, fetch all users
      reloadData();
    }
  };

  const handleRoleChange = (roleId: number) => {
    setSelectedRole(selectedRole === roleId ? null : roleId);
  };

  const filteredData = data.filter(user => user.name.toLowerCase().includes(searchText.toLowerCase()));

  const filteredAndSortedData = filteredData
    .filter(user => selectedRole === null || user.roleId_FK === selectedRole)
    .sort((a, b) => a.roleId_FK - b.roleId_FK);

  return (
    <>
      <Input
        placeholder="Введите имя пользователя"
        value={searchText}
        onChange={(e) => handleSearch(e.target.value)}
      />

      <div style={{ marginTop: '16px' }}>
        <Checkbox
          onChange={() => handleRoleChange(1)}
          checked={selectedRole === 1}
        >
          Администратор
        </Checkbox>
        <Checkbox
          onChange={() => handleRoleChange(2)}
          checked={selectedRole === 2}
        >
          Оператор
        </Checkbox>
      </div>

      <ProList<UserItem>
        toolBarRender={() => {
          return [
            <Button key="3" type="primary" onClick={openRegistrationModal}>
              Регистрация
            </Button>,
          ];
        }}
        // search={{}}
        rowKey="UserId"
        headerTitle="Список пользователей"
        dataSource={filteredAndSortedData}
        pagination={{
          pageSize: 10,
        }}
        showActions="hover"
        metas={{
          title: {
            dataIndex: 'name',
          },
          description: {
            render: (_, row) => (
              <span>
                Login: {row.login}, Password: {row.password}
              </span>
            ),
          },
          subTitle: {
            dataIndex: 'roleId_FK',
            render: (value) => {
              return (
                <Tag color="blue" key={value}>
                  {value === 1 ? 'Admin' : 'User'}
                </Tag>
              );
            },
          },
          actions: {
            render: (_, row) => [
              <Popconfirm
                key="delete"
                title="Вы уверены, что хотите удалить этого пользователя?"
                onConfirm={() => handleDelete(row.userId)}
                okText="Да"
                cancelText="Нет"
              >
                <Button type="link">Удалить</Button>
              </Popconfirm>
            ],
            search: false,
          },
        }}
      />
    </>
  );
};

export const UserModal = ({ visible, onClose }: { visible: boolean; onClose: () => void }) => {
  const [registrationModalVisible, setRegistrationModalVisible] = useState(false);

  const openRegistrationModal = () => {
    setRegistrationModalVisible(true);
  };

  const closeRegistrationModal = () => {
    setRegistrationModalVisible(false);
  };

  const reloadData = () => {
    // Function to reload data after any operation like create, update or delete
    // This will trigger useEffect in ModalContent and fetch updated data
  };
  const handleFormSubmit = async (values: any) => {
    try {
      await axios.post('https://localhost:7119/api/User/', values);
      message.success('Пользователь успешно зарегистрирован');
      reloadData(); // Reload data after registration
      closeRegistrationModal(); // Close registration modal after successful registration
    } catch (error) {
      console.error('Error registering user:', error);
      message.error('Ошибка при регистрации пользователя');
    }
  };
  return (
    <>
      <Modal
        title="Пользователи"
        visible={visible}
        onCancel={onClose}
        footer={null}
      >
        <ModalContent openRegistrationModal={openRegistrationModal} reloadData={reloadData} />
      </Modal>
      <Modal
        title="Регистрация"
        visible={registrationModalVisible}
        onCancel={closeRegistrationModal}
        footer={null}
      >
        <ProForm
          grid={true}
          onFinish={(values: any) => {
            handleFormSubmit(values);
            reloadData(); // Reload data after registration
            closeRegistrationModal(); // Close registration modal after successful registration
          }}
        >
          <ProForm.Group>
            <ProFormText
              colProps={{ xl: 12 }}
              name="name"
              label="Имя"
              placeholder="Введите имя"
              required
            />
            <ProFormText
              colProps={{ xl: 12 }}
              name="login"
              label="Логин"
              placeholder="Введите логин"
              required
            />
            <ProFormText
              colProps={{ xl: 12 }}
              name="password"
              label="Пароль"
              placeholder="Введите пароль"
              required
            />
            <ProFormSelect
              colProps={{ xl: 12 }}
              name="roleId_FK"
              label="Роль"
              placeholder="Выберите роль"
              options={[
                { value: 2, label: 'Администратор' },
                { value: 1, label: 'Оператор' },
              ]}
              required
            />
          </ProForm.Group>
          <Button type="primary" htmlType="submit">
            Отправить
          </Button>
        </ProForm>
      </Modal>
    </>
  );
};
