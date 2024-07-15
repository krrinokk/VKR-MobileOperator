import { DeleteOutlined, EditOutlined, PlusOutlined, CloseOutlined, SearchOutlined, FileTextOutlined } from '@ant-design/icons';
import { Button, Form, Input, InputNumber, Modal, Popconfirm, message, Table } from 'antd';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import ReportServicesModal from './ReportServicesModal';
import useUserRole from './useUserRole'; // Импортируем хук для получения роли пользователя
type ServicesItem = {
  serviceId: number;
  description: string;
  cost: number;
  name: string;
};

const ServicesTable = () => {
  const actionRef = useRef<ActionType>();
  const [data, setData] = useState<ServicesItem[]>([]);
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingServiceId, setEditingServiceId] = useState<number | null>(null);
  const [searchName, setSearchName] = useState<string>('');

  const [selectedName, setSelectedName] = useState(null);
  const [selectedDescription, setSelectedDescription] = useState(null);

  const [selectedCost, setSelectedCost] = useState(null);

  const [editingKey, setEditingKey] = useState(null);
  const userRole = useUserRole(); // Используем хук для получения роли пользователя

  const handleCloseReportModal = () => {
    setReportModalVisible(false);
  };
  const handleOpenReportModal = () => {
    setReportModalVisible(true);
   
  };
  const fetchData = async () => {
    try {
      const response = await axios.get('https://localhost:7119/api/Services/');
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);




  const filteredData = data.filter((services) => {
   
    const searchNameLower = searchName.toLowerCase();
  
  
    const nameMatch = services.name && services.name.toLowerCase().includes(searchNameLower);
    
    

  const handleCancel = () => {
    setModalVisible(false);
  };

    let isMatch = true;
  
    if (searchName) {
    
      isMatch = nameMatch;
    } 
  
    return isMatch;
 
  });
  











///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  const handleEditServices = (serviceId) => {
    setEditingKey(serviceId); // Set the editing key to the ID of the row being edited
    
    // Найти запись по serviceId
    const record = data.find(record => record.serviceId === serviceId);
  
    // Установить начальные значения для редактирования
    setSelectedName(record.name);
    setSelectedDescription(record.description);

    setSelectedCost(record.cost);
  };
  
    const saveEdit = async (record) => {
      try {
        const updatedService = {
          ...record,
          name: selectedName || record.name,
          cost: selectedCost || record.cost,
         
          description: selectedDescription || record.description
        };
        
        // Отправляем запрос на обновление данных тарифа
        await axios.put(`https://localhost:7119/api/Services/${record.serviceId}`, updatedService);
        fetchData();
        message.success('Изменения сохранены успешно');
        setEditingKey('');
      } catch (error) {
        console.error('Ошибка при обновлении данных тарифа:', error);
        message.error('Произошла ошибка при сохранении изменений');
      }
    };
  const cancelEdit = () => {
    setEditingKey(null); // Reset editing key on cancel
  };

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



  const handleCreate = () => {
    setModalVisible(true);
  };

  const handleModalCancel = () => {
    setModalVisible(false);
    setEditingServiceId(null); // Clear editing mode when modal is closed
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      await axios.post('https://localhost:7119/api/Services', values);
      message.success('Услуга успешно создана');
      setModalVisible(false);
      fetchData(); // Refresh data
      form.resetFields(); // Reset form fields
    } catch (error) {
      console.error('Error creating Services:', error);
      message.error('Ошибка при создании подписки');
    }
  };

  const handleSearchName = (value: string) => {
    setSearchName(value);
  };

  const handleDelete = async (serviceId: number) => {
    try {
      await axios.delete(`https://localhost:7119/api/Services/${serviceId}`);
      message.success('Подписка успешно удалена');
      fetchData(); // Reload data after deletion
    } 
    catch (error) {
      console.error('Ошибка при удалении тарифа:', error);
      if (error.response && error.response.status === 400) {
        // Если получен статус 400 (BadRequest), выводим сообщение об ошибке
        message.error(error.response.data.message);
      } else {
        // Если другая ошибка, выводим общее сообщение об ошибке
        message.error('Произошла ошибка при удалении тарифа');
      }
    }
  };

  const columns = [
    {
      title: 'Номер',
      dataIndex: 'serviceId',
      width: 120,
    },
    {
      title: 'Название',
      dataIndex: 'name',
      render: (text, record) => {
        const isEditing = record.serviceId === editingKey;
        return isEditing ? (
          
          <Input  defaultValue={record.name} value={selectedName}    onChange={(e) => setSelectedName(e.target.value)}/>
        ) : record.name;
      },
    },
    {
      title: 'Описание',
      dataIndex: 'description',
      render: (text, record) => {
        const isEditing = record.serviceId === editingKey;
        return isEditing ? (
          
          <Input  defaultValue={record.description} value={selectedDescription}    onChange={(e) => setSelectedDescription(e.target.value)}/>
        ) : record.description;
      },
    },
    {
      title: 'Стоимость',
      dataIndex: 'cost',
      render: (text, record) => {
        const isEditing = record.serviceId === editingKey;
        return isEditing ? (
          
          <Input  defaultValue={record.cost} value={selectedCost}    onChange={(e) => setSelectedCost(e.target.value)}/>
        ) : record.cost;
      },
    },
    
    ...(userRole === 'admin' ? [{
      title: 'Действия',
      render: (text, record) => {
        const isEditing = record.serviceId === editingKey;
        return (
          <span>
            {isEditing ? (
              <>
                <Popconfirm
                  title="Подтвердить редактирование?"
                  onConfirm={() => saveEdit(record)}
                >
                  <Button
                    type="primary"
                    icon={<EditOutlined />}
                    style={{ marginRight: 8 }}
                  />
                </Popconfirm>
                <Popconfirm
                  title="Отменить редактирование?"
                  onConfirm={() => cancelEdit()}
                >
                  <Button icon={<CloseOutlined />} />
                </Popconfirm>
              </>
            ) : (
              <>
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  onClick={() => handleEditServices(record.serviceId)}
                />
                <Popconfirm
                  title="Вы уверены, что хотите удалить эту подписку?"
                  onConfirm={() => handleDeleteService(record.serviceId)}
                  okText="Да"
                  cancelText="Нет"
                >
                  <Button
                    type="danger"
                    icon={<DeleteOutlined />}
                    style={{ marginLeft: 8 }}
                  />
                </Popconfirm>
              </>
            )}
          </span>
        );
      },
      search: false,
    }] : []),
  ]

  return (
    <>
       {userRole === 'admin' && ( // Проверяем роль пользователя
      <Button type="primary" key="reportsPanel" onClick={handleOpenReportModal}>
          <FileTextOutlined /> Панель 
        </Button> )}
        <div style={{ marginBottom: '16px' }}></div>
     <div style={{ marginBottom: '16px' }}>
        <Input
          prefix={<SearchOutlined />}
          placeholder="Поиск по названию услуги"
          onChange={(e) => handleSearchName(e.target.value)}
          style={{ width: '300px', marginRight: '16px' }}
        />
      
      </div>
      {userRole === 'admin' && ( // Проверяем роль пользователя
     <Button key="button" icon={<PlusOutlined />} onClick={handleCreate} type="primary">
            Создать
          </Button> )}
      <Table
        columns={columns}
        dataSource={filteredData}
        pagination={{ pageSize: 5 }}
        rowKey="serviceId"
       
         
       
      />
  <ReportServicesModal visible={reportModalVisible}  onClose={handleCloseReportModal} />
<Modal
        title="Создать новую подписку"
        visible={modalVisible}
        onCancel={handleModalCancel}
        footer={null}
      >
        <Form form={form} labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} onFinish={handleModalOk}>
          <Form.Item
            label="Название"
            name="name"
            rules={[{ required: true, message: 'Введите название подписки' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Описание"
            name="description"
            rules={[{ required: true, message: 'Введите описание подписки' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Стоимость"
            name="cost"
            rules={[{ required: true, message: 'Введите стоимость подписки' }]}
          >
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
            <Button type="primary" onClick={handleModalOk}>
              Создать
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ServicesTable;
