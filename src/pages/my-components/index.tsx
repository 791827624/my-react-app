import { Layout, Menu } from 'antd'
import Sider from 'antd/es/layout/Sider'
import { Content } from 'antd/es/layout/layout'
import { useState } from 'react'
import { THEME } from 'theme'
import { CodeBlockDemo } from './CodeBlock/Demo'
import { KeepAliveDemo } from './KeepAliveDemo'

export const MyComponents = () => {
  const [activeTab, setActiveTab] = useState('keep-alive')
  return (
    <div>
      <Layout>
        <Sider width={200} style={{ background: THEME.orange, height: `calc(100vh - 64px)` }}>
          <Menu
            theme='dark'
            defaultSelectedKeys={['keep-alive']}
            items={[
              {
                key: 'keep-alive',
                label: 'Keep Alive',
                onClick: () => {
                  setActiveTab('keep-alive')
                },
              },
              {
                key: 'tree',
                label: 'Tree Selector',
                onClick: () => {
                  setActiveTab('tree')
                },
              },
              {
                key: 'code-block',
                label: 'code-block',
                onClick: () => {
                  setActiveTab('code-block')
                },
              },
            ]}
            mode='inline'
            defaultOpenKeys={['keep-alive']}
            style={{ height: '100%', borderRight: 0 }}
          />
        </Sider>
        <Content>
          {activeTab === 'keep-alive' && <KeepAliveDemo />}
          {activeTab === 'code-block' && <CodeBlockDemo />}
        </Content>
      </Layout>
    </div>
  )
}
