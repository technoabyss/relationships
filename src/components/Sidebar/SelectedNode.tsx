import { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";
import { isEmpty } from "lodash";
import type useGraphData from "@/hooks/useGraphData";
import { InteractionState, InteractionState as IState } from "@/@types/UI";
import { MapNode } from "@/@types/Map";
import { getGroupById, nodeHasGroup, nodeHasLinks } from "@/utils/graph";
import Button from "@/components/Inputs/Button";
import Editable from "@/components/Inputs/Editable";
import { IconCircleDotted, IconPolygonOff, IconShare, IconShareOff, IconTrash } from "@tabler/icons-react";

export interface SelectedNodeProps {
  graphData: ReturnType<typeof useGraphData>
  selectedNode: MapNode | null;
  selectNode: (node: MapNode | null) => void;
  interactionState: InteractionState
  setInteractionState: Dispatch<SetStateAction<IState>>;
}

export default function SelectedNode({ graphData, selectedNode, selectNode, interactionState, setInteractionState }: SelectedNodeProps) {
  const {
    data, updateData,
    newNode, renameNode,
    deleteNode,
    unassignGroup,
    deleteLinkedNodes
  } = graphData;

  const [hasNodes, setHasNodes] = useState<boolean>(false);
  useEffect(() => {
    setHasNodes(isEmpty(data.nodes));
  }, [data.nodes, setHasNodes]);

  const firstNode = useCallback(() => {
    const n = newNode();
    updateData({ ...data, nodes: [n] });
    selectNode(n);
  }, [data, newNode, selectNode, updateData]);

  return (
    <div className="section">
      {
        !selectedNode && !hasNodes &&
        <h2 className="section-title">Click on a node.</h2>
      }
      {
        hasNodes &&
        <Button
          label="Create first node"
          icon={<IconCircleDotted size={16} />}
          onClick={firstNode}
        />
      }
      {
        selectedNode &&
        <>
          <h2 className="section-title">Selected node</h2>
          <div
            className="
              flex flex-col
              px-2 py-1 rounded-sm
              border border-gray-700
            "
          >
            <div className="font-mono text-[10px] select-all">{selectedNode.id}</div>
            {
              !hasNodes &&
              <div key={selectedNode.group} className="font-mono text-[10px] select-all">
                {
                  selectedNode.group
                  ? getGroupById(data, selectedNode.group)?.label
                  : "No group"
                }
              </div>
            }
            <Editable
              key={selectedNode.id}
              id={selectedNode.id}
              value={selectedNode.label}
              placeholder="Name"
              onChange={v => renameNode(selectedNode, v)}
            />
          </div>
          {
            interactionState === IState.LINKING
            ?
              <Button
                label="Stop linking"
                icon={<IconShareOff size={16} />}
                onClick={() => setInteractionState(IState.SELECTING)}
              />
            :
              <Button
                label="Link to another node"
                icon={<IconShare size={16} />}
                onClick={() => setInteractionState(IState.LINKING)}
              />
          }
          <Button
            label="Delete"
            icon={<IconTrash size={16} />}
            onClick={() => {
              selectNode(null);
              deleteNode(selectedNode);
            }}
          />
          {
            nodeHasGroup(selectedNode) &&
            <Button
              label="Ungroup"
              icon={<IconPolygonOff size={16} />}
              onClick={() => unassignGroup(selectedNode)}
            />
          }
          {
            nodeHasLinks(data, selectedNode) &&
            <Button
              label="Delete linked nodes"
              icon={<IconPolygonOff size={16} />}
              onClick={() => deleteLinkedNodes(selectedNode)}
            />
          }
        </>
      }
    </div>
  );
}
