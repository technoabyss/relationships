"use client";
import { MutableRefObject, useCallback, useEffect, useRef, useState } from "react";
import Graph from "@/components/Graph";
import { ForceGraphMethods } from "react-force-graph-3d";
import SpriteText from "three-spritetext";
import { MapData, MapNode } from "@/@types/Map";
import {
  getGroupById,
  getLinkedNodesById,
  getNodeBGColor,
  getNodeFGColor
} from "@/utils/graph";
import useGraphData from "@/hooks/useGraphData";
import { InteractionState as IState } from "@/@types/UI";
import { useWindowSize } from "react-use";
import LinkedNodeList from "@/components/Sidebar/LinkedNodeList";
import Menu from "@/components/Sidebar/Menu";
import SelectedNode from "@/components/Sidebar/SelectedNode";
import Groups from "@/components/Sidebar/Groups";
import GraphStatus from "@/components/GraphStatus";

const starterData: MapData = {
  nodes: [
    {
      id: "2c1c4ff5-1b21-4b83-a54c-85d01c61a873",
      label: "Alice",
      group: "2c1ceff5-1b21-4b83-a54c-85d01c61a870"
    },
    {
      id: "2c1c4ff5-1b21-4b83-a54c-85d01c61a872",
      label: "Bob",
      group: "2c1cegg5-1b21-4b83-a54c-85d01c61a870"
    },
    {
      id: "2c1c4ff5-1b21-4b83-a54c-85d01c61a871",
      label: "Craig",
      group: "2c1cegg5-1b21-4b83-a54c-85d01c61a870"
    },
    {
      id: "2c1c4ff5-1b21-4b83-a54c-85d01c61a870",
      label: "Doban",
      group: "2c1ceff5-1b21-4b83-a54c-85d01c61a870"
    }
  ],
  links: [
    {
      source: "2c1c4ff5-1b21-4b83-a54c-85d01c61a873",
      target: "2c1c4ff5-1b21-4b83-a54c-85d01c61a872"
    },
    {
      source: "2c1c4ff5-1b21-4b83-a54c-85d01c61a873",
      target: "2c1c4ff5-1b21-4b83-a54c-85d01c61a871"
    },
    {
      source: "2c1c4ff5-1b21-4b83-a54c-85d01c61a873",
      target: "2c1c4ff5-1b21-4b83-a54c-85d01c61a870"
    },
    {
      source: "2c1c4ff5-1b21-4b83-a54c-85d01c61a872",
      target: "2c1c4ff5-1b21-4b83-a54c-85d01c61a870"
    }
  ],
  groups: [
    {
      id: "2c1ceff5-1b21-4b83-a54c-85d01c61a870",
      label: "Test A",
      color: "#ff0000"
    },
    {
      id: "2c1cegg5-1b21-4b83-a54c-85d01c61a870",
      label: "Test B",
      color: "#00ff00"
    }
  ]
};

export default function Home() {
  // 3DFG needs a fixed width
  const { width, height } = useWindowSize();
  const GCRef = useRef<HTMLDivElement>(null);
  const FG3DRef = useRef<ForceGraphMethods>(null) as MutableRefObject<ForceGraphMethods>;
  const [GCWidth, setGCWidth] = useState<number | null>(null);
  useEffect(() => {
    if (!GCRef.current) return;
    setGCWidth(GCRef.current.offsetWidth);
  }, [GCRef.current?.offsetWidth]);

  // Allow interaction after rendering it
  useEffect(() => {
    if (!GCWidth) return;
    setInteractionState(IState.SELECTING);
  }, [GCWidth]);

  const graphData = useGraphData(FG3DRef, starterData);
  const {
    data,
    refreshGraph,
    linkNodes
  } = graphData;

  const [interactionState, setInteractionState] = useState(IState.LOADING);
  const [selectedNode, setSelectedNode] = useState<MapNode | null>(null);

  const selectNode = useCallback((node: MapNode | null) => {
    setSelectedNode(node);
    setInteractionState(IState.SELECTING);
    refreshGraph();
  }, [refreshGraph]);

  const [linkedNodes, setLinkedNodes] = useState<MapNode[]>([]);
  useEffect(() => {
    if (selectedNode) {
      setLinkedNodes(getLinkedNodesById(data, selectedNode.id));
    } else {
      setLinkedNodes([]);
    }
  }, [data, selectedNode]);

  return (
    <div className="
      min-h-screen
      flex flex-row
      bg-slate-800
    ">
      <div className="sidebar">
        <Menu
          graphData={graphData}
        />
        <SelectedNode
          graphData={graphData}
          selectedNode={selectedNode}
          selectNode={selectNode}
          interactionState={interactionState}
          setInteractionState={setInteractionState}
        />
        <LinkedNodeList
          graphData={graphData}
          selectedNode={selectedNode}
          selectNode={selectNode}
          linkedNodes={linkedNodes}
        />
        <Groups
          graphData={graphData}
          selectedNode={selectedNode}
        />
      </div>
      <div
        ref={GCRef}
        className="graph-container"
      >
        <GraphStatus state={interactionState} />
        {
          GCWidth &&
          <Graph
            forwardedRef={FG3DRef}
            graphData={data}
            width={GCWidth}
            linkColor="#fff"
            backgroundColor="#1e293b"
            nodeLabel={n => getGroupById(data, n.group)?.label ?? "No group"}
            nodeThreeObject={node => {
              const sprite = new SpriteText();
              sprite.text = node.label;
              sprite.backgroundColor = getNodeBGColor(data, node as MapNode);
              sprite.borderWidth = 0.25;
              sprite.borderColor = node.id === selectedNode?.id ? "#fff" : "transparent";
              sprite.color = getNodeFGColor(data, node as MapNode);
              sprite.fontSize = 64;
              sprite.textHeight = 1;
              sprite.padding = 2;
              sprite.borderRadius = 2;
              return sprite;
            }}
            onNodeClick={node => {
              switch (interactionState) {
                case IState.SELECTING: return selectNode(node as MapNode);
                case IState.LINKING:
                  if (selectedNode) linkNodes(selectedNode, node as MapNode);
                  break;
              }
              refreshGraph();
            }}
          />
        }
      </div>
    </div>
  );
}
