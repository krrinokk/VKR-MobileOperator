import React, { useState } from 'react';
import { Button, Modal } from 'antd';
import AdvancedSearch from './AdminTariff'; // Путь к компоненту AdvancedSearch

export default () => {
  const [data, setData] = useState([]);
  const [activeKey, setActiveKey] = useState('all');
  const [showArchive, setShowArchive] = useState(false);
  const [adminPanelVisible, setAdminPanelVisible] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get('https://localhost:7119/api/Tariff/');
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    fetchData();
  }, []);

  const renderBadge = (count, active = false) => {
    return (
      <Badge
        count={count}
        style={{
          marginBlockStart: -2,
          marginInlineStart: 4,
          color: active ? '#1890FF' : '#999',
          backgroundColor: active ? '#E6F7FF' : '#eee',
        }}
      />
    );
  };

  // Filter tariffs based on whether they are active or archive
  const filteredData = data.filter(item => {
    if (showArchive) {
      // Show archive tariffs if showArchive is true
      return new Date(item.dateOpening) < new Date(new Date().getFullYear() - 1, new Date().getMonth(), new Date().getDate());
    } else {
      // Show active tariffs if showArchive is false
      return new Date(item.dateOpening) >= new Date(new Date().getFullYear() - 1, new Date().getMonth(), new Date().getDate());
    }
  });

  const openAdminPanel = () => {
    setAdminPanelVisible(true);
  };

  const closeAdminPanel = () => {
    setAdminPanelVisible(false);
  };

  return (
    <div>
      <Button type="primary" onClick={openAdminPanel}>
        Админ Панель
      </Button>
      <Modal
        title="Админ Панель"
        visible={adminPanelVisible}
        onCancel={closeAdminPanel}
        footer={null}
      >
        <AdvancedSearch />
      </Modal>

      <ProList
        rowKey="tariffId"
        dataSource={filteredData}
        editable={{}}
        metas={{
          title: {
            dataIndex: 'name',
            valueType: 'select',
            fieldProps: {
              showSearch: true,
              placement: 'bottomRight',
              options: data.map(item => ({
                label: item.name,
                value: item.name,
              })),
            },
          },
          description: {
            dataIndex: 'dateOpening',
            valueType: 'dateTime',
          },
          content: {
            render: (item) => (
              <div
                key={item.tariffId}
                style={{ display: 'flex', justifyContent: 'space-around' }}
              >
                <div>
                  <div>TariffId</div>
                  <div>{item.tariffId}</div>
                </div>
                <div>
                  <div>Minutes</div>
                  <div>{item.minutes}</div>
                </div>
                <div>
                  <div>GB</div>
                  <div>{item.gb}</div>
                </div>
                <div>
                  <div>SMS</div>
                  <div>{item.sms}</div>
                </div>
                <div>
                  <div>Cost</div>
                  <div>{item.cost}</div>
                </div>
              </div>
            ),
          },
        }}
        toolbar={{
          menu: {
            activeKey,
            items: [
              {
                key: 'all',
                label: (
                  <span>Все {renderBadge(data.length, activeKey === 'all')}</span>
                ),
              },
              {
                key: 'active',
                label: (
                  <span>Активные {renderBadge(filteredData.length, activeKey === 'active')}</span>
                ),
              },
              {
                key: 'archive',
                label: (
                  <span>Архивные {renderBadge(filteredData.length, activeKey === 'archive')}</span>
                ),
              },
            ],
            onChange(key) {
              setActiveKey(key);
              if (key === 'archive') {
                setShowArchive(true);
              } else {
                setShowArchive(false);
              }
            },
          },
          search: false,
          actions: [
            <Button type="primary" key="primary" icon={<PlusOutlined />}>
              Открыть 
            </Button>,
          ],
        }}
      />
    </div>
  );
};
