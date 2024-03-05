import React, { useState, useEffect } from 'react';
import { Button, Modal, Pagination } from 'antd';
import { PlusOutlined, EyeOutlined } from '@ant-design/icons';
import { ProDescriptions } from '@ant-design/pro-components';
import dayjs from 'dayjs';
import { DragSortTable } from '@ant-design/pro-components';
import { message } from 'antd';
import axios from 'axios';

type ContractType = {
  contractId: number;
  dateConclusion: Date;
  numberPhone: string;
  clientId_FK: number;
  userId_FK: number;
  tariffId: number;
  smsRemaining: number;
  minutesRemaining: number;
  gbRemaining: number;
};

const Contract = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedContract, setSelectedContract] = useState<ContractType | null>(null);
  const [contractData, setContractData] = useState<ContractType[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://localhost:7119/api/Contract');
        setContractData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        // Handle error, show error message, etc.
      }
    };

    fetchData();
  }, []); // Empty dependency array ensures this effect runs only once on component mount

  const handleView = (record: ContractType) => {
    setSelectedContract(record);
    setModalVisible(true);
  };

  const handleModalOk = () => {
    setModalVisible(false);
    setSelectedContract(null);
  };

  const handleDownloadPDF = () => {
    console.log('Download data in PDF form');
  };

  return (
    <>
      <DragSortTable
        headerTitle="Contracts"
        columns={[
          {
            title: 'Contract ID',
            dataIndex: 'contractId',
            key: 'contractId',
          },
          {
            title: 'Date of Conclusion',
            dataIndex: 'dateConclusion',
            key: 'dateConclusion',
            render: (text, record: ContractType) => dayjs(record.DateConclusion).format('YYYY-MM-DD'),
          },
          {
            title: 'Phone Number',
            dataIndex: 'numberPhone',
            key: 'numberPhone',
          },
          {
            title: 'Client ID',
            dataIndex: 'clientId_FK',
            key: 'clientId_FK',
          },
          {
            title: 'User ID',
            dataIndex: 'userId_FK',
            key: 'userId_FK',
          },
          {
            title: 'Tariff ID',
            dataIndex: 'tariffId',
            key: 'tariffId',
          },
          {
            title: 'SMS Remaining',
            dataIndex: 'smsRemaining',
            key: 'smsRemaining',
          },
          {
            title: 'minutes Remaining',
            dataIndex: 'minutesRemaining',
            key: 'minutesRemaining',
          },
          {
            title: 'GB Remaining',
            dataIndex: 'gbRemaining',
            key: 'gbRemaining',
          },
          {
            title: 'Actions',
            key: 'action',
            render: (text, record: ContractType) => (
              <Button type="primary" icon={<EyeOutlined />} onClick={() => handleView(record)}>
                View
              </Button>
            ),
          },
        ]}
        rowKey="ContractId"
        pagination={false}
        dataSource={contractData}
        dragSortKey="ContractId" // Ensure to use a unique key for drag sorting
      />

      <Modal
        title="Contract Details"
        visible={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="download" type="primary" onClick={handleDownloadPDF}>
            Download as PDF
          </Button>,
        ]}
      >
        {selectedContract && (
          <ProDescriptions
            column={1}
            pagination={false}
            dataSource={selectedContract}
          >
            <ProDescriptions.Item label="Contract ID">
              {selectedContract.ContractId}
            </ProDescriptions.Item>
            <ProDescriptions.Item label="Date of Conclusion" valueType="dateTime">
              {dayjs(selectedContract.DateConclusion).format('YYYY-MM-DD')}
            </ProDescriptions.Item>
            <ProDescriptions.Item label="Phone Number">
              {selectedContract.NumberPhone}
            </ProDescriptions.Item>
            <ProDescriptions.Item label="Client ID">
              {selectedContract.ClientId_FK}
            </ProDescriptions.Item>
            <ProDescriptions.Item label="User ID">
              {selectedContract.UserId_FK}
            </ProDescriptions.Item>
            <ProDescriptions.Item label="Tariff ID">
              {selectedContract.TariffId}
            </ProDescriptions.Item>
            <ProDescriptions.Item label="SMS Remaining">
              {selectedContract.SMSRemaining}
            </ProDescriptions.Item>
            <ProDescriptions.Item label="Minutes Remaining">
              {selectedContract.MinutesRemaining}
            </ProDescriptions.Item>
            <ProDescriptions.Item label="GB Remaining">
              {selectedContract.GBRemaining}
            </ProDescriptions.Item>
          </ProDescriptions>
        )}
      </Modal>
    </>
  );
};

export default Contract;
