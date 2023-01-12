import { useState } from 'react';
import './App.scss';
import NameValidator, { NameContext } from './components/name-input/NameValidator';
import Routing from './Routing';

function App() {
  const [username, setUsername] = useState(localStorage.getItem("username") || "");

  const onUserNameChange = (newName: string) => {
    setUsername(newName);
    localStorage.setItem("username", newName);
  };

  return (
    <NameContext.Provider value={{
      username,
      setUsername: onUserNameChange,
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
