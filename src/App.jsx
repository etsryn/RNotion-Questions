import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'
import urlRoutes from "./Constants/Routes/questions-route";
import NLP_root from './Subjects/Natural-Language-Processing/Natural-Language-Processing-Q/ui_nlp_q';
import NLP_PoNLP from './Subjects/Natural-Language-Processing/Phases-of-Natural-Language-Processing-Q/ui_ponlp_q';
import ALHAAN from './Subjects/Alhaan/ui_alhaan_q';


function App() {
  const [participantName, setParticipantName] = useState(null);

  useEffect(() => {
    let flag = true;
    while(flag) {
      const name = prompt("Enter your name correctly as it will appear on the certificate:");
      if(name) {
        setParticipantName(name);
        flag = false;
      }
    }
  }, []);

  return (
        <Router>
          <Routes>
            
            {/* ALHAAN */}
            <Route path={urlRoutes.alhaan_dir.alhaan} element={<ALHAAN participantName={participantName} />} />

            {/* NLP */}
            <Route path={urlRoutes.natural_language_processing_dir.natural_language_processing} element={<NLP_root participantName={participantName} />} />
            <Route path={urlRoutes.natural_language_processing_dir.phases_of_natural_language_processing_dir.phases_of_natural_language_processing} element={<NLP_PoNLP participantName={participantName} />} />
            

            {/* Data Science */}

          </Routes>
        </Router>
  )
}

export default App
