import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-components';
import React from 'react';

const Footer: React.FC = () => {
  return (
    <DefaultFooter
      style={{
        background: 'none',
      }}
      copyright={false}
      links={[
        {
          key: 'yiruocloud',
          title: (<>翼若云</>),
          href: 'https://admin.yiruocloud.com/',
          blankTarget: true,
        },
        {
          key: 'github',
          title: (<><GithubOutlined /> promptTuner</>),
          href: 'https://github.com/YiRuoAI/promptTuner',
          blankTarget: true,
        },

      ]}
    />
  );
};

export default Footer;
