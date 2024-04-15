import { MapNode } from "@/@types/Map";
import Button from "@/components/Inputs/Button";
import Editable from "@/components/Inputs/Editable";
import type useGraphData from "@/hooks/useGraphData";
import {
  IconPlus,
  IconCircle,
  IconShareOff,
  IconTrash
} from "@tabler/icons-react";

export interface LinkedNodeListProps {
  graphData: ReturnType<typeof useGraphData>;
  selectedNode: MapNode | null;
  selectNode: (node: MapNode | null) => void;
  linkedNodes: MapNode[];
}

export default function LinkedNodeList({ graphData, selectedNode, selectNode, linkedNodes }: LinkedNodeListProps) {
  const {
    renameNode,
    deleteNode,
    unlinkNodes,
    createLinkedNode
  } = graphData;

  if (!selectedNode) return;
  if (!linkedNodes) return;

  return (
    <div className="section">
      <h2 className="section-title">Linked nodes</h2>
        <ul className="flex flex-col gap-2">
          {
            linkedNodes.map(node => {
              if (!node) return;
              return (
                <li key={node.id} className="flex gap-2">
                  <Button
                    className="icon-btn"
                    label={<IconCircle size={16} />}
                    hoverText="Select this node"
                    onClick={() => selectNode(node)}
                  />
                  <Editable
                    className="cell"
                    id={node.id}
                    value={node.label}
                    placeholder="Name"
                    onChange={v => renameNode(node, v)}
                  />
                  <Button
                    className="icon-btn"
                    hoverText="Disconnect this node"
                    label={<IconShareOff size={16} />}
                    onClick={() => unlinkNodes(selectedNode, node)}
                  />
                  <Button
                    className="icon-btn"
                    hoverText="Delete this node"
                    label={<IconTrash size={16} />}
                    onClick={() => deleteNode(node)}
                  />
                </li>
              );
            })
          }
          <Button
            label="Create a linked node"
            icon={<IconPlus size={16} />}
            onClick={() => createLinkedNode(selectedNode)}
          />
        </ul>
    </div>
  );
}

