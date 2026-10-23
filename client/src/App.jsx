import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import BoardPage from './pages/BoardPage';
import ControllerPage from './pages/ControllerPage';
import HostPage from './pages/HostPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Navigate to="/controller" replace />}
        />

        <Route
          path="/controller"
          element={<ControllerPage />}
        />

        <Route
          path="/host"
          element={<HostPage />}
        />

        <Route
          path="/board"
          element={<BoardPage />}
        />

        <Route
          path="*"
          element={<Navigate to="/controller" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
