import ReactDOM from 'react-dom/client';
import App from './App';
import { PortalContext } from './components/portal/Portal';
import './index.scss';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <PortalContext.Provider
    value={document.getElementById('portal') as HTMLDivElement}
  >
    <App />
  </PortalContext.Provider>
);
