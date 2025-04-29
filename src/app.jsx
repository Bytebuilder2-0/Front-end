import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home'; // Your already created component
import Login from './pages/Loginpage';  // Your already created component
import Signup from './pages/SignupPage'; // Your already created component
import { enCA } from 'date-fns/locale';

function App() {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<Home />} /> 
        <Route path="/Loginpage" element={<Loginpage/>} />
        <Route path="/SignupPage" element={< SignupPage/>} />
      </Routes>
    </Router>
  );
}
export default App;