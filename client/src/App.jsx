import {
  BrowserRouter,
  Route,
  Routes
} from 'react-router-dom';

import LandingPage from './pages/LandingPage';
import BoardPage from './pages/BoardPage';
import ControllerPage from './pages/ControllerPage';
import HostPage from './pages/HostPage';

function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route path="/" element={<LandingPage />}
        />

        <Route path="/controller" element={<ControllerPage />}
        />

        <Route path="/host" element={<HostPage />}
        />

        <Route path="/board" element={<BoardPage />}
        />

        <Route path="*" element={<LandingPage />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;
