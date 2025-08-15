import { Button, Card } from 'antd'
import { ProtectedRoute } from 'components/ProtectedRoute'
import { AuthProvider, useAuth } from 'context/AuthContext'
import { Handover } from 'pages/handover'
import { Login } from 'pages/login'
import { Link, RouterProvider, createBrowserRouter } from 'react-router-dom'
import './App.css'
import { ThemeProvider } from './components/ThemeProvider'
import { Lili } from './pages/lili'
import { MyComponents } from './pages/my-components'
import { PersonalProfile } from './pages/personal-profile'
import { Wheather } from './pages/wheather'

// 更新MyWords组件
const MyWords = () => {
  const { isAuthenticated, logout } = useAuth()

  return (
    <div>
      <Card type='inner' title=''>
        <div>这里是zzc的个人网站</div>
        <p>tel: 13621824095</p>
        <p>e-mail: 791827624@qq.com</p>
        <p>
          <Link to='/personal-profile'>看下我的个人简历吧</Link>
        </p>
        {isAuthenticated ? (
          <>
            <p>
              <Link to='/handover'>交接文档</Link>
            </p>
            <p>
              <Button type='link' onClick={logout} style={{ padding: 0 }}>
                退出登录
              </Button>
            </p>
          </>
        ) : (
          <p>
            <Link to='/login'>登录</Link>
          </p>
        )}
      </Card>
    </div>
  )
}
const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ThemeProvider>
        <MyWords />
      </ThemeProvider>
    ),
    children: [
      {
        path: 'home',
        element: <MyWords />,
      },
      {
        path: 'my-components',
        element: <MyComponents />,
      },
      {
        path: 'lili-hub',
        element: <Lili />,
      },
      {
        path: 'personal-profile',
        element: <PersonalProfile />,
      },
      {
        path: 'wheather',
        element: <Wheather />,
      },
      {
        path: 'handover',
        element: (
          <ProtectedRoute>
            <Handover />
          </ProtectedRoute>
        ),
      },
      {
        path: 'login',
        element: <Login />,
      },
    ],
  },
])

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  )
}

export default App
