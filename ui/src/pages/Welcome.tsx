import { PageContainer } from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import { Card, theme } from 'antd';
import React from 'react';

const Welcome: React.FC = () => {
  const { token } = theme.useToken();
  const intl = useIntl();
  return (
    <PageContainer>
      <Card
        style={{
          borderRadius: 8,
        }}
      >
        <div
          style={{
            backgroundPosition: '100% -30%',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '274px auto',
            backgroundImage:
              "url('https://gw.alipayobjects.com/mdn/rms_a9745b/afts/img/A*BuFmQqsB2iAAAAAAAAAAAAAAARQnAQ')",
          }}
        >
          <div
            style={{
              fontSize: '20px',
              color: token.colorTextHeading,
            }}
          >
            {intl.formatMessage({
              id: 'pages.welcome.title',
              defaultMessage: 'Welcome to prompt tuner',
            })}
          </div>
          <p
            style={{
              fontSize: '14px',
              color: token.colorTextSecondary,
              lineHeight: '22px',
              marginTop: 16,
              marginBottom: 32,
              width: '65%',
            }}
          >
            {intl.formatMessage({
              id: 'pages.welcome.description',
              defaultMessage:
                'Prompt Tuner is a powerful tool designed to assist you in evaluating the impact of different models, parameters, and prompts on natural language processing tasks. With Prompt Tuner, you can easily test and compare the influence of various combinations on model performance. The tool presents the results of different experiments in a clear tabular format, allowing you to gain insights into the performance of each configuration intuitively. Whether you are optimizing language generation, text classification, or other NLP tasks, Prompt Tuner serves as an invaluable assistant, aiding you in gaining a better understanding and fine-tuning the behavior of your models.',
            })}
          </p>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 16,
            }}
          >
          </div>
        </div>
      </Card>
    </PageContainer>
  );
};

export default Welcome;
