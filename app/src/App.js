import './App.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Home from './views/Home';
import Navbar from './components/Navbar';
import SignUp from './views/SignUp';
import ConnectWallet from './views/ConnectWallet';
import Login from './views/Login';
import StartProject from './views/StartProject';
import Explore from './views/Explore';
import Project from './views/Project';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="signup">
          <Route index element={<SignUp />} />
          <Route path="connect-wallet" element={<ConnectWallet />}/>{}
        </Route>
        <Route path="login" element={<Login />}/>
        <Route path="start-a-project" element={<StartProject  />}/>
        <Route path="explore" element={<Explore  />}/>
        <Route path="project/:projectid" element={<Project  />}/>
      </Routes>
    </Router>
  );
}

export default App;
