import React, { useEffect, useRef, useState } from 'react';
import { Button, Input, Space, Tag, message } from 'antd';
import { ProList } from '@ant-design/pro-components';
import { DeleteOutlined, EditOutlined, MessageFilled } from '@ant-design/icons';

const { TextArea } = Input;

// Импорты

const ChatApp = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [editingMessageId, setEditingMessageId] = useState(null); // Состояние для отслеживания редактируемого сообщения
  const [editedMessage, setEditedMessage] = useState(''); // Состояние для хранения отредактированного сообщения
  const [username, setUsername] = useState('User');
  const messagesEndRef = useRef(null);

  // Эффект для загрузки сообщений при монтировании компонента
  useEffect(() => {
    fetchMessages();
  }, []);

  // Функция для загрузки сообщений с сервера
  const fetchMessages = async () => {
    try {
      const response = await fetch('https://localhost:7119/api/Chat');
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  // Функция для обработки изменения ввода сообщения
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  // Функция для обработки нажатия на имя пользователя
  const handleUserNameClick = (userId, userName) => {
    setInputValue(inputValue + userName + ' ');
  
  };
  const handleEdit = async (messageId, userId, updatedMessage) => {
    try {
      const messageToUpdate = messages.find(message => message.messageId === messageId);
      if (!messageToUpdate) {
        console.error('Message not found for editing');
        return;
      }
      
      const response = await fetch(`https://localhost:7119/api/Chat/${messageId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          messageId: messageId,
          userId_FK: userId,
          message: updatedMessage,
          date: messageToUpdate.date // Используем дату из сообщения
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to edit message');
      }
  
      // Обновляем список сообщений после редактирования
      fetchMessages();
    } catch (error) {
      console.error('Error editing message:', error);
    }
  };
  
  const handleSubmit = async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        console.error('User ID not found in localStorage');
        return;
      }
  
      // Если редактируем сообщение, отправляем отредактированное сообщение
      if (editingMessageId !== null) {
        await handleEdit(editingMessageId, userId, editedMessage);
        setEditingMessageId(null);
        setEditedMessage('');
      } else {
        // Иначе отправляем новое сообщение
        const response = await fetch('https://localhost:7119/api/Chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId_FK: userId,
            message: inputValue,
          }),
        });
  
        if (!response.ok) {
          throw new Error('Failed to send message');
        }
      }
  
      setInputValue('');
      fetchMessages();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // Функция для удаления сообщения
  const handleDelete = async (messageId) => {
    try {
      const response = await fetch(`https://localhost:7119/api/Chat/${messageId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete message');
      }

      const updatedMessages = messages.filter((message) => message.messageId !== messageId);
      setMessages(updatedMessages);
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

 
  // Функция для обработки нажатия кнопки "Сохранить" при редактировании сообщения
  const handleSaveEditClick = () => {
    handleSubmit(); // Отправляем запрос на изменение сообщения
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '80vh' }}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '80vh' }}>
        <div style={{ flex: 1, overflowY: 'auto', padding: '10px' }}>
          <ProList
            rowKey="messageId"
            dataSource={messages}
            metas={{
              title: {
                dataIndex: 'userName',
                render: (text, row) => (
                  <span onClick={() => handleUserNameClick(row.userId, text)} style={{ cursor: 'pointer' }}>
                    {text}
                  </span>
                ),
              },
              
              description: {
                render: (text, row) => (
                  <>
                    <div>{new Date(row.date).toLocaleString('ru-RU', { hour12: false })}</div>
                    {editingMessageId === row.messageId ? (
                      <TextArea
                        value={editedMessage}
                        onChange={(e) => setEditedMessage(e.target.value)}
                        autoFocus
                        autoSize={{ minRows: 2, maxRows: 6 }}
                      />
                    ) : (
                      <div>{row.message}</div>
                    )}
                  </>
                ),
              },
              subTitle: {
                render: (text, row) => (
                  <Space size={0}>
                    <Tag color="blue">{row.role}</Tag>
                  </Space>
                ),
              },
              actions: {
                render: (text, row) => {
                  const currentTime = new Date();
                  const messageTime = new Date(row.date);
                  const timeDifference = currentTime - messageTime;
                  const hoursDifference = timeDifference / (1000 * 60 * 60);
  
                  if (hoursDifference < 24 && row.userId == localStorage.getItem('userId')) {
                    if (editingMessageId === row.messageId) {
                      return (
                        <Button
                          type="primary"
                          onClick={handleSaveEditClick} // Изменили обработчик на сохранение редактирования
                          icon={<EditOutlined />}
                        >
                         
                        </Button>
                      );
                    } else {
                      return (
                        <>
                          <Button
                            type="text"
                            onClick={() => handleDelete(row.messageId)}
                            danger
                            icon={<DeleteOutlined />}
                          />
                          <Button
                            type="primary"
                            onClick={() => setEditingMessageId(row.messageId)}
                            icon={<EditOutlined />}
                          />
                        </>
                      );
                    }
                  } else {
                    return null;
                  }
                },
              },
            }}
          />
          <div ref={messagesEndRef} />
        </div>
        <div style={{ display: 'flex', backgroundColor: '#f0f0f0', padding: '0px', justifyContent: 'center', borderTop: '1px solid #ccc' }}>
          <Button type="primary" onClick={handleSubmit}>Отправить</Button> {/* Кнопка отправки сообщения */}
          <TextArea style={{ width: 'calc(100% - 100px)' }} value={inputValue} onChange={handleInputChange} rows={4} />
        </div>
      </div>
    </div>
  );
};

export default ChatApp;

