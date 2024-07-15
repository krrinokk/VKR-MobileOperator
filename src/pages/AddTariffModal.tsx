import React, { useState, useEffect } from 'react';
import { Button, message, Steps, Modal, Input, Form, Tag, List, Avatar  } from 'antd';
import axios from 'axios';

const { Step } = Steps;
const { TextArea } = Input;
const FormItem = Form.Item;

const AddTariffModal = ({ visible, onCancel, onAdd }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [tariffName, setTariffName] = useState('');
  const [minutes, setMinutes] = useState('');
  const [gb, setGb] = useState('');
  const [sms, setSms] = useState('');
  const [cost, setCost] = useState('');
  const [categoryTransaction, setTransactions] = useState([]);
  const [createdTariffId, setCreatedTariffId] = useState(null);
  const [transactionCosts, setTransactionCosts] = useState({});
  const [transactionAdded, setTransactionAdded] = useState(false);


  const handleTransactionInputChange = (e, transactionId) => {
    const { value } = e.target;
    setTransactionCosts(prevState => ({
      ...prevState,
      [transactionId]: value
    }));
  };
  
  


 const createTransactions = async () => {
  try {
    for (const transaction of categoryTransaction) {
      const transactionData = {
        cost: transactionCosts[transaction.categoryTransactionId],
        tariffId_FK: createdTariffId,
        categoryTransaction_FK: transaction.categoryTransactionId
      };

      console.log('Отправляем запрос на создание транзакции с данными:', transactionData);

      const response = await axios.post('https://localhost:7119/api/Transactions', transactionData);
      
      if (response.status !== 201) {
        console.error('Ошибка при создании транзакции:', response.data);
      } else {
        console.log('Транзакция успешно создана:', response.data);
      }
    }
    
    message.success('Транзакции успешно созданы');
  } catch (error) {
    console.error('Ошибка при создании транзакций:', error);
    if (error.response && error.response.status === 400) {
      message.error(error.response.data.message);
    } else {
      message.error('Произошла ошибка при создании транзакций');
    }
  }
};

  
    
  

  const handleAdd = async () => {
    try {
      const response = await axios.post('https://localhost:7119/api/Tariff', {
        name: tariffName,
        minutes: minutes,
        gb: gb,
        sms: sms,
        cost: cost
      });

      if (response.status === 201) {
        setCreatedTariffId(response.data.tariffId); // Сохраняем ID созданного тарифа
        message.success('Тариф успешно добавлен');
        setVisible(false);
        onAdd(); // Вызываем колбэк после успешного добавления тарифа
      } else {
        console.error('Ошибка при добавлении тарифа:', response.data);
      }
    } catch (error) {
      console.error('Ошибка при добавлении тарифа:', error);
      if (error.response && error.response.status === 400) {
        message.error(error.response.data.message);
      } else {
        message.error('Произошла ошибка при добавлении тарифа');
      }
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get('https://localhost:7119/api/CategoryTransaction');
      setTransactions(response.data);
    } catch (error) {
      console.error('Ошибка при загрузке транзакций:', error);
    }
  };
  // const handleAddTransaction = async (categoryTransactionId) => {
  //   setTransactionAdded(true);
  //   try {
  //     const response = await axios.post('https://localhost:7119/api/Transactions', {
  //       cost: transactionCosts[categoryTransactionId],
  //       tariffId_FK: createdTariffId,
  //       categoryTransaction_FK: categoryTransactionId
  //     });
     
  //     if (response.status === 204) {
       
  //       message.success('Транзакция успешно создана');
  //     } else {
  //       console.error('Ошибка при создании транзакции:', response.data);
  //     }
  //   } catch (error) {
  //     console.error('Ошибка при создании транзакции:', error);
    
  //   }
  // };
  
  const renderItem = (transaction) => (
    <List.Item
      key={transaction.categoryTransactionId}
    >
      <List.Item.Meta
        avatar={<Avatar src={'https://gw.alipayobjects.com/zos/antfincdn/UCSiy1j6jx/xingzhuang.svg'} />}
        title={<span style={{ fontSize: '12px' }}>{transaction.name}</span>}
        description={(
          <div>
            <Tag color="#5BD8A6">Транзакция</Tag>
            <Input 
              placeholder="Введите стоимость" 
              value={transactionCosts[transaction.categoryTransactionId] || ''}
              onChange={(e) => handleTransactionInputChange(e, transaction.categoryTransactionId)} 
            />
            {/* <Button type="primary" onClick={() => handleAddTransaction(transaction.categoryTransactionId)}>
              Добавить
            </Button> */}
          </div>
        )}
      />
    </List.Item>
  );
  


  const steps = [
    {
      title: 'Добавление тарифа',
      content: (
        <>
          <FormItem label="Название тарифа">
            <Input value={tariffName} onChange={(e) => setTariffName(e.target.value)} />
          </FormItem>
          <FormItem label="Минуты">
            <Input value={minutes} onChange={(e) => setMinutes(e.target.value)} />
          </FormItem>
          <FormItem label="Гигабайты">
            <Input value={gb} onChange={(e) => setGb(e.target.value)} />
          </FormItem>
          <FormItem label="СМС">
            <Input value={sms} onChange={(e) => setSms(e.target.value)} />
          </FormItem>
          <FormItem label="Стоимость">
            <Input value={cost} onChange={(e) => setCost(e.target.value)} />
          </FormItem>
        </>
      ),
    },
    {
      title: 'Транзакции',
      content: (
        <>
          {/* <div>Созданный тариф ID: {createdTariffId}</div> */}
          <List
            itemLayout="horizontal"
            dataSource={categoryTransaction}
            renderItem={renderItem}
          />
        </>
      ),
    }
  ];

  const next = async () => {
    try {
      const response = await axios.post('https://localhost:7119/api/Tariff', {
        name: tariffName,
        minutes: minutes,
        gb: gb,
        sms: sms,
        cost: cost
      });
  
      if (response.status === 201) {
        setCreatedTariffId(response.data.tariffId); // Сохраняем ID созданного тарифа
       
        setCurrentStep(currentStep + 1);
        if (currentStep === 1) {
          fetchTransactions(); // Загружаем транзакции при переходе на второй шаг
        }
        message.success('Тариф успешно добавлен');
        setVisible(false);
        onAdd(); // Вызываем колбэк после успешного добавления тарифа
      } else {
        console.error('Ошибка при добавлении тарифа:', response.data);
      }
    } catch (error) {
      console.error('Ошибка при добавлении тарифа:', error);
      if (error.response && error.response.status === 400) {
        message.error(error.response.data.message);
      }
    }
  };
  

  const prev = () => {
    setCurrentStep(currentStep - 1);
  };

  return (
    <>
      <Modal
        title="Добавить тариф"
        visible={visible}
        onCancel={onCancel}
        footer={null} // Отключаем футер для кастомного управления кнопками
      >
        <Steps current={currentStep}>
          {steps.map(item => (
            <Step key={item.title} title={item.title} />
          ))}
        </Steps>
        <div className="steps-content">{steps[currentStep].content}</div>
        <div className="steps-action">
          {currentStep < steps.length - 1 && (
            <Button type="primary" onClick={next}>
              Далее
            </Button>
          )}
        {!transactionAdded && currentStep === steps.length - 1 && (
  <Button type="primary" onClick={createTransactions}>
    Добавить
  </Button>


          )}
          {currentStep > 0 && (
            <Button style={{ margin: '0 8px' }} onClick={prev}>
              Назад
            </Button>
          )}
        </div>
      </Modal>
    </>
  );
};

export default AddTariffModal;
