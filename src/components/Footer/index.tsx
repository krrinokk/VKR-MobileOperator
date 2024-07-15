import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-components';
import React from 'react';

const Footer: React.FC = ({userName, userId}) => {
  return (
    <DefaultFooter
      style={{
        background: 'none',
      }}
      
      links={[
        {
          title: 'MobileOperator',

          blankTarget: true,
        },
        {
          
          key: 'github',
          title: <GithubOutlined />,
          href: 'https://github.com/krrinokk',
          blankTarget: true,
        },
      
      ]}
    />
  );
};

export default Footer;
