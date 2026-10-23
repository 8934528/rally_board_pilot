import { useEffect, useState } from 'react';
import Button from '../common/Button';
import ColorPicker from '../common/ColorPicker';

function TeamConfig({
  team,
  teamData,
  onUpdate
}) {
  const [name, setName] = useState(teamData.name);
  const [color, setColor] = useState(teamData.color);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setName(teamData.name);
    setColor(teamData.color);
  }, [teamData.name, teamData.color]);

  const save = () => {
    onUpdate(team, name, color);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  return (
    <div className="team-config-block" id={`team-config-${team}`}>
      <div className="team-config-heading">
        <span className="team-config-tag">TEAM {team} CONFIGURATION</span>
      </div>

      <div className="team-field-group">
        <label htmlFor={`team-name-${team}`}>Team Name</label>
        <input
          id={`team-name-${team}`}
          className="team-input-text"
          value={name}
          maxLength={30}
          onChange={(event) => setName(event.target.value)}
        />
      </div>

      <div className="team-field-group">
        <label>Team Color</label>
        <ColorPicker
          value={color}
          onChange={(newColor) => setColor(newColor)}
          label={`Team ${team} Color`}
        />
      </div>

      <Button
        variant={saved ? 'success' : 'primary'}
        size="small"
        className="team-save-btn"
        id={`btn-save-team-${team}`}
        onClick={save}
      >
        {saved ? (
          <>
            <i className="bi bi-check2" /> SAVED
          </>
        ) : (
          'SAVE TEAM'
        )}
      </Button>
    </div>
  );
}

export default TeamConfig;
