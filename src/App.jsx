import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Contact from './pages/Contact';
import InternshipDetails from './pages/InternshipDetails';

import DataScience from './pages/DataScience';
import MachineLearning from './pages/MachineLearning';
import AI from './pages/AI';
import MernStack from './pages/MernStack';
import DevOps from './pages/DevOps';
import JavaFullStack from './pages/JavaFullStack';
import PythonProgramming from './pages/PythonProgramming';
import AWSCloudComputing from './pages/AWSCloudComputing';
import CyberSecurity from './pages/CyberSecurity';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/data-science" element={<DataScience />} />
        <Route path="/machine-learning" element={<MachineLearning />} />
        <Route path="/ai" element={<AI />} />
        <Route path="/mern-stack" element={<MernStack />} />
        <Route path="/devops" element={<DevOps />} />
        <Route path="/java-full-stack" element={<JavaFullStack />} />
        <Route path="/python-programming" element={<PythonProgramming />} />
        <Route path="/aws-cloud-computing" element={<AWSCloudComputing />} />
        <Route path="/cyber-security" element={<CyberSecurity />} />
        <Route path="/internship/:id" element={<InternshipDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
