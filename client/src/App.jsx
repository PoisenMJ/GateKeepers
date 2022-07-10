import React from 'react';

import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import ProductsPage from './pages/ProductList/ProductList';
import ProductPage from './pages/Product/Product';
import CreateAccount from './pages/CreateAccount/CreateAccount';
import Login from './pages/Login/Login';
import Profile from './pages/Profile/Profile';

import PageLayout from './components/PageLayout/PageLayout';

import ProtectedRoute from './routes/ProtectedRoute';
import CreatorRoute from './routes/CreatorRoute';
import NonCreatorRoute from './routes/NonCreatorRoute';
import Upload from './pages/CreatorPortal/Upload/Upload';
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
import LibraryPage from './pages/Library/Library';
import LibraryOutfitPage from './pages/LibraryOutfit/LibraryOutfit';
import CreatorLibrary from './pages/CreatorPortal/Library/CreatorLibrary';
import CreatorLibraryEdit from './pages/CreatorPortal/LibraryEdit/CreatorLibraryEdit';
import CreatorLoginPage from './pages/CreatorPortal/Login/CreatorLogin';
import Instagram from './services/Instagram';
import CustomsHome from './pages/Customs/CustomsHome/CustomsHome';
import CustomsChat from './pages/Customs/CustomsChat/CustomsChat';
import CreatorCustoms from './pages/CreatorPortal/Customs/CreatorCustoms';
import CreatorHeader from './components/Creator/CreatorHeader/CreatorHeader';
import UserHeader from './components/User/UserHeader/UserHeader';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Routes>
          <Route path="/">
            {/* index route (home) (transparent nav)  */}
            <Route
              index
              element={(
                <PageLayout
                  header={<UserHeader transparent />}
                  body={<Home />}
                />
              )}
            />
            {/* basic routes (non-transparent nav) */}
            <Route element={<PageLayout header={<UserHeader />} />}>
              <Route path="about" element={<About />} />
              <Route path="shopping-basket" element={<ShoppingBasket />} />
            </Route>
            <Route
              element={(
                <PageLayout
                  header={<UserHeader showCart={false} />}
                  body={<NonCreatorRoute />}
                />
              )}
            >
              <Route path="payment-details" element={<PaymentDetails />} />
              <Route path="payment-success" element={<PaymentSuccess />} />
              <Route path="payment-failure" element={<PaymentFailure />} />
              <Route
                path="password-recovery/:username/:token"
                element={<PasswordRecovery />}
              />
              <Route
                path="password-change/:updateToken"
                element={<PasswordChange />}
              />
            </Route>
            {/* products routes */}
            <Route
              path=":creator"
              element={<PageLayout header={<UserHeader productNav />} />}
            >
              <Route index element={<ProductsPage type="made" />} />
              <Route path="own" element={<ProductsPage type="own" />} />
              <Route path="made" element={<ProductsPage type="made" />} />
              <Route path="library" element={<LibraryPage />} />
              <Route path="library/:name" element={<LibraryOutfitPage />} />
              <Route path=":productURI/:type" element={<ProductPage />} />
              <Route path="customs" element={<CustomsHome />} />
            </Route>
            <Route
              path=":creator"
              element={(
                <PageLayout
                  header={<UserHeader productNav />}
                  body={<ProtectedRoute />}
                />
              )}
            >
              <Route path="customs/chat" element={<CustomsChat />} />
            </Route>
            <Route
              element={
                <PageLayout header={<UserHeader />} body={<ProtectedRoute />} />
              }
            >
              <Route path="profile" element={<Profile />} />
            </Route>
            <Route element={<PageLayout header={<UserHeader />} />}>
              <Route path="create-account" element={<CreateAccount />} />
              <Route path="login" element={<Login />} />
            </Route>
          </Route>
          <Route
            path="creators/login"
            element={<PageLayout body={<CreatorLoginPage />} />}
          />
          <Route
            path="creators"
            element={
              <PageLayout header={<CreatorHeader />} body={<CreatorRoute />} />
            }
          >
            <Route index element={<CreatorsOrders />} />
            <Route path="upload" element={<Upload />} />
            <Route path="products" element={<CreatorProducts />} />
            <Route path="products/edit/:productID" element={<EditProduct />} />
            <Route path="orders" element={<CreatorsOrders />} />
            <Route path="profile" element={<CreatorProfile />} />
            <Route path="library" element={<CreatorLibrary />} />
            <Route
              path="library/add"
              element={<CreatorLibraryEdit type="add" />}
            />
            <Route
              path="library/edit/:name"
              element={<CreatorLibraryEdit type="edit" />}
            />
            <Route path="customs" element={<CreatorCustoms />} />
          </Route>
          <Route path="insta_fe/redirect" element={<Instagram />} />
          {/* TODO:: WILDCARD ROUTE */}
        </Routes>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
