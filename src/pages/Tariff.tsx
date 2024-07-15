import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import { Button, message, Popconfirm, Table, Switch, InputNumber, DatePicker, Form, Input } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import { PlusOutlined, FileTextOutlined, DeleteOutlined, EditOutlined, EyeOutlined, SearchOutlined, CloseOutlined } from '@ant-design/icons';
import AddTariffModal from './AddTariffModal';
import TransactionsModal from './Transactions';
import ReportTariffModal from './ReportTariffModal';
import moment from 'moment';
import useUserRole from './useUserRole'; // Импортируем хук для получения роли пользователя

export default () => {
  const [data, setData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [reportData, setReportData] = useState([]);
  const [tariffName, setTariffName] = useState('');
  const [connectionCount, setConnectionCount] = useState('');
  const [activeKey, setActiveKey] = useState('all');
  const [showArchive, setShowArchive] = useState(false);
  const [selectedTariffId, setSelectedTariffId] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [searchName, setSearchName] = useState<string>('');
  const [showActive, setShowActive] = useState<boolean>(true);
  const [showBlocked, setShowBlocked] = useState<boolean>(true);
  const [selectedName, setSelectedName] = useState(null);
  const [selectedSMS, setSelectedSMS] = useState(null);
  const [selectedGB, setSelectedGB] = useState(null);
  const [selectedMinutes, setSelectedMinutes] = useState(null);
  const [selectedCost, setSelectedCost] = useState(null);
  const action = useRef();
  const [sortedInfo, setSortedInfo] = useState({});
  const [editingKey, setEditingKey] = useState(null);
  const userRole = useUserRole(); // Используем хук для получения роли пользователя

  const fetchData = async () => {
    try {
      const response = await axios.get('https://localhost:7119/api/Tariff/');
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Add a function to handle editing
  const handleEditTariff = (tariffId) => {
    setEditingKey(tariffId); // Set the editing key to the ID of the row being edited
    
    // Найти запись по tariffId
    const record = data.find(record => record.tariffId === tariffId);
  
    // Установить начальные значения для редактирования
    setSelectedName(record.name);
    setSelectedMinutes(record.minutes);
    setSelectedGB(record.gb);
    setSelectedSMS(record.sms);
    setSelectedCost(record.cost);
  };

  const saveEdit = async (record) => {
    try {
      const updatedTariff = {
        ...record,
        name: selectedName || record.name,
        cost: selectedCost || record.cost,
        gb: selectedGB || record.gb,
        minutes: selectedMinutes || record.minutes,
        sms: selectedSMS || record.sms
      };
      
      // Отправляем запрос на обновление данных тарифа
      await axios.put(`https://localhost:7119/api/Tariff/${record.tariffId}`, updatedTariff);
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

  const filteredData = data.filter((tariff) => {
    const isActive = new Date(tariff.dateOpening) >= new Date(new Date().getFullYear() - 1, new Date().getMonth(), new Date().getDate());
    const isBlocked = !isActive;
    const searchNameLower = searchName.toLowerCase();
  
    const nameMatch = tariff.name && tariff.name.toLowerCase().includes(searchNameLower);
    
    let isMatch = true;
  
    if (searchName) {
      isMatch = nameMatch;
    } 
  
    return isMatch && ((isActive && showActive) || (isBlocked && showBlocked)) ;
  });
  
  useEffect(() => {
    fetchData();
  }, []);

  const handleCloseReportModal = () => {
    setReportModalVisible(false);
  };

  const handleOpenReportModal = () => {
    setReportModalVisible(true);
  };

  const handleSearchName = (value: string) => {
    setSearchName(value);
  };

  const handleDeleteTariff = async (tariffId: number) => {
    try {
      await axios.delete(`https://localhost:7119/api/Tariff/${tariffId}`);
    
      // Проверяем успешность запроса
      message.success('Тариф успешно удален');
      // Успешно удалено, обновляем данные на основной странице тарифов
      fetchData();
    } catch (error) {
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

  const fetchTransactions = async (tariffId) => {
    try {
      const response = await axios.get(`https://localhost:7119/api/Transactions/ByTariffId/${tariffId}`);
      setTransactions(response.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const handleViewTransactions = (tariffId) => {
    setSelectedTariffId(tariffId);
    fetchTransactions(tariffId);
  };

  const handleShowActiveChange = (checked: boolean) => {
    setShowActive(checked);
  };

  const handleShowBlockedChange = (checked: boolean) => {
    setShowBlocked(checked);
  };

  return (
    <>
      {userRole === 'admin' && ( // Проверяем роль пользователя
        <Button type="primary" key="reportsPanel" onClick={handleOpenReportModal}>
          <FileTextOutlined /> Панель 
        </Button>
      )}
      <div style={{ marginBottom: '16px' }}></div>
        <div style={{ marginBottom: '16px' }}>
        <Input
          prefix={<SearchOutlined />}
          placeholder="Поиск по названию тарифа"
          onChange={(e) => handleSearchName(e.target.value)}
          style={{ width: '300px', marginRight: '16px' }}
        />
        <span style={{ marginRight: '16px' }}>
          <Switch checked={showActive} onChange={handleShowActiveChange} /> Активные
        </span>
        <span>
          <Switch checked={showBlocked} onChange={handleShowBlockedChange} /> Архивные
        </span>
      </div>
      {userRole === 'admin' && ( // Проверяем роль пользователя
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setModalVisible(!modalVisible)} // Изменяем обработчик события onClick для открытия/закрытия модального окна
        >
          Создать
        </Button>
      )}

      <Table
        rowKey="tariffId"
        columns={[
          {
            title: 'Название',
            dataIndex: 'name',
            render: (text, record) => {
              const isEditing = record.tariffId === editingKey;
              return isEditing ? (
                <Input defaultValue={record.name} value={selectedName} onChange={(e) => setSelectedName(e.target.value)}/>
              ) : record.name;
            },
          },
          {
            title: 'Дата открытия',
            dataIndex: 'dateOpening',
            valueType: 'dateTime',
          },
          {
            title: 'ID тарифа',
            dataIndex: 'tariffId',
          },
          {
            title: 'Минуты',
            dataIndex: 'minutes',
            render: (text, record) => {
              const isEditing = record.tariffId === editingKey;
              return isEditing ? (
                <Input value={selectedMinutes} defaultValue={record.minutes} onChange={(e) => setSelectedMinutes(e.target.value)}/>
              ) : record.minutes;
            },
          },
          {
            title: 'ГБ',
            dataIndex: 'gb',
            render: (text, record) => {
              const isEditing = record.tariffId === editingKey;
              return isEditing ? (
                <Input value={selectedGB} defaultValue={record.gb} onChange={(e) => setSelectedGB(e.target.value)}/>
              ) : record.gb;
            },
          },
          {
            title: 'СМС',
            dataIndex: 'sms',
            render: (text, record) => {
              const isEditing = record.tariffId === editingKey;
              return isEditing ? (
                <Input value={selectedSMS} defaultValue={record.sms} onChange={(e) => setSelectedSMS(e.target.value)}/>
              ) : record.sms;
            },
          },
          {
            title: 'Стоимость',
            dataIndex: 'cost',
            render: (text, record) => {
              const isEditing = record.tariffId === editingKey;
              return isEditing ? (
                <Input value={selectedCost} defaultValue={record.cost} onChange={(e) => setSelectedCost(e.target.value)}/>
              ) : record.cost;
            },
          },
          {
            title: 'Действия',
            render: (text, record) => {
              const isEditing = record.tariffId === editingKey;
              return (
                <span>
                  {isEditing ? (
                    <>
                      <Popconfirm title="Подтвердить редактирование?" onConfirm={() => saveEdit(record)}>
                        <Button type="primary" icon={<EditOutlined />} style={{ marginRight: 8 }}></Button>
                      </Popconfirm>
                      <Popconfirm title="Отменить редактирование?" onConfirm={() => cancelEdit()}>
                        <Button icon={<CloseOutlined />}></Button>
                      </Popconfirm>
                    </>
                  ) : (
                    <>
                     {userRole === 'admin' && ( // Проверяем роль пользователя
                      <Button type="primary" icon={<EditOutlined />} onClick={() => handleEditTariff(record.tariffId)}></Button> )}
                      <Button type="default" icon={<EyeOutlined />} onClick={() => handleViewTransactions(record.tariffId)} style={{ marginLeft: 8 }}></Button>
                      {userRole === 'admin' && ( // Проверяем роль пользователя
                        <Popconfirm
                          title="Вы уверены, что хотите удалить этот тариф?"
                          onConfirm={() => handleDeleteTariff(record.tariffId)}
                          okText="Да"
                          cancelText="Нет"
                        >
                          <Button type="danger" icon={<DeleteOutlined />} style={{ marginLeft: 8 }}></Button>
                        </Popconfirm>
                      )}
                    </>
                  )}
                </span>
              );
            },
            search: false,
          },
          
        ]}
        dataSource={filteredData}
        pagination={false}
      />
      <ReportTariffModal visible={reportModalVisible} onClose={handleCloseReportModal} />
      <AddTariffModal visible={modalVisible} onCancel={() => setModalVisible(false)} onAdd={fetchData} />
      <TransactionsModal visible={selectedTariffId !== null} onClose={() => setSelectedTariffId(null)} transactions={transactions} />
    </>
  );
};
