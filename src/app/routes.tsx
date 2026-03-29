import { createBrowserRouter } from 'react-router';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Home } from './pages/Home';
import { DocumentList } from './pages/DocumentList';
import { DocumentView } from './pages/DocumentView';
import { ApplicationTree } from './pages/ApplicationTree';
import { ChatPage } from './pages/ChatPage';
import { Login } from './pages/Login';
import { Settings } from './pages/Settings';

export const router = createBrowserRouter([
  {
    path: '/login',
    Component: Login,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: 'chat',
        Component: ChatPage,
      },
      {
        path: 'tree',
        Component: ApplicationTree,
      },
      {
        path: 'settings',
        Component: Settings,
      },
      {
        path: 'docs/:category',
        Component: DocumentList,
      },
      {
        path: 'docs/:category/:id',
        Component: DocumentView,
      },
      {
        path: 'document/:id',
        Component: DocumentView,
      },
    ],
  },
]);