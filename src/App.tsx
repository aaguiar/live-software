import React from 'react';
import './App.css';

import { useHistory } from "react-router-dom";

import { Select } from "evergreen-ui";

const App: React.FC = () => {
  let history = useHistory();

  return (
    <div>
      <div>
        <Select onChange={event => alert(event.target.value)}>
          <option value="foo" selected>1</option>
          <option value="bar">2</option>
        </Select>
      </div>
      <button type="button" onClick={() => history.push("/canvas/1")}>
        Go to Project
    </button>
    </div>
  );
}

export default App;
