import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import CreatorsOwnPage from './pages/CreatorsOwnPage/CreatorsOwnPage';
import Navbar from './components/Navbar/Navbar';
import CreatorNavbar from './components/CreatorNavbar/CreatorNavbar';
import MadeProductsPage from './pages/MadeProductsPage/MadeProductsPage';

// data types for products: types (creator, product, custom)

function App() {
  return (
    <Routes>
      <Route element={<Navbar/>}>
        <Route path="/">
          <Route index element={<Home/>}/>
          <Route path=":creator" element={<CreatorNavbar/>}>
            <Route path="own" element={<CreatorsOwnPage/>}/>
            <Route path="products" element={<MadeProductsPage/>}/>
            <Route path="customs"/>
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
