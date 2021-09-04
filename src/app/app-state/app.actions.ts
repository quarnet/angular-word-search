import { Cell } from './app.models';

export class InitGrid {
  static readonly type = '[App grid] init';

  /**
   *
   */
  constructor(public payload: string[]) {}
}

export class activateCell {
  static readonly type = '[App grid] activate cell';
  /**
   *
   */
  constructor(public payload: Cell) {}
}

export class setResult {
  static readonly type = '[App grid] set result';

  /**
   *
   */
  constructor(public payload: Cell[], public color: string) {}
}

export class clearResult {
  static readonly type = '[App grid] clear result';
  constructor() {}
}

export class toggleNeighbourHeighlight {
  static readonly type = '[App grid] neighbour toggle';
  /**
   *
   */
  constructor() {}
}
