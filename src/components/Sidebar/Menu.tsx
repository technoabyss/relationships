import { useCallback } from "react";
import type useGraphData from "@/hooks/useGraphData";
import Button from "@/components/Inputs/Button";
import Credits from "@/components/Credits";
import { IconBomb, IconDownload, IconUpload } from "@tabler/icons-react";

export interface MenuProps {
  graphData: ReturnType<typeof useGraphData>;
}

export default function Menu({ graphData }: MenuProps) {
  const { updateData, initialData } = graphData;
  const resetData = useCallback(() => updateData(initialData), [updateData, initialData]);

  return (
    <div className="sticky top-0 pt-2 bg-slate-800">
      <Credits />
      <div
        className="section mt-2"
        style={{
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0
        }}
      >
        <div className="flex flex-row gap-2">
          <Button
            className="icon-btn"
            hoverText="Save"
            label={<IconDownload size={16} />}
            onClick={() => console.log("TODO")}
          />
          <Button
            className="icon-btn"
            hoverText="Load"
            label={<IconUpload size={16} />}
            onClick={() => console.log("TODO")}
          />
          {/*
          TODO: UNDO/REDO
          <Button
            className="icon-btn"
            hoverText="Undo"
            label={<IconCornerUpLeft size={16} />}
            onClick={() => {
              console.log("TODO");
            }}
            props={{ disabled: !canUndo }}
          />
          <Button
            className="icon-btn"
            hoverText="Redo"
            label={<IconCornerUpRight size={16} />}
            onClick={() => {
              console.log("TODO");
            }}
            props={{ disabled: !canRedo }}
          />
          */}
          <Button
            className="icon-btn"
            hoverText="Delete all"
            label={<IconBomb size={16} />}
            onClick={() => resetData}
          />
        </div>
      </div>
    </div>
  );
}
