import React, { useState } from 'react';
import './App.css';

import { useHistory } from "react-router-dom";

import { Button, SelectField } from "evergreen-ui";

const App: React.FC = () => {
  // Declare a new state variable, which we'll call "count"
  const [projectId, setProjectId] = useState("1");

  let history = useHistory();

  let handleSelectProject = (value: string) => {
    setProjectId(value);
  }

  let pushToCanvasPage = () => {
    history.push(`/canvas/${projectId}`);
  }

  return (
    <div id="slct-proj">
      <div>
        <SelectField
          value={projectId}
          width={"15%"}
          label="Select project:"
          onChange={(event: { target: { value: string; }; }) => handleSelectProject(event.target.value)}>
          <option value="1">1</option>
          <option value="2">2</option>
        </SelectField>
      </div>
      <div>
      <Button
        appearance="default"
        iconBefore="circle-arrow-down"
        onClick={() => pushToCanvasPage()}>
        Go to Project!
      </Button>
      </div>
    </div>
  );
}

export default App;
