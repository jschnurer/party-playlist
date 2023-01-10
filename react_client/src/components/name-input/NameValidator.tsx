import React, { useContext } from "react";
import TextInput from "../inputs/TextInput";

interface INameValidatorProps {
  children: React.ReactNode,
}

const NameValidator: React.FC<INameValidatorProps> = ({ children }) => {
  const nameState = useContext(NameContext);

  if (!nameState?.username) {
    return (
      <div className="flex-col">
        <i>
          <h1>"Hang on, buddy..."</h1>
          "If you want in, I'm gonna need to see some ID."
        </i>

        <hr />
        
        Party playlist needs to know your name so it can keep track of who recommended which songs at the party.
        None of the data you enter into Party Playlist is tracked, shared, or stored.

        <TextInput
          label="Your name"
          onChange={() => { }}
          value={""}
          placeholder="Others will know you as..."
          isRequired
        />
        
        <button
          className="primary"
        >
          let's party!
        </button>
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

