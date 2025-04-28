import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'
import urlRoutes from "./Constants/Routes/questions-route";
import NLP_root from './Subjects/Natural-Language-Processing/Natural-Language-Processing-Q/ui';
import NLP_PoNLP from './Subjects/Natural-Language-Processing/Phases-of-Natural-language-Processing-Q/ui';
function App() {
  const [count, setCount] = useState(0)

  return (
        <Router>
          <Routes>
            {/* NLP */}
            <Route path={urlRoutes.natural_language_processing_dir.natural_language_processing} element={<NLP_root />} />
            {/* <Route path={urlRoutes.natural_language_processing_dir.phases_of_natural_language_processing_dir.phases_of_natural_language_processing} element={<NLP_PoNLP />} /> */}
            <Route path={"/f841e8e163c2b6d20d96f71eef66d18b3630c021dd54571a949983f29f589b54"} element={<NLP_PoNLP />} />
            

            {/* Data Science */}

          </Routes>
        </Router>
  )
}

export default App
