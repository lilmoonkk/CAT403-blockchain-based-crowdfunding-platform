import './App.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Home from './views/Home';
import Navbar from './components/Navbar';
import SignUp from './views/SignUp';
import ConnectWallet from './views/ConnectWallet';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />}/>
        <Route path="/connect-wallet" element={<ConnectWallet />}/>
        <Route/>
      </Routes>
    </Router>
  );
}

export default App;
