import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Assets from './pages/Assets';
import MaintenanceForm from './pages/MaintenanceForm';
import MaintenanceDetails from './pages/MaintenanceDetails';
import AssignedAssets from './pages/AssignedAssets';
import AdminAssets from './pages/AdminAssets';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import CreateAsset from './pages/CreateAsset';
function Layout({ children }) {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="app-main">
        <Navbar />
        {children}
      </div>
    </div>
  );
}

function App() {
  const token = localStorage.getItem('token');

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={token ? <Navigate to="/" replace /> : <Login />} />
        <Route path="/register" element={token ? <Navigate to="/" replace /> : <Register />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout><Dashboard /></Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/assets"
          element={
            <ProtectedRoute>
              <Layout><Assets /></Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/maintenance"
          element={
            <ProtectedRoute>
              <Layout><MaintenanceForm /></Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/maintenance-details"
          element={
            <ProtectedRoute>
              <Layout><MaintenanceDetails /></Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/assigned-assets"
          element={
            <ProtectedRoute>
              <Layout><AssignedAssets /></Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin-assets"
          element={
            <ProtectedRoute>
              <Layout><AdminAssets /></Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-asset"
          element={
            <ProtectedRoute>
              <Layout><CreateAsset /></Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;