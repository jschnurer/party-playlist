import React, { useContext, useState } from "react";
import TextInput from "../inputs/TextInput";
import { ToasterContext } from "../toaster/Toaster";

interface INameValidatorProps {
  children: React.ReactNode,
}

const NameValidator: React.FC<INameValidatorProps> = ({ children }) => {
  const nameState = useContext(NameContext);
  const [localName, setLocalName] = useState(nameState?.username || "");
  const toaster = useContext(ToasterContext);

  if (!nameState?.username) {
    const submitName = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const newName = getValidatedName(localName);
      
      if (!newName) {
        toaster?.showToast({
          message: "Your name is required and can contain only letters, numbers, dash, and underscore.",
          type: "error"
        });
        return false;
      }

      nameState?.setUsername(newName);
    };

    return (
      <div className="flex-col">
        <i>
          <h1>"Hang on, buddy..."</h1>
          "If you want in, I'm gonna need to see some ID."
        </i>

        <hr />

        Party playlist needs to know your name so it can keep track of who recommended which songs at the party.
        None of the data you enter into Party Playlist is tracked, shared, or stored.

        <form onSubmit={submitName}>
          <div className="flex-col">
            <TextInput
              label="Your name"
              onChange={newName => setLocalName(newName.replaceAll(/[^a-zA-Z0-9 \-_]/g, ""))}
              value={localName}
              placeholder="Others will know you as..."
              isRequired
            />

            <button
              className="primary"
            >
              let's party!
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <>
      {children}
    </>
  );
};

export default NameValidator;

const NameContext = React.createContext<{
  username: string,
  setUsername: (name: string) => void,
} | null>(null);
export { NameContext };

export function getValidatedName(name: string) {
  const parsedInput = name.replaceAll(/[^a-zA-Z0-9 \-_]/g, "");
  return parsedInput.trim().length > 1
    ? parsedInput
    : undefined;
}