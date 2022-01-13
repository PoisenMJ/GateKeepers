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
import Upload from './pages/CreatorPortal/Upload/Upload';
import CreatorNavbar from './pages/CreatorPortal/Navbar/CreatorNavbar';
import CreatorProducts from './pages/CreatorPortal/Products/Products';
import CreatorProfile from './pages/CreatorPortal/Profile/CreatorProfile';

import { AuthProvider } from './services/AuthContext';
import EditProduct from './pages/CreatorPortal/EditProduct/EditProduct';
import About from './pages/About/About';
import Contact from './pages/Contact/Contact';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/">
          // index route (home)
          <Route element={<PageLayout header={<Header navbar={<Navbar/>}/>}/>}>
            <Route index element={<Home/>}/>
            <Route path="about" element={<About/>}/>
            <Route path="contact-us" element={<Contact/>}/>
          </Route>
          
          // products routes
          <Route path=":creator" element={ <PageLayout header={<Header navbar={<Navbar/>} navigation={<ProductsNavbar/>} />} />}>
            <Route path="own" element={<ProductsPage type="own"/>}/>
            <Route path="made" element={<ProductsPage type="made"/>}/>
            <Route path="customs" element={<CustomsPage/>}/>
            <Route path=":productName" element={<ProductPage/>}/>
          </Route>

          <Route element={<PageLayout header={<Header navbar={<Navbar/>}/>} body={<ProtectedRoute/>}/>}>
            <Route path="profile" element={<Profile/>}/>
          </Route>

          <Route element={<PageLayout header={<Header navbar={<Navbar/>}/>}/>}>
            <Route path="create-account" element={<CreateAccount/>}/>
            <Route path="login" element={<Login/>}/>
          </Route>

        </Route>

        <Route path="creators" element={<PageLayout header={<Header navbar={<CreatorNavbar/>}/>} body={<CreatorRoute/>}/>}>
          <Route path="upload" element={<Upload/>}/>
          <Route path="products" element={<CreatorProducts/>}/>
          <Route path="products/edit/:productID" element={<EditProduct/>}/>
          <Route path="profile" element={<CreatorProfile/>}/>
        </Route>

        // TODO:: WILDCARD ROUTE
        {/* <Route element={<PageLayout header={<Header navbar={<Navbar/>}/>} body={<Home/>}/>}/> */}
      </Routes>
    </AuthProvider>
  );
}

export default App;
