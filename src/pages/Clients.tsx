import { PlusOutlined, EllipsisOutlined, EyeOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable, TableDropdown } from '@ant-design/pro-components';
import { Button, Dropdown, Space, Tag, Modal, Form, Input, InputNumber, message, Popconfirm } from 'antd';
import { useRef, useState, useEffect } from 'react';
import axios from 'axios';

type ClientItem = {
  clientId: number;
  fullName: string;
  balance: number;
};

const ClientTable = () => {
  const actionRef = useRef<ActionType>();
  const [data, setData] = useState<ClientItem[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingClientId, setEditingClientId] = useState<number | null>(null);

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
    setEditingClientId(null); // Clear editing mode when modal is closed
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      await axios.post('https://localhost:7119/api/Client', values);
      message.success('Клиент успешно создан');
      setModalVisible(false);
      fetchData(); // Refresh data
      form.resetFields(); // Reset form fields
    } catch (error) {
      console.error('Error creating client:', error);
      message.error('Ошибка при создании клиента');
    }
  };

  const handleEdit = (clientId: number) => {
    setEditingClientId(clientId); // Turn on editing mode for clicked row
  };

  const handleDelete = async (clientId: number) => {
    try {
      await axios.delete(`https://localhost:7119/api/Client/${clientId}`);
      message.success('Клиент успешно удален');
      fetchData(); // Reload data after deletion
    } catch (error) {
      console.error('Error deleting client:', error);
      message.error('Ошибка при удалении клиента');
    }
  };

  const columns: ProColumns<ClientItem>[] = [
    {
      title: 'Номер',
      dataIndex: 'clientId',
      width: 120,
    },
    {
      title: 'ФИО',
      dataIndex: 'fullName',
      ellipsis: true,
      render: (text, record) =>
        editingClientId === record.clientId ? (
          <Form.Item name="fullName" initialValue={text}>
            <Input />
          </Form.Item>
        ) : (
          text
        ),
    },
    {
      title: 'Баланс',
      dataIndex: 'balance',
      valueType: 'money',
      width: 120,
      render: (text, record) =>
        editingClientId === record.clientId ? (
          <Form.Item name="balance" initialValue={text}>
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        ) : (
          text
        ),
    },
    {
      title: 'Действия',
      valueType: 'option',
      width: 150,
      render: (text, record) => [
        <Button
          key="edit"
          type="primary"
          icon={<EditOutlined />}
          onClick={() => handleEdit(record.clientId)}
        >
    
        </Button>,
        <Popconfirm
          key="delete"
          title="Вы уверены, что хотите удалить этого клиента?"
          onConfirm={() => handleDelete(record.clientId)}
          okText="Да"
          cancelText="Нет"
        >
          <Button key="delete" type="danger" icon={<DeleteOutlined />} style={{ marginLeft: '8px' }}></Button>
        </Popconfirm>
      ],
    },
  ];

  return (
    <>
      <ProTable<ClientItem>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        dataSource={data}
        rowKey="clientId"
        options={{
          setting: {
            listsHeight: 400,
          },
        }}
        pagination={{
          pageSize: 5,
          onChange: (page) => console.log(page),
        }}
        dateFormatter="string"
        headerTitle="Клиентская база"
        toolBarRender={() => [
          <Button
            key="button"
            icon={<PlusOutlined />}
            onClick={handleCreate}
            type="primary"
          >
            Создать
          </Button>,
        ]}
      />

      <Modal
        title="Создать нового клиента"
        visible={modalVisible}
        onCancel={handleModalCancel}
        footer={null}
      >
        <Form
          form={form}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
          onFinish={handleModalOk}
        >
          <Form.Item
            label="ФИО"
            name="fullName"
            rules={[{ required: true, message: 'Введите ФИО клиента' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Баланс"
            name="balance"
            rules={[{ required: true, message: 'Введите баланс клиента' }]}
          >
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Создать
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ClientTable;
