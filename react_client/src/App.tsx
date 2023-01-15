import { useState } from 'react';
import './App.scss';
import NameValidator, { getValidatedName, NameContext } from './components/name-input/NameValidator';
import Requestor, { RequestorContext } from './components/requestor/Requestor';
import IToast from './components/toaster/toast/IToast';
import Toaster, { ToasterContext } from './components/toaster/Toaster';
import Routing from './Routing';
import settings from './settings';
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
    setOngoingRequests(reqs => [...reqs, request as Promise<any>]);

    request
      .catch(err => {
        const errMessage = getResponseErrorMessage(err);
        showToast({
          message: errMessage,
          type: "error",
        });
      }).finally(() => {
        setOngoingRequests(req => req.filter(savedRequest => savedRequest !== request));
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

  const onUsernameClick = () => {
    const input = window.prompt("What do you want your new name to be?", "");

    if (!input?.trim()) {
      return;
    }

    const newName = getValidatedName(input);

    if (!newName) {
      showToast({
        message: "Your name is required and can contain only letters, numbers, dash, and underscore.",
        type: "error"
      });
      return false;
    }

    onUserNameChange(newName);
  };

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
              <a href={settings.baseUrl}>Party Playlist</a>
              <span className="username" onClick={onUsernameClick}>
                {username}
              </span>
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
