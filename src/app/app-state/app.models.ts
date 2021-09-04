export interface Cell {
  value: string;
  row: number;
  col: number;
  neighbours: Neighbour[];
  color: string;
}

export interface Neighbour {
  cell: Cell;
  directions: Directions;
}

export enum Directions {
  left = 'left',
  right = 'right',
  top = 'top',
  bottom = 'bottom',
  topLeft = 'topLeft',
  topRight = 'topRight',
  bottomLeft = 'bottomLeft',
  bottomRight = 'bottomRight',
}
