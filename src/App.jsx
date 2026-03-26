import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { Toaster } from 'react-hot-toast';

// Layouts
import AdminLayout from './layouts/AdminLayout';
import ReceptionistLayout from './layouts/ReceptionistLayout';
import HousekeepingLayout from './layouts/HousekeepingLayout';
import MaintenanceLayout from './layouts/MaintenanceLayout';
import GuestLayout from './layouts/GuestLayout';
import PublicLayout from './layouts/PublicLayout';

// Public Pages
import Home from './pages/public/Home';
import About from './pages/public/About';
import Contact from './pages/public/Contact';
import RoomsList from './pages/public/RoomsList';
import RoomDetail from './pages/public/RoomDetail';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageStaff from './pages/admin/ManageStaff';
import ManageGuests from './pages/admin/ManageGuests';
import ManageRooms from './pages/admin/ManageRooms';
import GlobalSettings from './pages/admin/GlobalSettings';

// Receptionist Pages
import ReceptionistDashboard from './pages/receptionist/ReceptionistDashboard';
import CheckInOut from './pages/receptionist/CheckInOut';

// Service Portals
import HousekeepingDashboard from './pages/housekeeping/HousekeepingDashboard';
import MaintenanceDashboard from './pages/maintenance/MaintenanceDashboard';

// Guest Pages
import GuestDashboard from './pages/guest/GuestDashboard';
import MyBookings from './pages/guest/MyBookings';
import GuestProfile from './pages/guest/GuestProfile';
import ServiceRequest from './pages/guest/ServiceRequest';
import Feedback from './pages/guest/Feedback';

// Shared Pages
import Notifications from './pages/shared/Notifications';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Unauthorized from './pages/Unauthorized';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-center" reverseOrder={false} />
        <Routes>
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/rooms" element={<RoomsList />} />
            <Route path="/rooms/:id" element={<RoomDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="rooms" element={<ManageRooms />} />
              <Route path="staff" element={<ManageStaff />} />
              <Route path="guests" element={<ManageGuests />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="settings" element={<GlobalSettings />} />
            </Route>
          </Route>

          {/* Receptionist Routes */}
          <Route element={<ProtectedRoute allowedRoles={['admin', 'receptionist']} />}>
            <Route path="/receptionist" element={<ReceptionistLayout />}>
              <Route index element={<ReceptionistDashboard />} />
              <Route path="operations" element={<CheckInOut />} />
              <Route path="notifications" element={<Notifications />} />
            </Route>
          </Route>

          {/* Housekeeping Routes */}
          <Route element={<ProtectedRoute allowedRoles={['admin', 'housekeeping']} />}>
            <Route path="/housekeeping" element={<HousekeepingLayout />}>
              <Route index element={<HousekeepingDashboard />} />
            </Route>
          </Route>

          {/* Maintenance Routes */}
          <Route element={<ProtectedRoute allowedRoles={['admin', 'maintenance']} />}>
            <Route path="/maintenance" element={<MaintenanceLayout />}>
              <Route index element={<MaintenanceDashboard />} />
            </Route>
          </Route>

          {/* Guest Routes */}
          <Route element={<ProtectedRoute allowedRoles={['guest', 'admin', 'receptionist']} />}>
            <Route path="/guest" element={<GuestLayout />}>
              <Route index element={<GuestDashboard />} />
              <Route path="bookings" element={<MyBookings />} />
              <Route path="profile" element={<GuestProfile />} />
              <Route path="services" element={<ServiceRequest />} />
              <Route path="feedback" element={<Feedback />} />
            </Route>
          </Route>

          {/* 404 Catch All */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
