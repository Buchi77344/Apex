import { Routes, Route } from 'react-router-dom'

import BuyerBoxDashboard from './pages/Home'
import NotFound from './pages/NotFound'

function App() {
  return (
    <Routes>
      <Route path="/" element={<BuyerBoxDashboard />} />
     
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
