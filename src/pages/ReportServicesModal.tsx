import { Modal, Button, Progress, Tag, Tabs, DatePicker, message } from 'antd';
import { useState, useEffect } from 'react';
import { ProList } from '@ant-design/pro-components';
import type { Key } from 'react';

const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

const ReportServicesModal = ({ visible, onClose }) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [reportDataDay, setReportDataDay] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(false); 
  const [showFooterInfo, setShowFooterInfo] = useState(false); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://localhost:7119/api/Services/services/popularity');
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

  const fetchServicesPopularity = async (startDate, endDate) => {
    try {
      setFetchingData(true);
      const response = await fetch(`https://localhost:7119/api/Services/services/popularity-day?startDate=${startDate}&endDate=${endDate}`);
      if (!response.ok) {
        throw new Error('Ошибка загрузки данных');
      }
      const data = await response.json();
      setReportDataDay(data);
    } catch (error) {
      console.error('Ошибка при загрузке данных:', error);
    } finally {
      setFetchingData(false);
    }
  };

  const handleDateChange = (dates) => {
    setSelectedDate(dates);
  };

  const handleViewData = async () => {
    if (!selectedDate || selectedDate.length !== 2) return;

    const startDate = selectedDate[0].toISOString();
    const endDate = selectedDate[1].toISOString();

    await fetchServicesPopularity(startDate, endDate);
    setShowFooterInfo(true);
  };

  return (
    <Modal
      title="Информация об подписках"
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
            dataSource={reportData?.servicesPopularity.map((detail, index) => ({
              avatar: 'https://gw.alipayobjects.com/zos/antfincdn/UCSiy1j6jx/xingzhuang.svg',
              id: index,
              title: detail.name,
              popularityPercentage: detail.popularityPercentage,
              subTitle: <Tag color="#5BD8A6">Количество подключений: {detail.connectionCount}</Tag>,
            })) || []}
            loading={loading}
          />
          <div key="tariffFooterInfo3">
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
          title: 'Средняя стоимость подключенных услуг',
          subTitle: ` ${reportData?.averageCost}`,
          avatar: 'https://gw.alipayobjects.com/zos/antfincdn/UCSiy1j6jx/xingzhuang.svg',
        },
       
       
      ]}
    />
  </div>
        </TabPane>
        <TabPane tab="По заключениям" key="2">
          <div style={{ marginBottom: '10px' }}>
            <RangePicker onChange={handleDateChange} />
            <Button type="primary" onClick={handleViewData} loading={fetchingData}>
              Просмотр
            </Button>
          </div>
          
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
                dataSource={reportDataDay?.servicesPopularityDay.map((detail, index) => ({
                  avatar: 'https://gw.alipayobjects.com/zos/antfincdn/UCSiy1j6jx/xingzhuang.svg',
                  id: index,
                  title: detail.name,
                  popularityPercentage: detail.popularityPercentage,
                  subTitle: <Tag color="#5BD8A6">Количество подключений: {detail.connectionCount}</Tag>,
                })) || []}
              />
            </div>
            
      
          {showFooterInfo && (
<div key="tariffFooterInfo2">
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
          title: 'Средняя стоимость подключенных услуг',
          subTitle: ` ${reportDataDay?.averageCost}`,
          avatar: 'https://gw.alipayobjects.com/zos/antfincdn/UCSiy1j6jx/xingzhuang.svg',
        },
       
    
      ]}
    />
  </div>
    )}

        </TabPane>
      </Tabs>
    </Modal>
  );
};

export default ReportServicesModal;
