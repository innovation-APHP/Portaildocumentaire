import { RouterProvider } from 'react-router';
import { router } from './routes';
import { AuthProvider } from './contexts/AuthContext';
import { ConfigProvider } from './contexts/ConfigContext';

export default function App() {
  return (
    <AuthProvider>
      <ConfigProvider>
        <RouterProvider router={router} />
      </ConfigProvider>
    </AuthProvider>
  );
}