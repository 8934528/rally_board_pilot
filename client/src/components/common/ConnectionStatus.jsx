function ConnectionStatus({
  connected,
  label = true
}) {
  return (
    <div className="connection-status-component">
      <span
        className={
          connected ? 'connection-dot online' : 'connection-dot offline'
        }/>

      {label && (
        <span>
          {connected ? 'CONNECTED' : 'OFFLINE'}
        </span>
      )}
    </div>
  );
}

export default ConnectionStatus;
