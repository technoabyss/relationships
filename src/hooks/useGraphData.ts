import { MutableRefObject, useCallback, useState } from "react";
import { ForceGraphMethods } from "react-force-graph-3d";
import { UUID } from "crypto";
import { v4 as uuid4 } from "uuid";
import randomColor from "randomcolor";
import { MapData, MapGroup, MapNode } from "@/@types/Map";
import {
  areNodesLinked,
  getGroupById,
  getLinkedNodesById,
  getNodeById,
  rawifyLinks
} from "@/utils/graph";

export default function useGraphData(ref: MutableRefObject<ForceGraphMethods>, initialData: MapData) {
  const [data, setData] = useState(initialData);

  const refreshGraph = useCallback(() => ref.current?.refresh(), [ref]);

  const updateData = useCallback((value: MapData) => {
    setData({ ...value, links: rawifyLinks(value.links) });
    refreshGraph();
  }, [refreshGraph]);

  const newUUID = (): UUID => (uuid4() as UUID);

  const newNode = useCallback((group?: UUID): MapNode => ({
    id: newUUID(),
    label: prompt("Enter name") ?? "",
    group
  }), []);

  const newGroup = useCallback((): MapGroup => ({
    id: newUUID(),
    label: prompt("Enter name") ?? "",
    color: randomColor()
  }), []);

  const renameNode = useCallback((node: MapNode, newName: string) => {
    const _node = data.nodes.find(n => n.id === node.id);
    if (!_node) return;
    _node.label = newName;
    updateData(data);
  }, [data, updateData]);

  const createLinkedNode = useCallback((node: MapNode) => {
    const n = newNode(node.group);
    updateData({
      ...data,
      nodes: [...data.nodes, n],
      links: [
        ...data.links,
        { source: node.id, target: n.id }
      ]
    });
  }, [data, updateData, newNode]);

  const linkNodes = useCallback((a: MapNode, b: MapNode) => {
    if (areNodesLinked(data, a, b)) return;
    if (a.id === b.id) return;
    updateData({
      ...data,
      links: [...data.links, { source: a.id, target: b.id }]
    });
  }, [data, updateData]);

  const unlinkNodes = useCallback((a: MapNode, b: MapNode) => {
    if (!areNodesLinked(data, a,b)) return;
    updateData({
      ...data,
      links: data.links.filter(l => !(
        (l.source === a && l.target === b) ||
        (l.source === b && l.target === a)
      ))
    });
  }, [data, updateData]);

  const deleteNode = useCallback((node: MapNode) => {
    updateData({
      ...data,
      nodes: data.nodes.filter(n => n.id !== node.id),
      links: data.links.filter(n =>
        (n.source as MapNode).id !== node.id &&
        (n.target as MapNode).id !== node.id
      )
    });
  }, [data, updateData]);

  const createNewGroup = useCallback(() => {
    updateData({
      ...data,
      groups: [...data.groups, newGroup()]
    });
  }, [data, updateData, newGroup]);

  const deleteGroup = useCallback((group: MapGroup) => {
    updateData({
      ...data,
      nodes: data.nodes.map(n =>
        n.group !== group.id ? n : { ...n, group: undefined }
      ),
      groups: data.groups.filter(g => g.id !== group.id)
    });
  }, [data, updateData]);

  const updateGroupColor = useCallback((group: MapGroup, color: string) => {
    updateData({
      ...data,
      groups: data.groups.map(g =>
        g.id === group.id ? { ...g, color } : g
      )
    });
  }, [data, updateData]);

  // FIXME
  const deleteLinkedNodes = useCallback((node: MapNode) => {
    getLinkedNodesById(data, node.id)
      .map(deleteNode);
  }, [data, deleteNode]);

  const renameGroup = useCallback((group: MapGroup, newName: string) => {
    const _group = getGroupById(data, group.id);
    if (!_group) return;
    _group.label = newName;
    updateData(data);
  }, [data, updateData]);

  const assignGroup = useCallback((node: MapNode, group: MapGroup) => {
    const _node = getNodeById(data, node.id);
    if (!_node) return;
    _node.group = group.id;
    updateData(data);
  }, [data, updateData]);

  const unassignGroup = useCallback((node: MapNode) => {
    const _node = getNodeById(data, node.id);
    if (!_node) return;
    _node.group = undefined;
    updateData(data);
  }, [data, updateData]);

  return {
    initialData,
    data, updateData,
    refreshGraph,
    createLinkedNode,
    createNewGroup,
    newUUID, newNode, newGroup,
    renameNode, renameGroup,
    linkNodes, unlinkNodes,
    deleteNode, deleteGroup,
    deleteLinkedNodes,
    assignGroup, unassignGroup,
    updateGroupColor
  };
};
