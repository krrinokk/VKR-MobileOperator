import React, { useState, useEffect } from 'react';
import { Button, Table, message, Modal, Form, Input, Select } from 'antd';
import axios from 'axios';
import { EyeOutlined, PlusOutlined, CloseOutlined } from '@ant-design/icons';
import ConnectedServicesModal from './ConnectedServices';
import useUserRole from './useUserRole'; // Импортируем хук для получения роли пользователя
const { Option } = Select;

const Contract = () => {
  const userRole = useUserRole(); // Используем хук для получения роли пользователя
  const [contractData, setContractData] = useState([]);
  const [clientsWithPositiveBalance, setClientsWithPositiveBalance] = useState([]);
  const [activeTariffs, setActiveTariffs] = useState([]);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [connectedServicesModalVisible, setConnectedServicesModalVisible] = useState(false);
  const [selectedContract, setSelectedContract] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibleAdd, setModalVisibleAdd] = useState(false);
  const [connectedServices, setConnectedServices] = useState([]);
  const [totalPayment, setTotalPayment] = useState(null);
  const [costDetails, setCostDetails] = useState([]);
  const [writeOffs, setWriteOffs] = useState([]);
  const [tariff, setTariff] = useState([]);
  const [servicesToConnect, setServicesToConnect] = useState([]);
  const [wasMonthlyPayment, setWasMonthlyPayment] = useState([]);
  const [depositings, setDepositings] = useState([]);
  const [form] = Form.useForm();
  const [selectedContractId, setSelectedContractId] = useState(null);

  const phoneInputPattern = /^(\+7 \(\d{3}\) \d{3}-\d{2}-\d{2})$/;


  const fetchData = async () => {
    try {
      const response = await axios.get('https://localhost:7119/api/Contract');
      setContractData(response.data);
   
    } catch (error) {
      console.error('Error fetching contract data:', error);
      message.error('Ошибка при получении данных контракта');
    }
  };



  useEffect(() => {
    fetchData();
    
  }, []);

  const fetchClientsWithPositiveBalance = async () => {
    try {
      const response = await axios.get('https://localhost:7119/api/Client/clients/positive-balance');
      setClientsWithPositiveBalance(response.data);
    } catch (error) {
      console.error('Error fetching clients with positive balance:', error);
      message.error('Ошибка при получении клиентов с положительным балансом');
    }
  };

  const fetchActiveTariffs = async () => {
    try {
      const response = await axios.get('https://localhost:7119/api/Tariff/tariffs/active');
      setActiveTariffs(response.data);
    } catch (error) {
      console.error('Error fetching active tariffs:', error);
      message.error('Ошибка при получении активных тарифов');
    }
  };

  useEffect(() => {
    fetchClientsWithPositiveBalance();
    fetchActiveTariffs();
  }, []);

  const handleClientIdClick = async (clientId) => {
    try {
      const response = await axios.get(`https://localhost:7119/api/Client/${clientId}`);
      const { lastName, firstName, patronymic, balance } = response.data;
      message.info({
        content: (
          <div style={{ textAlign: 'left' }}>
            <p><strong>Фамилия:</strong> {lastName}</p>
            <p><strong>Имя:</strong> {firstName}</p>
            <p><strong>Отчество:</strong> {patronymic}</p>
            <p><strong>Баланс:</strong> {balance}</p>
          </div>
        ),
        duration: 5,
      });
    } catch (error) {
      console.error('Error fetching client data:', error);
      message.error('Ошибка при получении данных клиента');
    }
  };

  const handleTariffIdClick = async (tariffId) => {
    try {
      const response = await axios.get(`https://localhost:7119/api/Tariff/${tariffId}`);
      const { name, dateOpening, minutes, gb, sms, cost } = response.data;
      message.info({
        content: (
          <div style={{ textAlign: 'left' }}>
            <p><strong>Название тарифа:</strong> {name}</p>
            <p><strong>Дата открытия:</strong> {dateOpening}</p>
            <p><strong>Минуты:</strong> {minutes}</p>
            <p><strong>GB:</strong> {gb}</p>
            <p><strong>SMS:</strong> {sms}</p>
            <p><strong>Плата:</strong> {cost}</p>
          </div>
        ),
        duration: 5,
      });
    } catch (error) {
      console.error('Error fetching tariff data:', error);
      // message.error('Ошибка при получении данных тарифа');
    }
  };

  const fetchDepositings = async (contractId) => {
    try {
      const response = await axios.get(`https://localhost:7119/api/Contract/${contractId}/depositings`);
      setDepositings(response.data);
    } catch (error) {
      console.error('Error fetching depositings:', error);
      message.error('Failed to fetch depositings');
    }
  };

  const fetchServicesToConnect = async (contractId) => {
    try {
      const response = await axios.get(`https://localhost:7119/api/Contract/${contractId}/services-to-connect`);
      setServicesToConnect(response.data);
    } catch (error) {
      console.error('Error fetching services:', error);
      message.error('Failed to fetch services');
    }
  };

  const fetchWriteOffs = async (contractId) => {
    try {
      const response = await axios.get(`https://localhost:7119/api/Contract/${contractId}/write-offs`);
      setWriteOffs(response.data);
    } catch (error) {
      console.error('Error fetching write-offs:', error);
      message.error('Failed to fetch write-offs');
    }
  };

  const fetchConnectedServices = async (contractId) => {
    try {
      const response = await axios.get(`https://localhost:7119/api/Contract/${contractId}/services`);
      setConnectedServices(response.data);
    } catch (error) {
      console.error('Error fetching connected services:', error);
      message.error('Ошибка при получении подключенных услуг');
    }
  };

  const fetchTotalPayment = async (contractId) => {
    try {
      const response = await axios.get(`https://localhost:7119/api/Contract/${contractId}/total-payment`);
      setTotalPayment(response.data.totalPayment);
    } catch (error) {
      console.error('Error fetching total payment:', error);
      // message.error('Ошибка при получении общей ежемесячной выплаты');
    }
  };

  const fetchCostDetailsByContractId = async (contractId) => {
    try {
      const response = await axios.get(`https://localhost:7119/api/CostDetails/${contractId}`);
      setCostDetails(response.data);
    } catch (error) {
      console.error('Error fetching cost details:', error);
      message.error('Ошибка при получении деталей расходов');
    }
  };

  const handleView = async (record) => {
    setSelectedContract(record);
    await fetchConnectedServices(record.contractId);
    await fetchWriteOffs(record.contractId);
    await fetchDepositings(record.contractId);
    await fetchTotalPayment(record.contractId);
    await fetchCostDetailsByContractId(record.contractId);
    await fetchServicesToConnect(record.contractId);
    setSelectedContractId(record.contractId);

    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setSelectedContract(null);
    setConnectedServices([]);
    setTotalPayment(null);
    setCostDetails([]);
    setWriteOffs([]);
    setTariff([]);
    setDepositings([]);
    setServicesToConnect([]);
    setWasMonthlyPayment([]);
    setSelectedContractId(null);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      const userId_FK = localStorage.getItem('userId');
      const contractData = { ...values, userId_FK };
      await axios.post('https://localhost:7119/api/Contract', contractData);
      message.success('Клиент успешно создан');
      setModalVisible(false);
      fetchData();
      form.resetFields();
    } catch (error) {
      console.error('Error creating client:', error);
      if (error.response && error.response.data) {
        message.error(error.response.data);
      }
    }
  };

  const handleCreate = () => {
    setModalVisibleAdd(true);
  };

  const handleModalCancel = () => {
    setModalVisible(false);
  };

  const handleModalCancelAdd = () => {
    setModalVisibleAdd(false);
  };

  const handleCloseContract = async (contract) => {
    try {
        const updatedContract = { ...contract, status: 'Закрытый' };
        await axios.put(`https://localhost:7119/api/Contract/updateStatus${contract.contractId}`, updatedContract);
        message.success('Статус контракта успешно обновлен на "Закрытый"');
        fetchData();
    } catch (error) {
        console.error('Error updating contract status:', error);
        message.error('Ошибка при обновлении статуса контракта');
    }
};


  return (
    <>
       {userRole === 'user' && ( // Проверяем роль пользователя
      <Button
        key="button"
        icon={<PlusOutlined />}
        onClick={handleCreate}
        type="primary"
      >
        Создать
      </Button>
      )}
      <Table
        dataSource={contractData}
        rowKey="contractId"
        pagination={false}
        columns={[
          {
            title: 'ID',
            dataIndex: 'contractId',
            key: 'contractId',
          },
          {
            title: 'Статус',
            dataIndex: 'status',
            key: 'status',
          },
          {
            title: 'Номер телефона',
            dataIndex: 'numberPhone',
            key: 'numberPhone',
          },
          {
            title: 'ID клиента',
            dataIndex: 'clientId_FK',
            key: 'clientId_FK',
            render: (text, record) => (
              <Button type="link" onClick={() => handleClientIdClick(record.clientId_FK)}>
                {record.clientId_FK}
              </Button>
            ),
          },
          {
            title: 'ID тарифа',
            dataIndex: 'tariffId',
            key: 'tariffId',
            render: (text, record) => (
              <Button type="link" onClick={() => handleTariffIdClick(record.tariffId)}>
                {record.tariffId}
              </Button>
            ),
          },
          {
            title: 'SMS',
            dataIndex: 'smsRemaining',
            key: 'smsRemaining',
          },
          {
            title: 'Минуты',
            dataIndex: 'minutesRemaining',
            key: 'minutesRemaining',
          },
          {
            title: 'GB',
            dataIndex: 'gbRemaining',
            key: 'gbRemaining',
          },
          ...(userRole === 'user' ? [{
            title: 'Действия',
            key: 'action',
            render: (text, record) => (
              <>
                <Button type="primary" onClick={() => handleView(record)} icon={<EyeOutlined />} />
                <Button type="danger" onClick={() => handleCloseContract(record)} icon={<CloseOutlined />} />
              </>
            ),
          }] : []),
        ]}
      />
      <ConnectedServicesModal
        visible={modalVisible}
       
        costDetails={costDetails}
        writeOffs={writeOffs}
        depositings={depositings}
        onClose={handleModalClose}
       
        servicesToConnect={servicesToConnect}
        selectedContractId={selectedContractId}
        contractData={contractData}
      />
      <Modal
        title="Создать нового клиента"
        visible={modalVisibleAdd}
        onCancel={handleModalCancelAdd}
        footer={null}
      >
        <Form form={form} labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} onFinish={handleModalOk}>
          <Form.Item
            label="Номер телефона"
            name="numberPhone"
            rules={[
              { required: true, message: 'Введите номер телефона' },
              {
                pattern: phoneInputPattern,
                message: 'Номер телефона должен быть в формате +7 (123) 456-78-90',
              },
            ]}
          >
            <Input
              placeholder="+7 (___) ___-__-__"
              maxLength={18}
              onChange={(e) => {
                const { value } = e.target;
                const cleanValue = value.replace(/[^\d+]/g, '');
                const formattedValue = cleanValue.replace(
                  /(\d{1,3})(\d{0,3})(\d{0,2})(\d{0,2})/,
                  (_, p1, p2, p3, p4) => {
                    let formatted = '';
                    if (p1) formatted += `+7 (${p1}`;
                    if (p2) formatted += `) ${p2}`;
                    if (p3) formatted += `-${p3}`;
                    if (p4) formatted += `-${p4}`;
                    return formatted;
                  }
                );
                e.target.value = formattedValue;
              }}
            />
          </Form.Item>
          <Form.Item
            label="Номер клиента"
            name="clientId_FK"
            rules={[{ required: true, message: 'Выберите номер клиента' }]}
          >
            <Select>
              {clientsWithPositiveBalance.map(client => (
                <Option key={client.clientId} value={client.clientId}>{client.clientId} - {client.fullName}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Номер тарифа"
            name="tariffId"
            rules={[{ required: true, message: 'Выберите номер тарифа' }]}
          >
            <Select>
              {activeTariffs.map(tariff => (
                <Option key={tariff.tariffId} value={tariff.tariffId}>{tariff.tariffId} - {tariff.name}</Option>
              ))}
            </Select>
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

export default Contract;
