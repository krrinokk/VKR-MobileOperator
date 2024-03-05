import React, { useState } from 'react';
import { Button } from 'antd';
import { UsergroupAddOutlined } from '@ant-design/icons';
import { UserModal } from './User';


const MainComponent = () => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleButtonClick = () => {
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
  };

  return (
    <>
      <div
        style={{
          display: 'flex',
          height: 26,
        }}
        onClick={handleButtonClick}
      >
        <UsergroupAddOutlined />
      </div>
      <UserModal visible={modalVisible} onClose={handleModalClose} />
    </>
  );
};

export default MainComponent;
