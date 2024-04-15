import { IconCircle } from "@tabler/icons-react";
import { InputHTMLAttributes, useState } from "react";

export interface ColorPickerProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  props?: InputHTMLAttributes<HTMLInputElement>;
}

export default function ColorPicker(props: ColorPickerProps) {
  const [value, setValue] = useState(props.value);
  const id = `color-${props.id}`;
  return (
    <label
      htmlFor={id}
      className={`
        colorpicker
        ${props.className ?? ""}
      `}
    >
      <input
        type="color"
        hidden
        id={id}
        value={value}
        onChange={e => {
          setValue(e.currentTarget.value);
          props.onChange(e.currentTarget.value);
        }}
        autoComplete="off"
        {...props.props}
      />
      <IconCircle
        size={16}
        fill={value}
        color={value}
        suppressHydrationWarning
      />
    </label>
  );
}

