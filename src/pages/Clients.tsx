import React, { useState, useEffect } from 'react';
import { Button, Table, message, Form, Input, Modal, Popconfirm, Switch } from 'antd';
import axios from 'axios';
import { DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Typography } from 'antd';
import ConnectsModal from './ClientConnections';
import useUserRole from './useUserRole'; // Импортируем хук для получения роли пользователя

const { Text } = Typography;

type ClientItem = {
  clientId: number;
  firstName: string;
  patronymic: string;
  lastName: string;
  address: string;
  passport: string;
  mail: string;
  balance: number;
  isActive: boolean;
};

const ClientTable = () => {
  const userRole = useUserRole(); // Используем хук для получения роли пользователя
  const [data, setData] = useState<ClientItem[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingClientId, setEditingClientId] = useState<number | null>(null);
  const [searchPassportTerm, setSearchPassportTerm] = useState<string>('');
  const [searchNameTerm, setSearchNameTerm] = useState<string>('');
  const [showActive, setShowActive] = useState<boolean>(true);
  const [showBlocked, setShowBlocked] = useState<boolean>(true);
  const [connectsModalVisible, setConnectsModalVisible] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);

  const filteredData = data.filter((client) => {
    const isActive = client.balance >= 0;
    const isBlocked = client.balance < 0;
    const searchPassportLower = searchPassportTerm.toLowerCase();
    const searchNameLower = searchNameTerm.toLowerCase();

    const passportMatch = client.passport && client.passport.toLowerCase().includes(searchPassportLower);
    const nameMatch =
      (client.firstName && client.firstName.toLowerCase().includes(searchNameLower)) ||
      (client.lastName && client.lastName.toLowerCase().includes(searchNameLower)) ||
      (client.patronymic && client.patronymic.toLowerCase().includes(searchNameLower));

    let isMatch = true;

    if (searchPassportTerm && searchNameTerm) {
      isMatch = passportMatch && nameMatch;
    } else if (searchPassportTerm) {
      isMatch = passportMatch;
    } else if (searchNameTerm) {
      isMatch = nameMatch;
    }

    return isMatch && ((isActive && showActive) || (isBlocked && showBlocked));
  });

  const handleOpenConnectsModal = (clientId: number) => {
    setSelectedClientId(clientId); // Установите выбранный clientId в состояние
    setConnectsModalVisible(true);
  };

  const handleCloseConnectsModal = () => {
    setSelectedClientId(null); // Сбросьте выбранный clientId при закрытии модального окна
    setConnectsModalVisible(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('https://localhost:7119/api/Client/');
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleCreate = () => {
    setModalVisible(true);
  };

  const handleModalCancel = () => {
    setModalVisible(false);
    setEditingClientId(null);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingClientId !== null) {
        // Если есть `editingClientId`, отправляем запрос на обновление данных клиента
        await axios.put(`https://localhost:7119/api/Client/${editingClientId}`, {
          ...values,
          clientId: editingClientId, // Передаем `clientId` обратно на сервер
        });
        message.success('Клиент успешно обновлен');
      } else {
        // Иначе отправляем запрос на создание нового клиента
        await axios.post('https://localhost:7119/api/Client', values);
        message.success('Клиент успешно создан');
      }
      setModalVisible(false);
      fetchData();
      form.resetFields();
      setEditingClientId(null);
    } catch (error) {
      console.error('Error creating/updating client:', error);
      message.error('Ошибка при создании/обновлении клиента');
    }
  };

  const handleEdit = (clientId: number) => {
    setEditingClientId(clientId);
    const clientToEdit = data.find((client) => client.clientId === clientId);
    if (clientToEdit) {
      form.setFieldsValue(clientToEdit);
    }
    setModalVisible(true);
  };

  const handleDelete = async (clientId: number) => {
    try {
      await axios.delete(`https://localhost:7119/api/Client/${clientId}`);
      message.success('Клиент успешно удален');
      fetchData();
    } catch (error) {
      console.error('Error deleting client:', error);
      message.error('Ошибка при удалении клиента');
    }
  };

  const handleSearchPassport = (value: string) => {
    setSearchPassportTerm(value);
  };

  const handleSearchName = (value: string) => {
    setSearchNameTerm(value);
  };

  const handleShowActiveChange = (checked: boolean) => {
    setShowActive(checked);
  };

  const handleShowBlockedChange = (checked: boolean) => {
    setShowBlocked(checked);
  };

  const columns = [
    {
      title: 'Номер',
      dataIndex: 'clientId',
      width: 120,
    },
    {
      title: 'Имя',
      dataIndex: 'firstName',
      ellipsis: true,
    },
    {
      title: 'Отчество',
      dataIndex: 'patronymic',
      ellipsis: true,
    },
    {
      title: 'Фамилия',
      dataIndex: 'lastName',
      ellipsis: true,
    },
    {
      title: 'Баланс',
      dataIndex: 'balance',
      ellipsis: true,
    },
    {
      title: 'Паспорт',
      dataIndex: 'passport',
      ellipsis: true,
      render: (text: string) => <Text style={{ whiteSpace: 'pre-wrap' }}>{text}</Text>,
    },
    {
      title: 'Адрес',
      dataIndex: 'address',
      ellipsis: true,
      render: (text: string) => <Text style={{ whiteSpace: 'pre-wrap' }}>{text}</Text>,
    },
    {
      title: 'Почта',
      dataIndex: 'mail',
      ellipsis: true,
      render: (text: string) => <Text style={{ whiteSpace: 'pre-wrap' }}>{text}</Text>,
    },
    {
      title: 'Подключения',
      render: (text, record) => (
        <Button
          type="primary"
          icon={<EyeOutlined />}
          onClick={() => handleOpenConnectsModal(record.clientId)} // Передача clientId при открытии модального окна
        />
      ),
    },
    ...(userRole === 'user' ? [{
      title: 'Действия',
      valueType: 'option',
      width: 150,
      render: (text: any, record: ClientItem) => [
        <Button
          key="edit"
          type="primary"
          icon={<EditOutlined />}
          onClick={() => handleEdit(record.clientId)}
        />,
        <Popconfirm
          key="delete"
          title="Вы уверены, что хотите удалить этого клиента?"
          onConfirm={() => handleDelete(record.clientId)}
          okText="Да"
          cancelText="Нет"
        >
          <Button
            key="delete"
            type="danger"
            icon={<DeleteOutlined />}
            style={{ marginLeft: '8px' }}
          />
        </Popconfirm>,
      ],
    }] : []),
  ];

  return (
    <>
      <div style={{ marginBottom: '16px' }}>
        <Input
          prefix={<SearchOutlined />}
          placeholder="Поиск по паспортным данным"
          onChange={(e) => handleSearchPassport(e.target.value)}
          style={{ width: '300px', marginRight: '16px' }}
        />
        <Input
          prefix={<SearchOutlined />}
          placeholder="Поиск по имени, отчеству, фамилии"
          onChange={(e) => handleSearchName(e.target.value)}
          style={{ width: '300px', marginRight: '16px' }}
        />
        <span style={{ marginRight: '16px' }}>
          <Switch checked={showActive} onChange={handleShowActiveChange} /> Активные
        </span>
        <span>
          <Switch checked={showBlocked} onChange={handleShowBlockedChange} /> Заблокированные
        </span>
      </div>
      {userRole === 'user' && (
        <Button icon={<PlusOutlined />} onClick={handleCreate} type="primary">
          Создать
        </Button>
      )}
      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="clientId"
        pagination={{
          pageSize: 5,
        }}
      />
      <ConnectsModal
        visible={connectsModalVisible}
        onClose={handleCloseConnectsModal}
        clientId={selectedClientId}
      />
      <Modal
        title={editingClientId ? 'Редактировать клиента' : 'Создать нового клиента'}
        visible={modalVisible}
        onCancel={handleModalCancel}
        footer={[
          <Button key="cancel" onClick={handleModalCancel}>
            Отмена
          </Button>,
          <Button key="submit" type="primary" onClick={handleModalOk}>
            Сохранить
          </Button>,
        ]}
      >
        <Form form={form} labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} onFinish={handleModalOk}>
          <Form.Item
            label="Имя"
            name="firstName"
            rules={[{ required: true, message: 'Введите имя клиента' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Отчество"
            name="patronymic"
            rules={[{ required: true, message: 'Введите отчество клиента' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Фамилия"
            name="lastName"
            rules={[{ required: true, message: 'Введите фамилию клиента' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Адрес"
            name="address"
            rules={[{ required: true, message: 'Введите адрес клиента' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Паспорт"
            name="passport"
            rules={[{ required: true, message: 'Введите паспортные данные клиента' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Почта"
            name="mail"
            rules={[{ required: true, message: 'Введите почту клиента' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ClientTable;
