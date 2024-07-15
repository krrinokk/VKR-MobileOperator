import React, { useState, useEffect } from 'react';
import { Modal, Tabs, Tag, Button, message, DatePicker, Select, Empty } from 'antd';

import { CloseOutlined, PlusOutlined  } from '@ant-design/icons';
import { ProList } from '@ant-design/pro-components';
import moment from 'moment';
import axios from 'axios';
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

const { Option } = Select;
const ConnectedServicesModal = ({ visible, onClose, costDetails, writeOffs, depositings,  servicesToConnect,selectedContractId,  contractData }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [availableTariffs, setAvailableTariffs] = useState([]);
  const [selectedTariff, setSelectedTariff] = useState(null);
  const [tariff, setTariff] = useState([]);
  const [services, setServices] = useState([]);
  const [totalPayment, setTotalPayment] = useState([]);
  const [wasMonthlyPayment, setWasTotalPayment] = useState([]);
  const [events, setEvents] = useState([]);
  const fetchTotalPayment = async (selectedContractId) => {
    try {
      const response = await axios.get(`https://localhost:7119/api/Contract/${selectedContractId}/total-payment`);
      setTotalPayment(response.data.totalPayment);
    } catch (error) {
      console.error('Error fetching total payment:', error);
      // message.error('Ошибка при получении общей ежемесячной выплаты');
    }
  };
  const fetchWasTotalPayment = async (selectedContractId) => {
    try {
      const response = await axios.get(`https://localhost:7119/api/Contract/${selectedContractId}/Was-monthly-payment`);
      setWasTotalPayment(response.data.totalPayment);
    } catch (error) {
      console.error('Error fetching total payment:', error);
      // message.error('Ошибка при получении общей ежемесячной выплаты');
    }
  };
  const fetchServices= async (selectedContractId) => {
    try {
      const response = await axios.get(`https://localhost:7119/api/Contract/${selectedContractId}/services`);
      setServices(response.data);
    } catch (error) {
      console.error('Error fetching :', error);
      // message.error('Failed to fetch tariff');
    }
  };

  const fetchTariff = async (selectedContractId) => {
    try {
      const response = await axios.get(`https://localhost:7119/api/Contract/contracts/${selectedContractId}/related-tariff`);
      setTariff(response.data);
    } catch (error) {
      console.error('Error fetching tariff:', error);
      // message.error('Failed to fetch tariff');
    }
  };


  const fetchAvailableTariffs = async () => {
    try {
      const response = await axios.get(`https://localhost:7119/api/Contract/contracts/${selectedContractId}/available-tariffs`);
      setAvailableTariffs(response.data);
    } catch (error) {
      console.error('Error fetching available tariffs:', error);
    }
  };



  const fetchEvents = async (selectedContractId) => {
    try {
      const response = await axios.get(`https://localhost:7119/api/Contract/${selectedContractId}/events`);
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching available events:', error);
    }
  };







  
  // Вызываем функцию при монтировании компонента
  useEffect(() => {
    // Функция для получения списка доступных тарифов
  fetchServices(selectedContractId);
    fetchAvailableTariffs();
    fetchTotalPayment(selectedContractId);
    fetchTariff(selectedContractId);
    fetchEvents(selectedContractId);
    fetchWasTotalPayment(selectedContractId);
  }, [selectedContractId]);





  const eventsDataSource = events?.map((events, index) => ({
    
    
    id: index,
    title: events.name,
    subTitle: <Tag color="#5BD8A6">{events.date}</Tag>,

    // description: (
    //   <div>
    //     <div>{service.description}</div>
    //   </div>
    // ),
    avatar: 'https://gw.alipayobjects.com/zos/antfincdn/UCSiy1j6jx/xingzhuang.svg',
    // content: (
    //   <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
    //     <div style={{ width: 200 }}>
    //       <div>{service.cost} Р</div>
    //     </div>
    //   </div>
    // ),
  }));






  const connectedServicesDataSource = services?.map((service, index) => ({
    
    
    id: index,
    title: service.name,
    subTitle: <Tag color="#5BD8A6">Подключенная услуга</Tag>,
    actions: [
      <Button
      icon={<CloseOutlined />}
      key="operate"
      onClick={() => handleDisconnectService(service.serviceId)}
    />
    
    ],
    description: (
      <div>
        <div>{service.description}</div>
      </div>
    ),
    avatar: 'https://gw.alipayobjects.com/zos/antfincdn/UCSiy1j6jx/xingzhuang.svg',
    content: (
      <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
        <div style={{ width: 200 }}>
          <div>{service.cost} Р</div>
        </div>
      </div>
    ),
  }));


  const tariffDataSource = {
  
    title: tariff.name,
    subTitle: <Tag color="#5BD8A6">Подключенный тариф</Tag>,
    description: (
      <div>
        <div>Количество смс: {tariff.sms}</div>
        <div>Количество минут: {tariff.minutes}</div>
        <div>Количество гб: {tariff.gb}</div>
      </div>
    ),
    avatar: 'https://gw.alipayobjects.com/zos/antfincdn/UCSiy1j6jx/xingzhuang.svg',
    content: (
      <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
        <div style={{ width: 200 }}>
          <div>{tariff.cost} Р</div>
        </div>
      </div>
    ),
  };
  





  const handleDisconnectService = async (serviceId) => {
    try {
      // Выполняем запрос на отключение выбранной услуги
      await axios.post(`https://localhost:7119/api/Contract/${selectedContractId}/disconnect-service/${serviceId}`);
      fetchServices(selectedContractId);
      fetchEvents(selectedContractId);
      // Если запрос выполнен успешно, обновляем данные о подключенных услугах
      // connectedServicesDataSource(prevDataSource => prevDataSource.filter(service => service.id !== serviceId));
      
    fetchTotalPayment(selectedContractId);
      message.success('Услуга успешно отключена!');
    } catch (error) {
      console.error('Ошибка при выполнении запроса:', error);
      // Если есть текст ошибки в теле ответа, отображаем его
      if (error.response && error.response.data) {
        message.error(error.response.data);
      } else {
        // Если нет текста ошибки, выводим сообщение об общей ошибке
        // message.error('Произошла ошибка при выполнении запроса');
      }
    }
  };
  

  const depositingsDataSource = depositings?.map((depositing, index) => ({
    id: index,
    title: depositing.date,
  
    avatar: 'https://gw.alipayobjects.com/zos/antfincdn/UCSiy1j6jx/xingzhuang.svg',
    subTitle: <Tag color="#2db7f5">Зачисление</Tag>,
    actions: [],
    content: (
      <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
        <div style={{ width: 200 }}>
          <div>{depositing.sum} Р</div>
           
        </div>
      </div>
    ),
  }));



  const filterRecordsByDateRange = (dataSource) => {
    if (startDate && endDate) {
      const filteredList = dataSource.filter(item => {
        const itemDate = moment(item.title);
        return itemDate.isSameOrAfter(startDate, 'day') && itemDate.isSameOrBefore(endDate, 'day');
      });
      return filteredList;
    } else {
      return dataSource;
    }
  };



  const writeOffsDataSource = writeOffs?.map((writeOff, index) => ({
    id: index,
    title: moment(writeOff.dateWriteOff).format('YYYY-MM-DD'), // Форматирование даты
  
    avatar: 'https://gw.alipayobjects.com/zos/antfincdn/UCSiy1j6jx/xingzhuang.svg',
    subTitle: <Tag color="#2db7f5">Списание</Tag>,
    actions: [],
    content: (
      <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
        <div style={{ width: 200 }}>
          <div>{writeOff.sum} Р</div>
           
        </div>
      </div>
    ),
  }));

  const costDetailsDataSource = costDetails.map((detail, index) => ({
    id: index,
    title: detail.dateEnd,
    avatar: 'https://gw.alipayobjects.com/zos/antfincdn/UCSiy1j6jx/xingzhuang.svg',
    subTitle: <Tag color="#2db7f5">Расходы</Tag>,
    actions: [],
    content: (
      <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
        <div style={{ width: 200 }}>
          <div>{detail.cost} Р</div>
             <div>{detail.categoryName}</div>
             <div>{detail.addressee}</div>
        </div>
      </div>
      
    ),
  }));
  const combinedList = [...costDetailsDataSource, ...writeOffsDataSource];
  combinedList.sort((a, b) => moment(b.title).valueOf() - moment(a.title).valueOf());

  const handleConnectService = async () => {
    try {
      // Выполняем запрос на подключение выбранной услуги
      await axios.post(`https://localhost:7119/api/Contract/${selectedContractId}/connect-service/${selectedService}`);
      
      // После успешного подключения закрываем модальное окно
     fetchTotalPayment(selectedContractId);
     fetchServices(selectedContractId);
      message.success('Услуга успешно подключена!');
    } catch (error) {
      console.error('Ошибка при выполнении запроса:', error);
      // Если есть текст ошибки в теле ответа, отображаем его
      if (error.response && error.response.data) {
        message.error(error.response.data);
      } else {
        // Если нет текста ошибки, выводим сообщение об общей ошибке
        message.error('Произошла ошибка при выполнении запроса');
      }
    }
  };
  const handlePereconnectTarif = async (contract) => {
    try {
      // Создаем новый объект с обновленными данными контракта, включая tariffId_FK
      const updatedContract = {
        ...contract, // Копируем все данные из контракта
        tariffId: selectedTariff // Обновляем только tariffId_FK
      };
  
      // Отправляем запрос на сервер, обновляя все данные контракта
      await axios.put(`https://localhost:7119/api/Contract/${selectedContractId}/smena-tarifa`, updatedContract);
  
      
      message.success('Тариф успешно изменен!');
      fetchAvailableTariffs();
      fetchTotalPayment(selectedContractId);
      fetchTariff(selectedContractId);
      fetchEvents(selectedContractId);
      // const response1 = await axios.get(`https://localhost:7119/api/Contract/contracts/${selectedContractId}/related-tariff`);
      // const updatedTariff = response1.data;
      // const response2 = await axios.get(`https://localhost:7119/api/Contract/contracts/${selectedContractId}/total-payment`);
      // const updatedTotalPayment = response2.data; // Функция для пересчета totalPayment

      // Обновляем состояния
      setSelectedTariff(null); // Сбрасываем выбранный тариф
      setTotalPayment(updatedTotalPayment); // Обновляем totalPayment
      setTariff(updatedTariff); // Обновляем данные о тарифе

    } catch (error) {
      console.error('Ошибка при выполнении запроса:', error);
      if (error.response && error.response.data) {
        message.error(error.response.data);
      } else if (error.message) {
        message.error(error.message);
      } else {
        message.error('Произошла ошибка при выполнении запроса');
      }
    }
  };
  
  
 
  return (
    <Modal
      title="Подробности"
      visible={visible}
      onCancel={onClose}
      footer={null}
      width={800}
    >
      <Tabs defaultActiveKey="tariff">
      <TabPane tab="Тариф">
      {/* <div style={{ marginTop: 16, textAlign: 'center' }}> */}
      <Select
            placeholder="Выберите новый тариф"
            style={{ width: 200, marginRight: 8 }}
            value={selectedTariff}
            onChange={setSelectedTariff}
          >
            {availableTariffs.map(tariff => (
              <Option key={tariff.tariffId} value={tariff.tariffId}>
                {tariff.name}, {tariff.cost} Р в месяц
              </Option>
            ))}
          </Select>
          <Button onClick={() => {
  const selectedContract = contractData.find(contract => contract.contractId === selectedContractId);
  handlePereconnectTarif(selectedContract);
}}>Поменять тариф</Button>
  
  {/* </div> */}
  <ProList
    metas={{
      title: {},
      subTitle: {},
      description: {},
      avatar: {},
      content: {},
      actions: {},
    }}
    rowKey="id"
    dataSource={[tariffDataSource]} // Обернуть tariffDataSource в массив
    footer={[
      <div key="total-payment" >
        <Tag color="#5BD8A6" style={{ fontSize: '18px' }}>Ежемесячная плата: {totalPayment} Р</Tag>
      </div>,
      <div key="next-billing-date">
        <Tag color="#5BD8A6" style={{ fontSize: '18px' }} >Следующее списание: {moment(wasMonthlyPayment).format('YYYY-MM-DD')}</Tag>
      </div>
    ]}
  />
 
</TabPane>


      <TabPane tab="Подключенные услуги" key="connectedServices">
          <Select
            placeholder={servicesToConnect.length === 0 ? "Все доступные услуги уже подключены" : "Выберите услугу"}
            style={{ width: 200, marginRight: 8 }}
            disabled={servicesToConnect.length === 0}
            value={selectedService}
            onChange={setSelectedService}
          >
            {servicesToConnect.map((service, index) => (
              <Option key={index} value={service.serviceId}>
                {service.name}
              </Option>
            ))}
          </Select>
            <Button
            key="connect-service"
            type="primary"
            onClick={handleConnectService}
          
          >
            <PlusOutlined /> Подключить
          </Button>
          {servicesToConnect.length === 0 && <Empty />}
          <ProList
            metas={{
              title: {},
              subTitle: {},
              description: {},
              avatar: {},
              content: {},
              actions: {},
            }}
            rowKey="id"
            dataSource={connectedServicesDataSource}
            pagination={{ pageSize: 6 }}
            footer={[
              <div key="total-payment" >
                <Tag color="#5BD8A6" style={{ fontSize: '18px' }}>Ежемесячная плата: {totalPayment} Р</Tag>
              </div>,
              <div key="next-billing-date">
                <Tag color="#5BD8A6" style={{ fontSize: '18px' }} >Следующее списание: {moment(wasMonthlyPayment).format('YYYY-MM-DD')}</Tag>
              </div>
            ]}
          />
        </TabPane>
        <TabPane tab="Расходы" key="costDetails">
        <DatePicker
            placeholder="Выберите начало промежутка"
            onChange={date => setStartDate(date)}
            style={{ marginRight: '10px' }}
          />
          <DatePicker
            placeholder="Выберите конец промежутка"
            onChange={date => setEndDate(date)}
          />
          <ProList
            metas={{
              title: {},
              subTitle: {},
              description: {},
              avatar: {},
              content: {},
              actions: {},
            }}
            rowKey="id"
            dataSource={filterRecordsByDateRange([...costDetailsDataSource, ...writeOffsDataSource])}
            pagination={{ pageSize: 6 }}
          />
        </TabPane>
       



        <TabPane tab="Пополнения" key="depositings">
          {/* <DatePicker
            placeholder="Выберите начало промежутка"
            onChange={date => setStartDate(date)}
            style={{ marginRight: '10px' }}
          />
          <DatePicker
            placeholder="Выберите конец промежутка"
            onChange={date => setEndDate(date)}
          /> */}
          <ProList
            metas={{
              title: {},
              subTitle: {},
              description: {},
              avatar: {},
              content: {},
              actions: {},
            }}
            rowKey="id"
            dataSource={filterRecordsByDateRange(depositingsDataSource)}
            pagination={{ pageSize: 6 }}
          />
        </TabPane>

        <TabPane tab="Подключения" key="events">
        <ProList
            metas={{
              title: {},
              subTitle: {},
              description: {},
              avatar: {},
              content: {},
              actions: {},
            }}
            rowKey="id"
            dataSource={eventsDataSource}
            pagination={{ pageSize: 6 }}
            footer={[
             
            ]}
          />
        </TabPane>



      </Tabs>
    </Modal>
  );
};

export default ConnectedServicesModal;
