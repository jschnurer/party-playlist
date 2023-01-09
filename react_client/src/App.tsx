import './App.scss';
import Routing from './Routing';

function App() {
  return (
    <div className="app">
      <header>
        <span>Party Playlist</span>
      </header>

      <article>
        <div className="page">
          <Routing />
        </div>
      </article>
    </div>
  );
}

export default App;
