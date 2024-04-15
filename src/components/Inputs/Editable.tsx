import { InputHTMLAttributes, ReactNode, useState } from "react";

export interface EditableProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: ReactNode;
  className?: string;
  props?: InputHTMLAttributes<HTMLInputElement>;
}

export default function Editable(props: EditableProps) {
  const [value, setValue] = useState(props.value);
  const id = `editable-${props.id}`;
  return (
    <label
      htmlFor={id}
      className={`
        editable
        ${props.className ?? ""}
      `}
    >
      {props.label && <label htmlFor={id}>{props.label}</label>}
      <input
        type="text"
        id={id}
        value={value}
        placeholder={props.placeholder}
        onChange={e => {
          setValue(e.currentTarget.value);
          props.onChange(e.currentTarget.value);
        }}
        {...props.props}
      />
    </label>
  );
}
