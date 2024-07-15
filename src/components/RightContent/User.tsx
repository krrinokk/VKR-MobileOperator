import React, { useState, useEffect } from 'react';
import { Modal, Tabs, message, DatePicker, Button } from 'antd';
import axios from 'axios';
import { ProForm, ProFormSelect, ProFormText, ProList } from '@ant-design/pro-components';
import { Checkbox, Input, Popconfirm, Tag, Typography } from 'antd';
import moment from 'moment';
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

const UserModal = ({ visible, onClose }) => {
  const [registrationModalVisible, setRegistrationModalVisible] = useState(false);
  const [userData, setUserData] = useState([]);
  const [contractsData, setContractsData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [selectedRole, setSelectedRole] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  async function fetchData() {
    try {
      const usersResponse = await axios.get('https://localhost:7119/api/User/');
      setUserData(usersResponse.data);

      // Fetch contracts data
      await reloadData();
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  useEffect(() => {
   
    fetchData();
  }, []);

  const reloadData = async () => {
    try {
      const contractsResponse = await axios.get(`https://localhost:7119/api/User/contracts-count-day?startDate=${startDate}&endDate=${endDate}`);
      setContractsData(contractsResponse.data);
    } catch (error) {
      console.error('Error fetching contracts data:', error);
    }
  };

  const handleDelete = async (userId) => {
    try {
      await axios.delete(`https://localhost:7119/api/User/${userId}`);
      fetchData();
      message.success('Пользователь успешно удален');
      reloadData();
    } catch (error) {
      console.error('Error deleting user:', error);
      message.error('Ошибка при удалении пользователя');
    }
  };

  const handleSearch = async (value) => {
    setSearchText(value);
    if (value.trim() !== '') {
      try {
        const response = await axios.get(`https://localhost:7119/api/User/?name=${value}`);
        setUserData(response.data);
      } catch (error) {
        console.error('Error searching users:', error);
        message.error('Ошибка при поиске пользователей');
      }
    } else {
      reloadData();
    }
  };

  const handleRoleChange = (roleId) => {
    setSelectedRole(selectedRole === roleId ? null : roleId);
  };

  const handleDateChange = (dates) => {
    setStartDate(dates[0]);
    setEndDate(dates[1]);
  };

  const handleViewContracts = async () => {
    await reloadData();
  };

  const filteredData = userData.filter((user) =>
    user.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const filteredAndSortedData = filteredData
    .filter((user) => selectedRole === null || user.roleId_FK === selectedRole)
    .sort((a, b) => a.roleId_FK - b.roleId_FK);

  const openRegistrationModal = () => {
    setRegistrationModalVisible(true);
  };

  const closeRegistrationModal = () => {
    setRegistrationModalVisible(false);
  };

  const handleFormSubmit = async (values) => {
    try {
      await axios.post('https://localhost:7119/api/User/', values);
      fetchData();
      message.success('Пользователь успешно зарегистрирован');
      reloadData();
      closeRegistrationModal();
    } catch (error) {
      console.error('Error registering user:', error);
      message.error('Ошибка при регистрации пользователя');
    }
  };
  const handlePhoneNumberClick = async (phoneNumber) => {
    try {
      const response = await axios.get(`https://localhost:7119/api/Contract/phone/${phoneNumber}`);
      const contractData = response.data;
      message.info(
        <div style={{ textAlign: 'left' }}>
          <div><strong>Номер телефона:</strong> {contractData.numberPhone}</div>
          <div><strong>ID контракта:</strong> {contractData.contractId}</div>
          <div><strong>Дата заключения:</strong> {moment(userData.dateConclusion).format('YYYY-MM-DD')}</div>
          <div><strong>Тариф:</strong> {contractData.nameTariff}</div>
          <div><strong>Клиент:</strong> {contractData.nameClient}</div>
        </div>
      );
    } catch (error) {
      console.error('Error fetching contract data:', error);
      message.error('Ошибка при получении информации о контракте');
    }
  };
  
  const formattedContractsData = contractsData.map(contract => ({
    ...contract,
    description: `Количество оформленных контрактов: ${contract.contractsCount}`,
    phoneNumbers: contract.phoneNumbers // Добавляем массив номеров телефонов
  }));

  const handleUserClick = async (userId) => {
    try {
      const response = await axios.get(`https://localhost:7119/${userId}/contracts-count`);
      const userData = response.data;
      message.info(
        <div style={{ textAlign: 'left' }}>
          <div><strong>Пользователь:</strong> {userData.name}</div>
          <div><strong>Количество контрактов:</strong> {userData.contractsCount}</div>
          <div><strong>ID пользователя:</strong> {userData.userId}</div>
   
        </div>
      );
    } catch (error) {
      console.error('Error fetching user data:', error);
      message.error('Ошибка при получении информации о пользователе');
    }
  };

  return (
    <Modal title="Пользователи" visible={visible} onCancel={onClose} footer={null}>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Список" key="1">
          <div>
            <Input
              placeholder="Введите имя пользователя"
              value={searchText}
              onChange={(e) => handleSearch(e.target.value)}
            />
            <div style={{ marginTop: '16px' }}>
              <Checkbox onChange={() => handleRoleChange(1)} checked={selectedRole === 1}>
                Администратор
              </Checkbox>
              <Checkbox onChange={() => handleRoleChange(2)} checked={selectedRole === 2}>
                Оператор
              </Checkbox>
            </div>
            <ProList
              toolBarRender={() => [
                <Button key="3" type="primary" onClick={openRegistrationModal}>
                  Регистрация
                </Button>,
              ]}
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
                  render: (_, row) => (
                    <span
                      style={{ cursor: 'pointer', color: 'blue' }}
                      onClick={() => handleUserClick(row.userId)}
                    >
                      {row.name}
                    </span>
                  ),
                },
                description: {
                  render: (_, row) => (
                    <span>
                      Login: {row.login}
                      {/* , Password: {row.password} */}
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
                    </Popconfirm>,
                  ],
                  search: false,
                },
              }}
            />
          </div>
        </TabPane>
        
        <TabPane tab="Оценка" key="2">
          <RangePicker onChange={handleDateChange} />
          <div style={{ marginTop: '16px' }}>
            <Button type="primary" onClick={handleViewContracts}>Просмотр</Button>
            <ProList
  rowKey="userId"
  dataSource={formattedContractsData}
  pagination={{
    pageSize: 10,
  }}
  metas={{
    title: { dataIndex: 'name' },
    description: { dataIndex: 'description' },
    subTitle: {
      render: (_, record) => (
        <div>
        {record.phoneNumbers.map(phoneNumber => (
          <Tag key={phoneNumber} onClick={() => handlePhoneNumberClick(phoneNumber)}>{phoneNumber}</Tag>
        ))}
      </div>
      )
    },
  }}
/>

          </div>
        </TabPane>
      </Tabs>
      <Modal
        title="Регистрация"
        visible={registrationModalVisible}
        onCancel={closeRegistrationModal}
        footer={null}
      >
        <ProForm
          grid={true}
          onFinish={(values) => {
            handleFormSubmit(values);
            closeRegistrationModal();
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
       
        </ProForm>
      </Modal>
    </Modal>
  );
};

export default UserModal;
