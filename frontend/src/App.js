import "./App.css";
import './config/axios';
import HomeAdmin from "./pages/AdminLayout/HomeAdmin/HomeAdmin";
import HomePageUser from "./pages/HomePageUser/HomePageUser";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import LoginPage from "./pages/LoginPage/LoginPage";
// RegisterPage import removed (unused)
import NavBar from "./Components/NavBar/NavBar";
import Register from './pages/Auth/Register';
import Verify from './pages/Auth/Verify';
import ForgotPassword from './pages/Auth/ForgotPassword';
import ResetPassword from './pages/Auth/ResetPassword';
import VerifyCode from './pages/Auth/VerifyCode';
import ProtectedRoute from './Components/ProtectedRoute/ProtectedRoute';
// Layouts
import AdminLayout from "./pages/AdminLayout/AdminLayout";
import UserLayout from "./pages/UserLayout/UserLayout";


// Pages
import HomeLanding from "./pages/HomeLanding/HomeLanding";
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';
import theme from './theme/theme';
import UserInfoForms from "./pages/UserLayout/UserInfoForm";
import InviteroomatePages from "./pages/UserLayout/InviteRoomatePages";
import Paying from './pages/UserLayout/Paying';
import TopupHistory from './pages/UserLayout/TopupHistory/TopupHistory';
import Pricing from './pages/UserLayout/Pricing/Pricing';
import IsLandorStatus from './pages/UserLayout/IsLandorStatus';

import SupportPage from "./pages/UserLayout/Support";
import RoomsPage from "./pages/RoomsPage/RoomsPage";
import FavoritesPage from "./pages/FavoritesPage/FavoritesPage";
import RoomDetailPage from "./pages/RoomDetailPage/RoomDetailPage";
import RoomReviewsPage from "./pages/RoomReviewsPage/RoomReviewsPage";
import Footer from "./Components/Footer/Footer";
import PostRoomPages from "./pages/UserLayout/PostRoomPages";
import ManagePostUser from './pages/UserLayout/ManagePostUser';
import { ToastProvider } from "./Components/ToastProvider";
import PostEdit from './pages/PostEdit/PostEdit';
import InviteRooms from './pages/InviteRooms/InviteRooms';
import InviteDetail from './pages/InviteDetail/InviteDetail';
import NoPermission from './pages/NoPermission';
import AboutPage from './pages/AboutPage/AboutPage';

// Component con để sử dụng useLocation hook
function AppContent() {
  const location = useLocation();

  // Định nghĩa các route không hiển thị navbar
  const hideNavbarRoutes = ['/landlord', '/admin', '/register', '/login', '/verify', '/forgot-password', '/reset-password', '/verifycode'];

  // Kiểm tra có nên hiển thị navbar không
  const shouldShowNavbar = !hideNavbarRoutes.some(route =>
    location.pathname.startsWith(route)
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {shouldShowNavbar && <NavBar />}
      <Box component="main" sx={{ flex: 1 }}>
        <Routes>
          <Route path="/homeadmin" element={<HomeAdmin />} />
          <Route path="/homepage" element={<HomePageUser />} />
          <Route path="/" element={<HomeLanding />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/login" element={<LoginPage />} />
          {/* <Route path="/register" element={<RegisterPage />} /> */}
          <Route path="/register" element={<Register />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verifycode" element={<VerifyCode />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/rooms" element={<RoomsPage postType="room_rental" />} />
          <Route path="/invite-rooms" element={<RoomsPage postType="invite roomate" />} />
          <Route path="/invite/:id" element={<InviteDetail />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/room/:id" element={<RoomDetailPage />} />

          <Route path="/room/:id/reviews" element={<RoomReviewsPage />} />
          <Route path="/no-permission" element={<NoPermission />} />

          {/* Admin routes */}
          <Route path="/admin" element={
            <ProtectedRoute requireAdmin={true}>
              <AdminLayout />
            </ProtectedRoute>
          } />

          {/* User routes */}

          <Route path="/user" element={<UserLayout />}>
            <Route path="paying/:requirepaying" element={<Paying />} />
            <Route path="paying" element={<Paying />} />
            <Route path="topup-history" element={<TopupHistory />} />
            <Route path="pricing" element={<Pricing />} />
            <Route path="islandor" element={<IsLandorStatus />} />
            <Route path="edit-post/:postId" element={<PostEdit />} />
            <Route path="profile" element={<UserInfoForms />} />
            <Route path="posts" element={<ManagePostUser />} />
            <Route path="posts/edit/:postId" element={<PostEdit />} />
            <Route path="post-room" element={<PostRoomPages />} />
            <Route path="support" element={<SupportPage />} />
            <Route path="invite-roommate" element={<InviteroomatePages />} />
          </Route>

        </Routes>
      </Box>
      <Footer />
    </Box>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <ToastProvider>
          <AppContent />
        </ToastProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
