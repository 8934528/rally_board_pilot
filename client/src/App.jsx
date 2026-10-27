import {
  BrowserRouter,
  Route,
  Routes,
  useLocation
} from 'react-router-dom';

import { GameProvider } from './context/GameContext';
import { ROLES } from './constants/roles';
import LandingPage from './pages/LandingPage';
import BoardPage from './pages/BoardPage';
import ControllerPage from './pages/ControllerPage';
import HostPage from './pages/HostPage';
import ActivityPage from './pages/ActivityPage';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/controller"
        element={
          <GameProvider role={ROLES.CONTROLLER}>
            <ControllerPage />
          </GameProvider>
        }
      />
      <Route
        path="/host"
        element={
          <GameProvider role={ROLES.HOST}>
            <HostPage />
          </GameProvider>
        }
      />
      <Route
        path="/board"
        element={
          <GameProvider role={ROLES.BOARD}>
            <BoardPage />
          </GameProvider>
        }
      />
      <Route
        path="/activity"
        element={
          <GameProvider role={ROLES.CONTROLLER}>
            <ActivityPage />
          </GameProvider>
        }
      />
      <Route path="*" element={<LandingPage />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
