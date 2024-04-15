import fontColorContrast from "font-color-contrast";
import { UUID } from "crypto";
import { MapData, MapLink, MapNode } from "@/@types/Map";

export const DEFAULT_NODE_BG = "#0d11177c";

export const getNodeById = (data: MapData, id: UUID) => data.nodes
  .find(e => e.id === id);

  export const getGroupById = (data: MapData, id: UUID) => data.groups
    .find(e => e.id === id);

export const nodeHasLinks = (data: MapData, node: MapNode) => data.links
  .some(link => link.source === node || link.target === node);

export const areNodesLinked = (data: MapData, a: MapNode, b: MapNode) => data.links
  .some(link => (
    link.source === a && link.target === b ||
    link.source === b && link.target === a
  ));

// For some reason FG3D converts link data to
// replace ids with the actual node objects. I couldn't
// find documentation on why or how this works
export const rawifyLinks = (links: MapLink[]) => {
  return links.map(l => {
    if (typeof l.source === "string" && typeof l.target === "string") return l;
    return {
      source: (l.source as MapNode).id,
      target: (l.target as MapNode).id
    };
  });
};

export const getLinkedNodesById = (data: MapData, id: UUID) => data.links
  .filter(l => (l.source as MapNode).id === id)
  .map(l => l.target as MapNode)
  .concat(data.links
    .filter(l => (l.target as MapNode).id === id)
    .map(l => l.source as MapNode)
  );

export const getNodeBGColor = (data: MapData, node: MapNode) => {
  if (!node.group) return DEFAULT_NODE_BG;
  const group = data.groups.find(g => g.id === node.group);
  if (!group) return DEFAULT_NODE_BG;
  return group.color;
};

export const getNodeFGColor = (data: MapData, node: MapNode) =>
  fontColorContrast(getNodeBGColor(data, node));

export const nodeHasGroup = (node: MapNode) => !!node.group;
