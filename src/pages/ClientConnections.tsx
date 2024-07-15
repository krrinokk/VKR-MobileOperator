import React, { useState, useEffect } from 'react';
import { Modal, Button, Tag, Spin, message } from 'antd';
import axios from 'axios';
import { ProList } from '@ant-design/pro-components';

const ConnectsModal = ({ visible, onClose, clientId }) => {
  const [loading, setLoading] = useState(false);
  const [connects, setConnects] = useState([]);

  useEffect(() => {
    const fetchConnects = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`https://localhost:7119/api/Client/contracts/${clientId}/related-contracts`);
        setConnects(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Ошибка при загрузке подключений:', error);
        setLoading(false);
      }
    };

    if (visible && clientId) {
      fetchConnects();
    }
  }, [visible, clientId]);

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
      message.error('Ошибка при получении данных тарифа');
    }
  };

  const connectsDataSource = connects.map((connect, index) => ({
    id: index,
    title: (
      <span style={{ fontSize: '14px' }}>{/* Устанавливаем размер шрифта 14px */}
        {connect.numberPhone}
      </span>
    ),
    subTitle: <Tag color="#5BD8A6">{connect.status}</Tag>,
    description: (
      <div>
        <div onClick={() => handleTariffIdClick(connect.tariffId)}>Подключенный тариф: {connect.tariffName}</div>
        <div>Остатки смс: {connect.smsRemaining}</div>
        <div>Остатки минут: {connect.minutesRemaining}</div>
        <div>Остатки гб: {connect.gbRemaining}</div>
      </div>
    ),
    avatar: 'https://gw.alipayobjects.com/zos/antfincdn/UCSiy1j6jx/xingzhuang.svg',
  }));

  return (
    <Modal
      title="Оформленные договоры"
      visible={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Закрыть
        </Button>
      ]}
      width={800} // Установка ширины модального окна
    >
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
        dataSource={connectsDataSource}
        pagination={{ pageSize: 6 }}
      />
    </Modal>
  );
};

export default ConnectsModal;
