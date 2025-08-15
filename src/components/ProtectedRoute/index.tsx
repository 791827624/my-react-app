// src/components/ProtectedRoute.tsx
import { useAuth } from 'context/AuthContext'
import { Navigate } from 'react-router-dom'

export const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useAuth()
  console.log('🚀 ~ ProtectedRoute ~ isAuthenticated:', isAuthenticated)

  if (!isAuthenticated) {
    // 未登录则重定向到登录页，并携带当前路径以便登录后跳转回来
    return <Navigate to='/login' replace />
  }

  return children
}
