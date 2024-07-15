import React, { useState } from 'react';
import { Modal, Input, Tag, Button, message, Popconfirm } from 'antd';
import { CloseOutlined, EditOutlined } from '@ant-design/icons';
import { ProList } from '@ant-design/pro-components';
import useUserRole from './useUserRole'; // Импортируем хук для получения роли пользователя
const TransactionsModal = ({ visible, transactions, onClose }) => {
  const [editedTransactionId, setEditedTransactionId] = useState(null);
  const [editedCost, setEditedCost] = useState({});
  const userRole = useUserRole(); // Используем хук для получения роли пользователя
  const handleEditCost = (transactionId) => {
    console.log(transactionId); // Выводим transactionId в консоль
    message.success('Стоимость транзакции успешно обновлена');
    // Завершаем редактирование
    setEditedTransactionId(null);
  };

  const handleInputChange = (transactionId, value) => {
    setEditedCost({ ...editedCost, [transactionId]: value });
  };

  const transactionsDataSource = transactions.map((transaction, index) => ({
    id: index,
    title: <span style={{ fontSize: '12px' }}>{transaction.name}</span>, 
    subTitle: <Tag color="#5BD8A6">Транзакция</Tag>,
    
    actions: userRole === 'admin' ? [ // Отображаем действия только для администраторов
      <>
        {editedTransactionId === transaction.transactionId ? (

          <Popconfirm
            title="Confirm editing?"
            onConfirm={() => handleEditCost(transaction.transactionId)}
            onCancel={() => setEditedTransactionId(null)}
            okText="Yes"
            cancelText="No"
          >
            
            <Button
              key={`edit-${transaction.transactionId}`}
              type="primary"
              icon={<EditOutlined />}
              style={{ marginRight: 8 }}
            />
          </Popconfirm>
        ) : (
          <Button
            key={`edit-${transaction.transactionId}`}
            type="primary"
            icon={<EditOutlined />}
            style={{ marginRight: 8 }}
            onClick={() => setEditedTransactionId(transaction.transactionId)}
          />
        )}
      </>,
      <Button
        key={`cancel-${transaction.transactionId}`}
        icon={<CloseOutlined />}
        style={{ marginRight: 8 }}
        onClick={() => setEditedTransactionId(null)}
      />
       ] : null,
    description: (
      <div>
        <div style={{ fontSize: '14px' }}>
          {editedTransactionId === transaction.transactionId ? (
            <Input
              defaultValue={transaction.cost}
              value={editedCost[transaction.transactionId] || transaction.cost}
              onChange={(e) => handleInputChange(transaction.transactionId, e.target.value)}
              onPressEnter={() => handleEditCost(transaction.transactionId)}
            />
          ) : (
            <span>{transaction.cost} Р</span>
          )}
        </div>
        {/* Добавьте другие данные о транзакции, если необходимо */}
      </div>
    ),
    avatar: 'https://gw.alipayobjects.com/zos/antfincdn/UCSiy1j6jx/xingzhuang.svg',
    content: (
      <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
        {/* Добавьте другие данные о транзакции, если необходимо */}
      </div>
    ),
  }));

  return (
    <Modal
      title="Транзакции"
      visible={visible}
      onCancel={onClose}
      footer={null}
      width={800}
    >
      <ProList
        rowKey="transactioId"
        dataSource={transactionsDataSource}
        metas={{
          title: { style: { fontSize: '14px' } }, // Устанавливаем размер шрифта для имени транзакции
          subTitle: {},
          description: {},
          avatar: {},
          content: {},
          actions: {},
        }}
      />
    </Modal>
  );
};

export default TransactionsModal;
