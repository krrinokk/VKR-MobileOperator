import React, { useState } from 'react';
import { Modal, Form, Input, Button } from 'antd';

const CreateContractModal = ({
  visible,
  onCancel,
  onCreate,
}) => {
  const [form] = Form.useForm();

  const onFinish = () => {
    form
      .validateFields()
      .then(values => {
        form.resetFields();
        // Передаем значения формы и userId в функцию onCreate
        onCreate({ ...values, userId_FK: localStorage.getItem('userId') });
      })
      .catch(error => {
        console.error('Validation failed:', error);
      });
  };

  return (
    <Modal
      visible={visible}
      title="Создание нового контракта"
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Отмена
        </Button>,
        <Button key="submit" type="primary" onClick={onFinish}>
          Создать
        </Button>,
      ]}
    >
      <Form form={form} labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} onFinish={onFinish}>
        <Form.Item
          label="Номер телефона"
          name="numberPhone"
          rules={[{ required: true, message: 'Введите номер телефона' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Номер клиента"
          name="сlientId_FK"
          rules={[{ required: true, message: 'Введите номер клиента' }]}
        >
          <Input />
        </Form.Item>
                      <Form.Item
          label="Номер тарифа"
          name="tariffId"
          rules={[{ required: true, message: 'Введите номер тарифа' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Создать
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateContractModal;
