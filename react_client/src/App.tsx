import { useState } from 'react';
import './App.scss';
import NameValidator, { NameContext } from './components/name-input/NameValidator';
import Requestor, { RequestorContext } from './components/requestor/Requestor';
import IToast from './components/toaster/toast/IToast';
import Toaster, { ToasterContext } from './components/toaster/Toaster';
import Routing from './Routing';
import { getResponseErrorMessage } from './utilities/apiUtilities';

function App() {
  const [username, setUsername] = useState(localStorage.getItem("username") || "");
  const [ongoingRequests, setOngoingRequests] = useState<Promise<any>[]>([]);
  const [toasts, setToasts] = useState<IToast[]>([]);

  const onUserNameChange = (newName: string) => {
    setUsername(newName);
    localStorage.setItem("username", newName);
  };

  function trackRequest<T>(request: Promise<T>) {
    setOngoingRequests([...ongoingRequests, request as Promise<any>]);

    request
      .catch(err => {
        const errMessage = getResponseErrorMessage(err);
        showToast({
          message: errMessage,
          timestamp: new Date().getTime(),
          type: "error",
        });
      }).finally(() => {
        setOngoingRequests(ongoingRequests.filter(savedRequest => savedRequest !== request));
      });

    return request;
  }

  function showToast(toast: IToast) {
    const toastWithTimestamp = {
      ...toast,
      timestamp: new Date().getTime(),
    };
    
    setToasts([...toasts, toastWithTimestamp]);

    window.setTimeout(() => {
      setToasts(currentToasts => currentToasts.filter(x => x !== toastWithTimestamp));
    }, 3000);
  }

  return (
    <ToasterContext.Provider
      value={{
        showToast,
        removeToast: toast => setToasts(currentToasts => currentToasts.filter(x => x !== toast)),
        toasts,
      }}
    >
      <RequestorContext.Provider value={{
        ongoingRequests,
        trackRequest,
      }}>
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

          <Requestor />
          <Toaster />
        </NameContext.Provider>
      </RequestorContext.Provider>
    </ToasterContext.Provider>
  );
}

export default App;
