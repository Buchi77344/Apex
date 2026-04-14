import { Routes, Route } from 'react-router-dom'

import BuyerBoxDashboard from './pages/Home'
import DealIntelligence from './pages/DealIntelligence'
import SavedProperties from './pages/SavedProperties'
import MarketReports from './pages/MarketReports'
import BuyerMatching from './pages/BuyerMatching'
import NotFound from './pages/NotFound'

function App() {
  return (
    <Routes>
      <Route path="/" element={<BuyerBoxDashboard />} />
      <Route path="/deal-intelligence" element={<DealIntelligence />} />
      <Route path="/saved-properties" element={<SavedProperties />} />
      <Route path="/market-reports" element={<MarketReports />} />
      <Route path="/buyer-matching" element={<BuyerMatching />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
