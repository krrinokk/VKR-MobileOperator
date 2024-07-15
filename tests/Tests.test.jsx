import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';

import '@testing-library/jest-dom'; // Correct import for jest-dom
import axios from 'axios';
import ChatApp from '../src/pages/Chat';
import useUserRole from '../src/pages/useUserRole';
import Contract from '../src/pages/Contract';
import AddTariffModal from '../src/pages/AddTariffModal'; // Проверьте правильность пути импорта
import ClientTable from '../src/pages/Clients';
import CreateContractModal from '../src/pages/CreateContractModal'; // Проверьте правильность пути импорта
import ReportTariffModal from '../src/pages/ReportTariffModal'; // Проверьте правильность пути импорта
import ReportServicesModal from '../src/pages/ReportServicesModal'; // Проверьте правильность пути импорта
describe('CreateContractModal', () => {
  const onCancelMock = jest.fn();
  const onCreateMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.setItem('userId', '1'); // Установим userId в localStorage для тестов
  });

  test('renders modal and form fields correctly', () => {
    const { getByText, getByLabelText } = render(
      <CreateContractModal visible={true} onCancel={onCancelMock} onCreate={onCreateMock} />
    );

    expect(getByText('Создание нового контракта')).toBeInTheDocument();
    expect(getByLabelText('Номер телефона')).toBeInTheDocument();
    expect(getByLabelText('Номер клиента')).toBeInTheDocument();
    expect(getByLabelText('Номер тарифа')).toBeInTheDocument();
  });

  test('calls onCreate with form values and userId on submit', async () => {
    const { getByText, getByLabelText } = render(
      <CreateContractModal visible={true} onCancel={onCancelMock} onCreate={onCreateMock} />
    );

    fireEvent.change(getByLabelText('Номер телефона'), { target: { value: '+1234567890' } });
    fireEvent.change(getByLabelText('Номер клиента'), { target: { value: '1' } });
    fireEvent.change(getByLabelText('Номер тарифа'), { target: { value: '10' } });

    fireEvent.click(getByText('Создать'));

    await waitFor(() => {
      expect(onCreateMock).toHaveBeenCalledWith({
        numberPhone: '+1234567890',
        сlientId_FK: '1',
        tariffId: '10',
        userId_FK: '123',
      });
    });
  });

  test('validates form fields correctly', async () => {
    const { getByText, getByLabelText } = render(
      <CreateContractModal visible={true} onCancel={onCancelMock} onCreate={onCreateMock} />
    );

    fireEvent.click(getByText('Создать'));

    await waitFor(() => {
      expect(getByText('Введите номер телефона')).toBeInTheDocument();
      expect(getByText('Введите номер клиента')).toBeInTheDocument();
      expect(getByText('Введите номер тарифа')).toBeInTheDocument();
    });

    fireEvent.change(getByLabelText('Номер телефона'), { target: { value: '+1234567890' } });
    fireEvent.change(getByLabelText('Номер клиента'), { target: { value: '1' } });
    fireEvent.change(getByLabelText('Номер тарифа'), { target: { value: '10' } });

    fireEvent.click(getByText('Создать'));

    await waitFor(() => {
      expect(onCreateMock).toHaveBeenCalledTimes(1);
    });
  });

  test('handles cancel button click', () => {
    const { getByText } = render(
      <CreateContractModal visible={true} onCancel={onCancelMock} onCreate={onCreateMock} />
    );

    fireEvent.click(getByText('Отмена'));

    expect(onCancelMock).toHaveBeenCalledTimes(1);
  });
}); 

jest.mock('axios');
jest.mock('../src/pages/useUserRole');

const clients = [
  {
    clientId: 1,
    firstName: 'John',
    patronymic: 'D.',
    lastName: 'Doe',
    address: '123 Main St',
    passport: '1234567890',
    mail: 'john@example.com',
    balance: 100,
    isActive: true,
  },
  {
    clientId: 2,
    firstName: 'Jane',
    patronymic: 'D.',
    lastName: 'Smith',
    address: '456 Elm St',
    passport: '0987654321',
    mail: 'jane@example.com',
    balance: -50,
    isActive: false,
  },
];

describe('ClientTable', () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({ data: clients });
    useUserRole.mockReturnValue('user');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders table with clients data', async () => {
    const { getByText } = render(<ClientTable />);

    await waitFor(() => {
      expect(getByText('John')).toBeInTheDocument();
      expect(getByText('Doe')).toBeInTheDocument();
      expect(getByText('123 Main St')).toBeInTheDocument();
      expect(getByText('john@example.com')).toBeInTheDocument();
      expect(getByText('1234567890')).toBeInTheDocument();
      expect(getByText('100')).toBeInTheDocument();
    });
  });

  test('searches clients by passport', async () => {
    const { getByPlaceholderText, getByText, queryByText } = render(<ClientTable />);

    await waitFor(() => expect(getByText('John')).toBeInTheDocument());

    fireEvent.change(getByPlaceholderText('Поиск по паспортным данным'), { target: { value: '0987' } });

    await waitFor(() => {
      expect(getByText('Jane')).toBeInTheDocument();
      expect(queryByText('John')).not.toBeInTheDocument();
    });
  });

  test('searches clients by name', async () => {
    const { getByPlaceholderText, getByText, queryByText } = render(<ClientTable />);

    await waitFor(() => expect(getByText('John')).toBeInTheDocument());

    fireEvent.change(getByPlaceholderText('Поиск по имени, отчеству, фамилии'), { target: { value: 'Smith' } });

    await waitFor(() => {
      expect(getByText('Jane')).toBeInTheDocument();
      expect(queryByText('John')).not.toBeInTheDocument();
    });
  });

  test('toggles show active clients', async () => {
    const { getByText, getByLabelText } = render(<ClientTable />);

    await waitFor(() => expect(getByText('John')).toBeInTheDocument());

    fireEvent.click(getByLabelText('Активные'));

    await waitFor(() => expect(getByText('John')).not.toBeInTheDocument());
  });

  test('toggles show blocked clients', async () => {
    const { getByText, getByLabelText } = render(<ClientTable />);

    await waitFor(() => expect(getByText('John')).toBeInTheDocument());

    fireEvent.click(getByLabelText('Заблокированные'));

    await waitFor(() => expect(getByText('Jane')).not.toBeInTheDocument());
  });

  test('handles create client', async () => {
    axios.post.mockResolvedValue({ status: 201 });
    
    const { getByText, getByLabelText } = render(<ClientTable />);
    
    fireEvent.click(getByText('Создать'));
    
    fireEvent.change(getByLabelText('Имя'), { target: { value: 'New' } });
    fireEvent.change(getByLabelText('Отчество'), { target: { value: 'Client' } });
    fireEvent.change(getByLabelText('Фамилия'), { target: { value: 'User' } });
    fireEvent.change(getByLabelText('Адрес'), { target: { value: '789 Oak St' } });
    fireEvent.change(getByLabelText('Паспорт'), { target: { value: '1122334455' } });
    fireEvent.change(getByLabelText('Почта'), { target: { value: 'newclient@example.com' } });

    fireEvent.click(getByText('Сохранить'));

    await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(2)); // Initial fetch and fetch after creation
  });

  test('handles edit client', async () => {
    axios.put.mockResolvedValue({ status: 200 });

    const { getByText, getByLabelText } = render(<ClientTable />);

    await waitFor(() => expect(getByText('John')).toBeInTheDocument());

    fireEvent.click(getByText('EditOutlined')); // Icon for editing

    await waitFor(() => expect(getByLabelText('Имя')).toHaveValue('John'));

    fireEvent.change(getByLabelText('Имя'), { target: { value: 'Johnny' } });

    fireEvent.click(getByText('Сохранить'));

    await waitFor(() => expect(axios.put).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(2)); // Initial fetch and fetch after update
  });

  test('handles delete client', async () => {
    axios.delete.mockResolvedValue({ status: 200 });

    const { getByText, getAllByText } = render(<ClientTable />);

    await waitFor(() => expect(getByText('John')).toBeInTheDocument());

    fireEvent.click(getAllByText('DeleteOutlined')[0]); // Icon for deleting

    fireEvent.click(getByText('Да')); // Confirmation button

    await waitFor(() => expect(axios.delete).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(2)); // Initial fetch and fetch after deletion
  });

  test('opens and closes connects modal', async () => {
    const { getByText, queryByText } = render(<ClientTable />);

    await waitFor(() => expect(getByText('John')).toBeInTheDocument());

    fireEvent.click(getAllByText('EyeOutlined')[0]); // Icon for viewing connections

    await waitFor(() => expect(getByText('ConnectsModal')).toBeInTheDocument());

    fireEvent.click(getByText('Close')); // Assuming there's a "Close" button in ConnectsModal

    await waitFor(() => expect(queryByText('ConnectsModal')).not.toBeInTheDocument());
  });
});
jest.mock('axios');

describe('AddTariffModal', () => {
  const onCancelMock = jest.fn();
  const onAddMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders modal and steps correctly', () => {
    const { getByText } = render(<AddTariffModal visible={true} onCancel={onCancelMock} onAdd={onAddMock} />);
    
    expect(getByText('Добавить тариф')).toBeInTheDocument();
    expect(getByText('Добавление тарифа')).toBeInTheDocument();
    expect(getByText('Транзакции')).toBeInTheDocument();
  });

  test('moves to the next step', async () => {
    axios.post.mockResolvedValue({ status: 201, data: { tariffId: 1 } });

    const { getByText, getByLabelText } = render(<AddTariffModal visible={true} onCancel={onCancelMock} onAdd={onAddMock} />);

    fireEvent.change(getByLabelText('Название тарифа'), { target: { value: 'Test Tariff' } });
    fireEvent.change(getByLabelText('Минуты'), { target: { value: '100' } });
    fireEvent.change(getByLabelText('Гигабайты'), { target: { value: '10' } });
    fireEvent.change(getByLabelText('СМС'), { target: { value: '50' } });
    fireEvent.change(getByLabelText('Стоимость'), { target: { value: '100' } });

    fireEvent.click(getByText('Далее'));

    await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));
    expect(axios.post).toHaveBeenCalledWith('https://localhost:7119/api/Tariff', {
      name: 'Test Tariff',
      minutes: '100',
      gb: '10',
      sms: '50',
      cost: '100'
    });

    await waitFor(() => expect(getByText('Транзакции')).toBeInTheDocument());
  });

  test('submits transactions', async () => {
    axios.post.mockResolvedValue({ status: 201, data: { tariffId: 1 } });
    axios.get.mockResolvedValue({
      data: [
        { categoryTransactionId: 1, name: 'Transaction 1' },
        { categoryTransactionId: 2, name: 'Transaction 2' }
      ]
    });

    const { getByText, getByPlaceholderText } = render(<AddTariffModal visible={true} onCancel={onCancelMock} onAdd={onAddMock} />);
    
    fireEvent.change(getByPlaceholderText('Введите стоимость'), { target: { value: '20' } });

    fireEvent.click(getByText('Далее'));

    await waitFor(() => expect(axios.get).toHaveBeenCalledWith('https://localhost:7119/api/CategoryTransaction'));

    fireEvent.change(getByPlaceholderText('Введите стоимость'), { target: { value: '20' } });

    fireEvent.click(getByText('Добавить'));

    await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(3)); // Один раз для тарифа, два раза для транзакций

    expect(axios.post).toHaveBeenCalledWith('https://localhost:7119/api/Transactions', {
      cost: '20',
      tariffId_FK: 1,
      categoryTransaction_FK: 1
    });
  });

  test('handles cancel button click', () => {
    const { getByText } = render(<AddTariffModal visible={true} onCancel={onCancelMock} onAdd={onAddMock} />);

    fireEvent.click(getByText('Отмена'));
    
    expect(onCancelMock).toHaveBeenCalledTimes(1);
  });
});
// Mock the axios library
jest.mock('axios');
jest.mock('../src/pages/useUserRole'); // Correct path for useUserRole mock


  describe('ChatApp', () => {
    test('renders ChatApp component', () => {
      const { getByText } = render(<ChatApp />);
      expect(getByText('Отправить')).toBeInTheDocument();
    });

    test('adds username to input value when clicked', () => {
      const { getByText, getByRole } = render(<ChatApp />);
      const input = getByRole('textbox');
      fireEvent.click(getByText('User1'));
      expect(input.value).toBe('User1 ');
    });
  });


  describe('useUserRole', () => {
    test('should return correct role for user', () => {
      const TestComponent = () => {
        const role = useUserRole('user');
        return <div>{role}</div>;
      };
      const { getByText } = render(<TestComponent />);
      expect(getByText('user')).toBeInTheDocument();
    });

    test('should return correct role for admin', () => {
      const TestComponent = () => {
        const role = useUserRole('admin');
        return <div>{role}</div>;
      };
      const { getByText } = render(<TestComponent />);
      expect(getByText('admin')).toBeInTheDocument();
    });
  });

  describe('Contract Component', () => {
    const contractData = [
      {
        contractId: 1,
        status: 'Active',
        numberPhone: '+7 (123) 456-78-90',
        clientId_FK: 1,
        tariffId: 1,
        smsRemaining: 50,
        minutesRemaining: 100,
        gbRemaining: 5,
      },
    ];

    const clientsWithPositiveBalance = [
      {
        clientId: 1,
        fullName: 'John Doe',
      },
    ];

    const activeTariffs = [
      {
        tariffId: 1,
        name: 'Basic Plan',
      },
    ];

    beforeEach(() => {
      useUserRole.mockReturnValue('user');
      axios.get.mockImplementation((url) => {
        switch (url) {
          case 'https://localhost:7119/api/Contract':
            return Promise.resolve({ data: contractData });
          case 'https://localhost:7119/api/Client/clients/positive-balance':
            return Promise.resolve({ data: clientsWithPositiveBalance });
          case 'https://localhost:7119/api/Tariff/tariffs/active':
            return Promise.resolve({ data: activeTariffs });
          default:
            return Promise.reject(new Error('not found'));
        }
      });
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    test('renders Contract component', async () => {
      const { getByText } = render(<Contract />);
      await waitFor(() => expect(getByText('ID')).toBeInTheDocument());
    });

    test('renders contract data in table', async () => {
      const { getByText } = render(<Contract />);
      await waitFor(() => expect(getByText('Active')).toBeInTheDocument());
    });

    test('renders Create button and opens modal on click', async () => {
      const { getByText, getByLabelText } = render(<Contract />);
      await waitFor(() => expect(getByText('Создать')).toBeInTheDocument());
      fireEvent.click(getByText('Создать'));
      await waitFor(() => expect(getByLabelText('Номер телефона')).toBeInTheDocument());
    });

    test('handles client and tariff ID button clicks', async () => {
      const { getByText, getAllByText } = render(<Contract />);
      await waitFor(() => expect(getAllByText('1')[1]).toBeInTheDocument());
      fireEvent.click(getAllByText('1')[1]);
      await waitFor(() => expect(axios.get).toHaveBeenCalledWith('https://localhost:7119/api/Client/1'));
      fireEvent.click(getAllByText('1')[2]);
      await waitFor(() => expect(axios.get).toHaveBeenCalledWith('https://localhost:7119/api/Tariff/1'));
    });
  });

  describe('ReportTariffModal', () => {
    test('renders modal with tabs correctly', () => {
      const { getByText } = render(<ReportTariffModal visible={true} onClose={() => {}} />);
      
      expect(getByText('Информация о тарифах')).toBeInTheDocument();
      expect(getByText('По популярности')).toBeInTheDocument();
      expect(getByText('По заключениям')).toBeInTheDocument();
    });
  
    test('changes date and fetches data on button click', async () => {
      const { getByText, getByLabelText } = render(<ReportTariffModal visible={true} onClose={() => {}} />);
  
      fireEvent.change(getByLabelText('Дата'), { target: { value: '2024-06-07' } });
      fireEvent.click(getByText('Просмотр'));
  
      await waitFor(() => {
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith('https://localhost:7119/api/Tariff/tariff/popularity/day?date=2024-06-07');
      });
    });
  
  });
  describe('ReportServicesModal', () => {
    test('renders modal with tabs correctly', () => {
      const { getByText } = render(<ReportServicesModal visible={true} onClose={() => {}} />);
      
      expect(getByText('Информация об подписках')).toBeInTheDocument();
      expect(getByText('По популярности')).toBeInTheDocument();
      expect(getByText('По заключениям')).toBeInTheDocument();
    });
  
    test('changes date range and fetches data on button click', async () => {
      const { getByText, getByLabelText } = render(<ReportServicesModal visible={true} onClose={() => {}} />);
  
      fireEvent.change(getByLabelText('Дата'), { target: { value: ['2024-06-01', '2024-06-07'] } });
      fireEvent.click(getByText('Просмотр'));
  
      await waitFor(() => {
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith('https://localhost:7119/api/Services/services/popularity-day?startDate=2024-06-01T00:00:00.000Z&endDate=2024-06-07T00:00:00.000Z');
      });
    });
  });