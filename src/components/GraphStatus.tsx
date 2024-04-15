import { InteractionState } from "@/@types/UI";
import { useMemo } from "react";

export default function GraphStatus({ state }: { state: InteractionState }) {
  const text = useMemo(() => {
    switch (state) {
      case InteractionState.LOADING: return "Loading...";
      case InteractionState.SELECTING: return "Click on a node to select it";
      case InteractionState.LINKING: return "Click a 2nd node to create a link";
    }
  }, [state]);

  return (
    <div className="
      absolute z-10
      px-2 py-1 rounded-br-lg
      text-sm select-none
      border-gray-700 border-b border-r
      bg-gray-900 bg-opacity-50
    ">
      {text}
    </div>
  );
}
