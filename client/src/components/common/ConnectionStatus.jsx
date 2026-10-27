import Tooltip from './Tooltip';

function ConnectionStatus({
  connected,
  label = false,
  dotOnly = true
}) {
  const statusText = connected ? 'Server Connected' : 'Server Disconnected';
  const showLabel = label && !dotOnly;

  const dot = (
    <span
      className={`connection-dot ${connected ? 'online' : 'offline'}`}
      aria-label={`Server: ${statusText}`}
      role="status"
    />
  );

  if (dotOnly) {
    return (
      <Tooltip content={statusText}>
        <div className="connection-status-dot-only">
          {dot}
        </div>
      </Tooltip>
    );
  }

  return (
    <div className="connection-status-component" role="status">
      {dot}
      {showLabel && (
        <span className="connection-status-text">
          {connected ? 'SERVER CONNECTED' : 'SERVER OFFLINE'}
        </span>
      )}
    </div>
  );
}

export default ConnectionStatus;
