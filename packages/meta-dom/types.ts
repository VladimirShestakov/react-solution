export type MetaDomConfig = object;

export type VirtualElementProps = Record<string, string | undefined>;

export type VirtualElementVariant = {
  props: VirtualElementProps;
  priority: number;
};

export type VirtualElementPlain = {
  type: string;
  props: VirtualElementProps;
  priority?: number;
  key?: string;
  owner?: string;
};

export type VirtualElementString = {
  name: string;
  attributes: string[];
  full: string;
  open: string;
  close: string;
  textContent: string;
  selfClose: boolean;
};
