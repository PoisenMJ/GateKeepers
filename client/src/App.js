import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import Navbar from './components/Navbar/Navbar';
import ProductsNavbar from './components/ProductsNavigation/ProductsNavigation';
import ProductsPage from './pages/ProductList/ProductList';
import ProductPage from './pages/Product/Product';
import CustomsPage from './pages/Customs/Customs';
import CreateAccount from './pages/CreateAccount/CreateAccount';
import Login from './pages/Login/Login';
import Profile from './pages/Profile/Profile';

import Header from './components/Header/Header';
import PageLayout from './components/PageLayout/PageLayout';

import ProtectedRoute from './routes/ProtectedRoute';
import CreatorRoute from './routes/CreatorRoute';
import NonCreatorRoute from './routes/NonCreatorRoute';
import Upload from './pages/CreatorPortal/Upload/Upload';
import CreatorNavbar from './pages/CreatorPortal/Navbar/CreatorNavbar';
import CreatorProducts from './pages/CreatorPortal/Products/Products';
import CreatorProfile from './pages/CreatorPortal/Profile/CreatorProfile';

import { AuthProvider } from './services/AuthContext';
import EditProduct from './pages/CreatorPortal/EditProduct/EditProduct';
import About from './pages/About/About';
import ShoppingBasket from './pages/ShoppingBasket/ShoppingBasket';
import PaymentDetails from './pages/PaymentDetails/PaymentDetails';

import PaymentSuccess from './pages/PaymentSuccess/PaymentSuccess';
import PaymentFailure from './pages/PaymentFailure/PaymentFailure';
import { CartProvider } from './services/CartContext';
import CreatorsOrders from './pages/CreatorPortal/Orders/Orders';

import PasswordRecovery from './pages/PasswordRecovery/PasswordRecovery';
import PasswordChange from './pages/PasswordChange/PasswordChange';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Routes>
          <Route path="/">
            // index route (home)
            <Route element={<PageLayout header={<Header navbar={<Navbar/>}/>} body={<NonCreatorRoute/>} cartEnabled={true}/>}>
              <Route index element={<Home/>}/>
              <Route path="about" element={<About/>}/>
              <Route path="shopping-basket" element={<ShoppingBasket/>}/>
            </Route>

            <Route element={<PageLayout header={<Header navbar={<Navbar/>}/>} body={<NonCreatorRoute/>} cartEnabled={false}/>}>
              <Route path="payment-details" element={<PaymentDetails/>}/>
              <Route path="payment-success" element={<PaymentSuccess/>}/>
              <Route path="payment-failure" element={<PaymentFailure/>}/>
              <Route path="password-recovery/:username/:token" element={<PasswordRecovery/>}/>
              <Route path="password-change/:updateToken" element={<PasswordChange/>}/>
            </Route>
            
            // products routes
            <Route path=":creator" element={ <PageLayout header={<Header navbar={<Navbar/>} body={<NonCreatorRoute/>} navigation={<ProductsNavbar/>}/>} cartEnabled={false} />}>
              <Route index element={<ProductsPage type="made"/>}/>
              <Route path="own" element={<ProductsPage type="own"/>}/>
              <Route path="made" element={<ProductsPage type="made"/>}/>
              <Route path="customs" element={<CustomsPage/>}/>
              <Route path=":productURI/:type" element={<ProductPage/>}/>
            </Route>
    
            <Route element={<PageLayout header={<Header navbar={<Navbar/>}/>} body={<ProtectedRoute/>} cartEnabled={false}/>}>
              <Route path="profile" element={<Profile/>}/>
            </Route>

            <Route element={ <PageLayout header={<Header navbar={<Navbar/>} />} /> }>
              <Route path="create-account" element={<CreateAccount/>}/>
              <Route path="login" element={<Login/>}/>
            </Route>
          </Route>

          <Route path="creators" element={<PageLayout header={<Header navbar={<CreatorNavbar/>}/>} body={<CreatorRoute/>}/>}>
            <Route index element={<Upload/>}/>
            <Route path="upload" element={<Upload/>}/>
            <Route path="products" element={<CreatorProducts/>}/>
            <Route path="products/edit/:productID" element={<EditProduct/>}/>
            <Route path="orders" element={<CreatorsOrders/>}/>
            <Route path="profile" element={<CreatorProfile/>}/>
          </Route>

          // TODO:: WILDCARD ROUTE
        </Routes>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
