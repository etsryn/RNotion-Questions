import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'
import urlRoutes from "./Constants/Routes/questions-route";
import NLP from './Subjects/Natural-Language-Processing/Natural-Language-Processing-Q/set-1'
function App() {
  const [count, setCount] = useState(0)

  return (
        <Router>
          <Routes>
            {/* NLP */}
            <Route path={urlRoutes.natural_language_processing.natural_language_processing} element={<NLP />} />
            {/* <Route path={urlRoutes.login} element={<LoginPage />} />
            <Route path={urlRoutes.signup.personal} element={<SignUpPageOne />} />
            <Route path={urlRoutes.signup.contact} element={<SignUpPageTwo />} />
            <Route path={urlRoutes.signup.email_opt_verification} element={<SignUpPageThree />} /> */}

            {/* Data Science */}
            {/* <Route path="/login/student" element={<StudentLoginPage />} /> */}
            {/* <Route path="/login/examiner" element={<ExaminerLoginPage />} /> */}
            {/* <Route path="/login/student/registration/FS" element={<StudentRegistrationFS />} /> */}
            {/* <Route path=02"/login/student/registration/SS" element={<StudentRegistrationSS />} /> */}
          </Routes>
        </Router>
  )
}

export default App
