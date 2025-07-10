import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/Home.tsx'
import ProductDetailPage from './pages/ProductDetailPage.tsx'
import SearchResultsPage from './pages/SearchResultsPage.tsx'
import DealersList from './pages/DealersList.tsx'

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
