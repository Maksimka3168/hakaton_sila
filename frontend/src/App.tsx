import './App.css'
import Layout from './Layout';
import { BrowserRouter, Navigate } from "react-router-dom";
import { useRoutes } from "react-router-dom";
import Chat from './pages/Chat/Chat';
import Email from './pages/Email/Email';
import UploadFile from './pages/UploadFile/UploadFile';
import Graphics from './pages/Graphics/Graphics';
function AppRoutes() {
  const routes = [
    {
      path: "/",
      element: <Layout />,
      children: [
        { path: "/", element: <Navigate to="/chat" replace /> },
        { path: "chat", element: <Chat /> },
        { path: "email", element: <Email /> },
        { path: "uploadfile", element: <UploadFile /> },
        { path: "graphics", element: <Graphics /> },
      ],
    },
  ];

  return useRoutes(routes);
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;