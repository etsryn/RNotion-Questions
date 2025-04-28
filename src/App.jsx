import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'
import urlRoutes from "./Constants/Routes/questions-route";
import NLP from './Subjects/Natural-Language-Processing/Natural-Language-Processing-Q/ui'
function App() {
  const [count, setCount] = useState(0)

  return (
        <Router>
          <Routes>
            {/* NLP */}
            <Route path={urlRoutes.natural_language_processing.natural_language_processing} element={<NLP />} />
            

            {/* Data Science */}

          </Routes>
        </Router>
  )
}

export default App
