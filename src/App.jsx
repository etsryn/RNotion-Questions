import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'
import urlRoutes from "./Constants/Routes/questions-route";
import NLP_root from './Subjects/Natural-Language-Processing/Natural-Language-Processing-Q/ui_nlp_q';
import NLP_PoNLP from './Subjects/Natural-Language-Processing/Phases-of-Natural-Language-Processing-Q/ui_ponlp_q';


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
            {/* NLP */}
            <Route path={urlRoutes.natural_language_processing_dir.natural_language_processing} element={<NLP_root participantName={participantName} />} />
            <Route path={urlRoutes.natural_language_processing_dir.phases_of_natural_language_processing_dir.phases_of_natural_language_processing} element={<NLP_PoNLP participantName={participantName} />} />
            

            {/* Data Science */}

          </Routes>
        </Router>
  )
}

export default App
