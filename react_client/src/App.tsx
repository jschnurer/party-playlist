import { useState } from 'react';
import './App.scss';
import NameValidator, { NameContext } from './components/name-input/NameValidator';
import Routing from './Routing';

function App() {
  const [username, setUsername] = useState("");

  return (
    <NameContext.Provider value={{
      username: localStorage.getItem("username") || "",
      setUsername,
    }}>
      <div className="app">
        <header>
          <span>Party Playlist</span>
        </header>

        <article>
          <div className="page">
            <NameValidator>
              <Routing />
            </NameValidator>
          </div>
        </article>
      </div>
    </NameContext.Provider>
  );
}

export default App;
