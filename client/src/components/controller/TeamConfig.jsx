import { useEffect, useState } from 'react';

import Button from '../common/Button';

function TeamConfig({
  team,
  teamData,
  onUpdate
}) {
  const [name, setName] =
    useState(teamData.name);

  const [color, setColor] =
    useState(teamData.color);

  useEffect(() => {
    setName(teamData.name);
    setColor(teamData.color);
  }, [
    teamData.name,
    teamData.color
  ]);

  const save = () => {
    onUpdate(
      team,
      name,
      color
    );
  };

  return (
    <div className="team-config">

      <div className="team-config-heading">
        TEAM {team}
      </div>

      <label>
        Team Name
      </label>

      <input
        value={name}
        onChange={(event) =>
          setName(event.target.value)
        }
      />

      <label>
        Team Colour
      </label>

      <div className="color-input-row">

        <input
          type="color"
          value={color}
          onChange={(event) =>
            setColor(event.target.value)
          }
        />

        <span>
          {color}
        </span>

      </div>

      <Button
        variant="primary"
        onClick={save}
      >
        SAVE TEAM
      </Button>

    </div>
  );
}

export default TeamConfig;
