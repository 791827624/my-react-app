import { ConfigProvider, Layout, Menu } from 'antd'
import { Content, Header } from 'antd/es/layout/layout'
import React, { PropsWithChildren } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { THEME } from 'theme'
import { cssLayout } from './index.style'

export const ThemeProvider: React.FC<PropsWithChildren<any>> = ({ children }) => {
  const navigate = useNavigate()

  const location = useLocation()

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: THEME.branding,
          colorError: THEME.warning,
          colorSplit: THEME.fourth,
          colorBorderSecondary: THEME.fourth,
          controlItemBgActive: THEME.branding_10,
          controlItemBgActiveHover: THEME.branding_10,
          borderRadius: 2,
          borderRadiusXS: 2,
          borderRadiusLG: 2,
          borderRadiusSM: 2,
        },
        components: {
          Slider: {
            handleSize: 18,
            handleSizeHover: 20,
          },
          Tooltip: {
            colorBgSpotlight: THEME.background,
            colorTextLightSolid: THEME.primary,
          },
          Input: {
            colorBorder: THEME.fourth,
            colorBgContainerDisabled: THEME.base,
            colorTextDisabled: THEME.secondary,
            colorTextPlaceholder: THEME.fourth,
          },
          Tabs: {
            colorTextDisabled: THEME.third,
          },
          Select: {
            colorErrorHover: THEME.warning,
            controlHeight: 28,
          },
          Dropdown: {
            paddingXXS: 0,
          },
          Menu: {
            itemActiveBg: THEME.branding_10,
            itemHoverBg: THEME.secondary,
          },
          Table: {
            headerBg: THEME.background,
            headerColor: THEME.secondary,
            headerSplitColor: THEME.background,
            rowHoverBg: THEME.base,
            cellPaddingBlockSM: 5,
          },
        },
      }}>
      <Layout className={cssLayout}>
        <Header
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 1,
            width: '100%',
            display: 'flex',
            alignItems: 'center',
          }}>
          <div className='demo-logo' />
          <Menu
            theme='dark'
            className='menu-body'
            items={[
              {
                key: 'home',
                label: <Link to='home'>首页</Link>,
              },
              {
                key: 'my-components',
                label: <Link to='my-components'>我的组件</Link>,
              },
              {
                key: 'wheather',
                label: <Link to='wheather'>天气查询</Link>,
              },
            ]}
          />
        </Header>

        <Content style={{ padding: '0 0', height: `calc(100vh - 64px)` }}>
          {location.pathname === '/' ? children : <Outlet />}
        </Content>
      </Layout>
    </ConfigProvider>
  )
}
