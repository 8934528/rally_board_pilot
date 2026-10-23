import { useSocket } from './hooks/useSocket';

function App() {
  const {
    connected,
    welcomeMessage
  } = useSocket();

  return (
    <div className="container py-5">
      <div className="text-center">
        <h1 className="display-4 fw-bold">
          Rally Board Pilot
        </h1>

        <p className="lead text-secondary">
          Live Game Control and Scoreboard System
        </p>

        <div
          className={`alert ${
            connected ? 'alert-success' : 'alert-warning'
          } mt-4`}
        >
          {connected ? '● Connected to Rally Board Pilot server' : '○ Connecting to server...'}
        </div>

        {welcomeMessage && (
          <div className="mt-3 text-secondary">
            {welcomeMessage}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
