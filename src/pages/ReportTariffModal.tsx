import { Modal, Button, Progress, Tag, Tabs, DatePicker, message } from 'antd';
import { useState, useEffect } from 'react';
import { ProList } from '@ant-design/pro-components';
import type { Key } from 'react';

const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

const ReportTariffModal = ({ visible, onClose }) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [reportDataDay, setReportDataDay] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(false); // Флаг для отслеживания загрузки данных по запросу
  const [showFooterInfo, setShowFooterInfo] = useState(false); // Добавляем состояние для отображения информации
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://localhost:7119/api/Tariff/tariff/popularity');
        if (!response.ok) {
          throw new Error('Ошибка загрузки данных');
        }
        const data = await response.json();
        setReportData(data);
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys: Key[]) => setSelectedRowKeys(keys),
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };
  
  const showMessage = (data, selectedDate) => {
    const totalConnectionsDay = data?.totalConnectionsDay || 0;
    const averageConnectionsPerDayDay = data?.averageConnectionsPerDayDay || 0;
    const averageCostDay= data?.averageCostDay || 0;;
    const averageCost= data?.averageCost || 0;;

    const diffPercentageConnections = ((totalConnectionsDay - averageConnectionsPerDayDay) / totalConnectionsDay) * 100;
    const diffPercentageCost = ((averageCost - averageCostDay) / averageCost) * 100;
    if (diffPercentageConnections < 0) {
      message.info(`В дату ${selectedDate.format('YYYY-MM-DD')} - количество подключений было выше средней нормы на ${diffPercentageConnections.toFixed(2)}%`, 5);
    } else if (diffPercentageConnections > 0) {
      message.info(`В дату ${selectedDate.format('YYYY-MM-DD')} - количество подключений было ниже средней нормы на ${Math.abs(diffPercentageConnections).toFixed(2)}%`, 5);
    }
    if (diffPercentageCost < 0) {
      message.info(`В дату ${selectedDate.format('YYYY-MM-DD')} - средняя стоимость повысилась на ${Math.abs(diffPercentageCost).toFixed(2)}%`, 5);
    } else if (diffPercentageCost > 0) {
      message.info(`В дату ${selectedDate.format('YYYY-MM-DD')} - средняя стоимость понизилась на ${Math.abs(diffPercentageCost).toFixed(2)}%`, 5);
    }
  };
  
  const handleViewData = async () => {
    if (!selectedDate) return;
    try {
      setFetchingData(true);
      const formattedDate = selectedDate.format('YYYY-MM-DD');
      const response = await fetch(`https://localhost:7119/api/Tariff/tariff/popularity/day?date=${formattedDate}`);
      if (!response.ok) {
        throw new Error('Ошибка загрузки данных');
      }
      const data = await response.json();
      setReportDataDay(data);
      showMessage(data, selectedDate);
      setShowFooterInfo(true);
    } catch (error) {
      console.error('Ошибка при загрузке данных:', error);
    } finally {
      setFetchingData(false);
    }
  };
  



  return (
    <Modal
      title="Информация о тарифах"
      visible={visible}
      onCancel={onClose}
    
    >
      <Tabs defaultActiveKey="1">
        <TabPane tab="По популярности" key="1">
          <ProList
            metas={{
              avatar: {},
              title: {},
              subTitle: {},
              extra: {
                render: (text, record) => (
                  <Progress percent={record.popularityPercentage} />
                ),
              },
              actions: {},
            }}
            rowKey="id"
            dataSource={reportData?.tariffPopularity.map((detail, index) => ({
              avatar: 'https://gw.alipayobjects.com/zos/antfincdn/UCSiy1j6jx/xingzhuang.svg',
              id: index,
              title: detail.tariffName,
              popularityPercentage: detail.popularityPercentage,
              subTitle: <Tag color="#5BD8A6">Количество подключений: {detail.connectionCount}</Tag>,
            })) || []}
            loading={loading}
          />
            
    
   
      <div key="tariffFooterInfo">
        <ProList
          metas={{
            avatar: {},
            title: {},
            subTitle: {},
            extra: {
             
            },
            actions: {},
          }}
          rowKey="id"
          dataSource={[
            {
              id: 0,
              title: 'Общее количество подключений',
              subTitle: ` ${reportData?.totalConnections}`,
              avatar: 'https://gw.alipayobjects.com/zos/antfincdn/UCSiy1j6jx/xingzhuang.svg',
            },
            {
              id: 1,
              title: 'Среднее количество подключений в день',
              subTitle: ` ${reportData?.averageConnectionsPerDay.toFixed(2)}`,
              avatar: 'https://gw.alipayobjects.com/zos/antfincdn/UCSiy1j6jx/xingzhuang.svg',
            },
            {
              id: 2,
              title: 'Средняя стоимость подключенных тарифов',
              subTitle: ` ${reportData?.averageCost.toFixed(2)}`,
              avatar: 'https://gw.alipayobjects.com/zos/antfincdn/UCSiy1j6jx/xingzhuang.svg',
            }
          ]}
        />
      </div>
    
 
        </TabPane>
        <TabPane tab="По заключениям" key="2">
  <div style={{ marginBottom: '10px' }}>
    <DatePicker 
      value={selectedDate}    
      onChange={(date) => setSelectedDate(date)} 
    />
    <Button type="primary" onClick={handleViewData} loading={fetchingData}>
      Просмотр
    </Button>
  </div>

  <ProList
    metas={{
      title: {},
      subTitle: {},
      description: {},
      avatar: {},
      actions: {},
    }}
    rowKey="id"
    dataSource={reportDataDay?.tariffPopularityDay.map((detail, index) => ({
      avatar: 'https://gw.alipayobjects.com/zos/antfincdn/UCSiy1j6jx/xingzhuang.svg',
      id: index,
      title: detail.tariffName,
      popularityPercentage: detail.popularityPercentage,
      subTitle: <Tag color="#5BD8A6">Количество подключений: {detail.connectionCount}</Tag>,
    })) || []}
    loading={fetchingData}
  />
 
{showFooterInfo && (
  <div key="tariffFooterInfo1">
    <ProList
      metas={{
        avatar: {},
        title: {},
        subTitle: {},
        extra: {},
        actions: {},
      }}
      rowKey="id"
      dataSource={[
        {
          id: 0,
          title: 'Количество подключений в день',
          subTitle: ` ${reportDataDay?.totalConnectionsDay}`,
          avatar: 'https://gw.alipayobjects.com/zos/antfincdn/UCSiy1j6jx/xingzhuang.svg',
        },
        {
          id: 1,
          title: 'Среднее количество подключений в день',
          subTitle: ` ${reportDataDay?.averageConnectionsPerDayDay.toFixed(2)}`,
          avatar: 'https://gw.alipayobjects.com/zos/antfincdn/UCSiy1j6jx/xingzhuang.svg',
        },
        {
          id: 2,
          title: 'Средняя стоимость подключенных тарифов',
          subTitle: ` ${reportDataDay?.averageCostDay.toFixed(2)}`,
          avatar: 'https://gw.alipayobjects.com/zos/antfincdn/UCSiy1j6jx/xingzhuang.svg',
        }
       
      ]}
    />
  </div>
)}
  
</TabPane>


      </Tabs>
    </Modal>
  );
};

export default ReportTariffModal;
