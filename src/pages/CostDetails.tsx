import { ProDescriptions } from '@ant-design/pro-components';
import { Button } from 'antd';
import dayjs from 'dayjs';

const data = [
  {
    label: 'Транзакция',
    renderText: (_ => _ + _),
    ellipsis: true,
  },
  {
    label: 'Сумма',
    tooltip: 'Только для справки, фактические значения могут отличаться',
    valueType: 'money',
  },
  {
    label: 'Номер контракта',
  },
  {
    label: 'Дата и время',
    valueType: 'dateTime',
    content: dayjs().valueOf(),
  },
  {
    label: 'Интервал дат',
    valueType: 'dateTimeRange',
    content: [dayjs().add(-1, 'd').valueOf(), dayjs().valueOf()],
  }
];

export default () => {
  return (
    <ProDescriptions
      column={2}
      title="Детализация расходов"
      tooltip="Хранит в себе транзакции всех контрактов и их стоимостей."
    >
      {data.map((item, index) => (
        <ProDescriptions.Item
          key={index}
          label={item.label}
          renderText={item.renderText}
          ellipsis={item.ellipsis}
          tooltip={item.tooltip}
          valueType={item.valueType}
        >
          {item.content}
        </ProDescriptions.Item>
      ))}
    </ProDescriptions>
  );
};
