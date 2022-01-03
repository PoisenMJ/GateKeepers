import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import Navbar from './components/Navbar/Navbar';
import ProductsNavbar from './components/ProductsNavigation/ProductsNavigation';
import ProductsPage from './pages/ProductList/ProductList';
import ProductPage from './pages/Product/Product';
import CustomsPage from './pages/Customs/Customs';

import Header from './components/Header/Header';
import PageLayout from './components/PageLayout/PageLayout';

// data types for products: types (own, made, custom)

function App() {
  return (
    <Routes>
      <Route path="/">
        <Route index element={<Home/>}/>
        <Route path=":creator" element={ <PageLayout header={<Header navbar={<Navbar/>} navigation={<ProductsNavbar/>} />} />}>
          <Route path="own" element={<ProductsPage type="own"/>}/>
          <Route path="made" element={<ProductsPage type="made"/>}/>
          <Route path="customs" element={<CustomsPage/>}/>
          <Route path=":productName" element={<ProductPage/>}/>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
