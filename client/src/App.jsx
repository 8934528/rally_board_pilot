import {
  BrowserRouter,
  Route,
  Routes
} from 'react-router-dom';

import { GameProvider } from './context/GameContext';
import LandingPage from './pages/LandingPage';
import BoardPage from './pages/BoardPage';
import ControllerPage from './pages/ControllerPage';
import HostPage from './pages/HostPage';
import ActivityPage from './pages/ActivityPage';

function App() {
  return (
    <GameProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/controller" element={<ControllerPage />} />
          <Route path="/host" element={<HostPage />} />
          <Route path="/board" element={<BoardPage />} />
          <Route path="/activity" element={<ActivityPage />} />
          <Route path="*" element={<LandingPage />} />
        </Routes>
      </BrowserRouter>
    </GameProvider>
  );
}

export default App;
