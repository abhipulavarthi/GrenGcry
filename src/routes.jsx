import { lazy } from 'react'
import { Navigate } from 'react-router-dom'
import Layout from './layouts/Layout'
import RoleRoute from './components/RoleRoute'
import RoleHomeRedirect from './components/RoleHomeRedirect'

const Login = lazy(() => import('./pages/auth/Login'))
const Signup = lazy(() => import('./pages/auth/Signup'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Products = lazy(() => import('./pages/products/Products'))
const ProductForm = lazy(() => import('./pages/products/ProductForm'))
const Orders = lazy(() => import('./pages/orders/Orders'))
// OrderCreate deprecated: redirect handled via Navigate
const OrderDetails = lazy(() => import('./pages/orders/OrderDetails'))
const Cart = lazy(() => import('./pages/cart/Cart'))
const Billing = lazy(() => import('./pages/billing/Billing'))
const Reports = lazy(() => import('./pages/reports/Reports'))
const Feedback = lazy(() => import('./pages/feedback/Feedback'))
const AdminReviews = lazy(() => import('./pages/feedback/AdminReviews'))
const NotFound = lazy(() => import('./pages/NotFound'))
const AdminDashboard = lazy(() => import('./pages/dashboards/AdminDashboard'))
const UserDashboard = lazy(() => import('./pages/dashboards/UserDashboard'))
const OffersPage = lazy(() => import('./pages/offers/Offers'))
const AccountPage = lazy(() => import('./pages/account/Account'))
const CategoryProducts = lazy(() => import('./pages/category/CategoryProducts'))
const AdminUsers = lazy(() => import('./pages/admin/Users'))
const ProductView = lazy(() => import('./pages/products/ProductView.jsx'))

const routes = [
  {
    path: '/', element: <Layout />,
    children: [
      { index: true, element: <RoleHomeRedirect /> },
      { path: 'admin', element: <RoleRoute roles={['admin']}><AdminDashboard /></RoleRoute> },
      { path: 'user', element: <RoleRoute roles={['customer']}><UserDashboard /></RoleRoute> },
      { path: 'products', element: <Products /> },
      { path: 'category/:slug', element: <CategoryProducts /> },
      { path: 'offers', element: <OffersPage /> },
      { path: 'account', element: <AccountPage /> },
      { path: 'products/new', element: <RoleRoute roles={['admin']}><ProductForm /></RoleRoute> },
      { path: 'products/:id', element: <RoleRoute roles={['admin']}><ProductForm /></RoleRoute> },
      { path: 'orders', element: <Orders /> },
      { path: 'orders/new', element: <Navigate to="/cart" replace /> },
      { path: 'orders/:id', element: <OrderDetails /> },
      { path: 'cart', element: <Cart /> },
      { path: 'billing/:orderId', element: <Billing /> },
      { path: 'reports', element: <RoleRoute roles={['admin']}><Reports /></RoleRoute> },
      { path: 'admin/users', element: <RoleRoute roles={['admin']}><AdminUsers /></RoleRoute> },
      { path: 'reviews', element: <RoleRoute roles={['admin']}><AdminReviews /></RoleRoute> },
      { path: 'item/:id', element: <ProductView /> },
      { path: 'feedback', element: <Feedback /> },
    ]
  },
  { path: '/login', element: <Login /> },
  { path: '/login/admin', element: <Login /> },
  { path: '/login/user', element: <Login /> },
  { path: '/login/salesperson', element: <Login /> },
  { path: '/signup', element: <Signup /> },
  { path: '*', element: <NotFound /> },
]

export default routes
