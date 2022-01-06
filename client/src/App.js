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

function App() {
  return (
    <Routes>
      <Route path="/">
        // index route (home)
        <Route index element={<PageLayout header={<Header navbar={<Navbar/>}/>} body={<Home/>}/>}/>
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
    </Routes>
  );
}

export default App;
