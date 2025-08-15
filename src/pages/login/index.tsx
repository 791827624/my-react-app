// src/pages/login.tsx
import { Button, Card, Form, Input, message } from 'antd'
import { useAuth } from 'context/AuthContext'
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

interface LoginFormValues {
  username: string
  password: string
}

export const Login = () => {
  const [loading, setLoading] = useState(false)
  const { login, isAuthenticated } = useAuth()
  console.log('🚀 ~ Login ~ isAuthenticated:', isAuthenticated)
  const navigate = useNavigate()
  const location = useLocation()

  const onFinish = (values: LoginFormValues) => {
    setLoading(true)
    // 模拟登录请求
    setTimeout(() => {
      if (values.username === 'admin' && values.password === 'youyue666!') {
        // 模拟返回的token
        const mockToken = 'mock_jwt_token'
        login(mockToken)
        message.success('登录成功')

        // 跳转到之前尝试访问的页面或首页
        const from = location.state?.from?.pathname || '/'
        navigate(from, { replace: true })
      } else {
        message.error('用户名或密码错误')
      }
      setLoading(false)
    }, 1000)
  }

  return (
    <div style={{ maxWidth: 400, margin: '100px auto' }}>
      <Card title='用户登录'>
        <Form name='login' initialValues={{ remember: true }} onFinish={onFinish} layout='vertical'>
          <Form.Item
            label='用户名'
            name='username'
            rules={[{ required: true, message: '请输入用户名' }]}>
            <Input placeholder='admin' />
          </Form.Item>

          <Form.Item
            label='密码'
            name='password'
            rules={[{ required: true, message: '请输入密码' }]}>
            <Input.Password placeholder='123456' />
          </Form.Item>

          <Form.Item>
            <Button type='primary' htmlType='submit' loading={loading} block>
              登录
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}
