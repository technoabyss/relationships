import { isEmpty } from "lodash";
import useGraphData from "@/hooks/useGraphData";
import { MapNode } from "@/@types/Map";
import Editable from "@/components/Inputs/Editable";
import Button from "@/components/Inputs/Button";
import ColorPicker from "@/components/Inputs/ColorPicker";
import { IconCircles, IconPaint, IconTrash } from "@tabler/icons-react";

export interface GroupsProps {
  graphData: ReturnType<typeof useGraphData>
  selectedNode: MapNode | null;
}

export default function Groups({ graphData, selectedNode }: GroupsProps) {
  const {
    data,
    updateGroupColor,
    renameGroup,
    assignGroup,
    deleteGroup,
    createNewGroup
  } = graphData;

  if (isEmpty(data.nodes)) return;
  return (
    <div className="section">
      <h2 className="section-title">Groups</h2>
      {
        !isEmpty(data.groups) &&
        <ul className="flex flex-col gap-2">
          {
            data.groups.map(group => (
              <li key={group.id} className="flex gap-2">
                <ColorPicker
                  id={group.id}
                  value={group.color}
                  onChange={v => updateGroupColor(group, v)}
                />
                <Editable
                  className="cell"
                  id={group.id}
                  value={group.label}
                  placeholder="Name"
                  onChange={v => renameGroup(group, v)}
                />
                <Button
                  className="icon-btn"
                  label={<IconPaint size={16} />}
                  hoverText="Assign group to selected node"
                  onClick={() => {
                    if (!selectedNode) return;
                    assignGroup(selectedNode, group);
                  }}
                  props={{ disabled: !selectedNode }}
                />
                <Button
                  className="icon-btn"
                  hoverText="Delete this group"
                  label={<IconTrash size={16} />}
                  onClick={() => deleteGroup(group)}
                />
              </li>
            ))
          }
        </ul>
      }
      <Button
        label={"Add a group"}
        icon={<IconCircles size={16} />}
        onClick={createNewGroup}
      />
    </div>
  );
}
