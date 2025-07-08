import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './Pages/Home'
import ProductDetailPage from './Pages/ProductDetailPage'
import SearchResultsPage from './Pages/SearchResultsPage'
import DealersList from './Pages/DealersList'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/product-detail" element={<ProductDetailPage />} />
        <Route path="/SearchResultsPage" element={<SearchResultsPage />} />
        <Route path="/dealers-list" element={<DealersList />} />
        {/* Add more routes as needed */}
      </Routes>
    </BrowserRouter>
  )
}

export default App
