import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PageContainer } from '@ant-design/pro-components';
import { Card, message } from 'antd';

const InfoCard: React.FC<{
  title: string;
  index: number;
  desc: string;
}> = ({ title, index, desc }) => {
  const [contractData, setContractData] = useState([]);

  const checkAndCloseContracts = async (contracts) => {
    try {
      for (const contract of contracts) {
        await axios.put(`https://localhost:7119/api/Contract/${contract.contractId}/checkAndClose`);
      }
      fetchData();
    } catch (error) {
      console.error('Error checking and closing contracts:', error);
      // message.error('Ошибка при проверке и закрытии контрактов');
    }
  };

  const fetchData = async () => {
    try {
      const response = await axios.get('https://localhost:7119/api/Contract');
      setContractData(response.data);
      await checkAndCloseContracts(response.data);
    } catch (error) {
      console.error('Error fetching contract data:', error);
      message.error('Ошибка при получении данных контракта');
    }
  };

  const chargeMonthlyPaymentForAllContracts = async () => {
    try {
      for (const contract of contractData) {
        await axios.post(`https://localhost:7119/api/Contract/${contract.contractId}/charge-monthly-payment`);
      }
      // message.success('- ДЕНЬГИ');
    } catch (error) {
      console.error('Error charging monthly payment for all contracts:', error);
      // message.error('Ошибка при списании ежемесячной платы для всех контрактов');
    }
  };

  const updateCostDetails = async () => {
    try {
      await axios.put('https://localhost:7119/api/CostDetails/updateCostDetails');
      // message.success('CostDetails updated successfully');
    } catch (error) {
      console.error('Error updating cost details:', error);
      message.error('Ошибка при обновлении деталей стоимости');
    }
  };
  const updateDeposits = async () => {
    try {
      await axios.put('https://localhost:7119/api/Depositing/updateDeposits');
      // message.success('Deposits updated successfully');
    } catch (error) {
      console.error('Error updating deposits:', error);
      message.error('Ошибка при обновлении депозитов');
    }
  };
  useEffect(() => {
    const initializeData = async () => {
      await fetchData();
      await chargeMonthlyPaymentForAllContracts();
      await updateCostDetails();
      await updateDeposits();
    };

    initializeData();
  }, []);

  return (
    <div style={{ minWidth: '220px', flex: 1 }}>
      <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
        <div
          style={{
            width: 48,
            height: 48,
            lineHeight: '22px',
            backgroundSize: '100%',
            textAlign: 'center',
            padding: '8px 16px 16px 12px',
            color: '#FFF',
            fontWeight: 'bold',
            backgroundImage:
              "url('https://gw.alipayobjects.com/zos/bmw-prod/daaf8d50-8e6d-4251-905d-676a24ddfa12.svg')",
          }}
        >
          {index}
        </div>
        <div style={{ fontSize: '16px', paddingBottom: 8 }}>{title}</div>
      </div>
      <div style={{ fontSize: '14px', textAlign: 'justify', lineHeight: '22px', marginBottom: 8 }}>{desc}</div>
    </div>
  );
};

const Welcome: React.FC = () => {
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!userId) {
          console.error('User ID not found in localStorage');
          return;
        }

        const response = await axios.get(`https://localhost:7119/api/User/${userId}`);
        const userData = response.data;

        setUserName(userData.name);
        setUserRole(userData.roleId_FK === 2 ? 'администратор' : 'пользователь');
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [userId]);

  return (
    <PageContainer>
      <Card
        style={{ borderRadius: 8 }}
        bodyStyle={{
          background:
            'linear-gradient(75deg, #FBFDFF 0%, #F5F7FF 100%)',
        }}
      >
        <div
          style={{
            backgroundPosition: '100% -30%',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '274px auto',
            backgroundImage:
              "url('https://i.ibb.co/HpqXDcy/image.png')",
          }}
        >
          <div style={{ fontSize: '20px' }}>
            Добро пожаловать в MobileOperator, {userName}!
          </div>
          <p
            style={{
              fontSize: '14px',
              marginTop: 16,
              marginBottom: 32,
              width: '65%',
            }}
          >
            Наше приложение MobileOperator предоставляет операторам и администраторам удобный и
            полный инструментарий для эффективного управления тарифами, договорами и клиентской
            базой, а также генерирования необходимых отчетов.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
            <InfoCard index={1} title="Клиентская база" desc="" />
            <InfoCard index={2} title="Заключенные контракты" desc="" />
            <InfoCard index={3} title="Тарифные планы" desc="" />
            <InfoCard index={4} title="Подписки" desc="" />
          </div>
        </div>
      </Card>
    </PageContainer>
  );
};

export default Welcome;
