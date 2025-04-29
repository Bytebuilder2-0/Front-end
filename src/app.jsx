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
        <Route path="/login" element={<login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  );
}
export default App;