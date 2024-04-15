import { UUID } from "crypto";

export interface MapNode {
  id: UUID;
  label: string;
  group?: UUID;
}
export interface MapLink {
  source: UUID | MapNode;
  target: UUID | MapNode;
}
export interface MapGroup {
  id: UUID;
  label: string;
  color: string;
}

export interface MapData {
  nodes: MapNode[];
  links: MapLink[];
  groups: MapGroup[];
}
