import React from "react";
import "./TextInput.scss";

interface ITextInputProps {
  label?: string,
  value: string,
  onChange(val: string): void,
  isRequired?: boolean,
  placeholder?: string,
  hint?: string,
  maxLength?: number,
}

const TextInput: React.FC<ITextInputProps> = ({
  label,
  value,
  onChange,
  isRequired = false,
  placeholder,
  hint,
  maxLength,
}) => {
  return (
    <div className="input-row flex-col-narrow">
      <label>
        {label}
        {isRequired &&
          <span className="required">*</span>
        }
      </label>
      <input
        type="text"
        placeholder={placeholder}
        required={isRequired}
        value={value}
        onChange={e => onChange(e.currentTarget.value)}
        maxLength={maxLength}
      />
      {!!hint &&
        <span className="hint">
          {hint}
        </span>
      }
    </div>
  );
};

export default TextInput;