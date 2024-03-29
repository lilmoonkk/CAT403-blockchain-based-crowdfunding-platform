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
import Profile from './views/Profile';
import Contribution from './views/Contribution';
import UploadProof from './views/UploadProof';
import ViewProof from './views/ViewProof';
import Admin from './views/Admin';
import AdminLogin from './views/AdminLogin';
import History from './views/History';
import PastProof from './views/PastProof';

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
        <Route path='user/:uid/history'>
          <Route index element={<History  />}/>
          <Route path=":projectid/proofs" element={<PastProof  />}/>
        </Route>
        <Route path="admin">
          <Route index element={<Admin />} />
          <Route path="login" element={<AdminLogin  />}/>
        </Route>
        <Route path="admin/:status" element={<Admin  />}/>
        <Route path="created-projects">
          <Route index element={<Profile />} />
          <Route path=":projectid/proofs" element={<UploadProof  />}/>
        </Route>
        <Route path="contributions">
          <Route index element={<Contribution />} />
          <Route path=":cid/proofs" element={<ViewProof  />}/>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
