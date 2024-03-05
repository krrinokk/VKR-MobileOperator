import React, { useState, useRef, useEffect } from 'react';
import { Input, Button, List, Typography, Space } from 'antd';

const { TextArea } = Input;

const ChatApp = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [username, setUsername] = useState('User');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    if(messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }

  useEffect(scrollToBottom, [messages]);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = () => {
    if (!inputValue.trim()) return; // Prevent sending empty messages
    const newMessage = {
      id: new Date().getTime(),
      sender: username,
      text: inputValue,
    };
    setMessages([...messages, newMessage]);
    setInputValue('');
  };

  const handleDelete = (id) => {
    const updatedMessages = messages.filter((message) => message.id !== id);
    setMessages(updatedMessages);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <div style={{ flex: '1', overflowY: 'auto', padding: '10px' }}>
        <List
          dataSource={messages}
          renderItem={(item) => (
            <List.Item style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography.Text strong>{item.sender}:</Typography.Text>
              <Typography.Text>{item.text}</Typography.Text>
              <Button type="link" onClick={() => handleDelete(item.id)} danger>
                Delete
              </Button>
            </List.Item>
          )}
        />
        <div ref={messagesEndRef} />
      </div>
      <div style={{ padding: '10px' }}>
        <Space>
          <Input
            style={{ width: '200px' }}
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextArea value={inputValue} onChange={handleInputChange} rows={4} />
          <Button type="primary" onClick={handleSubmit}>
            Send
          </Button>
        </Space>
      </div>
    </div>
  );
};

export default ChatApp;
