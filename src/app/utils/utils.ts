import { Cell, Directions, Neighbour } from '../app-state/app.models';

export const convertArrayToCells = (rawData: string[]) => {
  const cellsArray = new Array<Array<Cell>>(rawData.length);

  for (let i = 0; i < rawData.length; i++) {
    const rowCells = new Array<Cell>(rawData[i].length);
    for (let j = 0; j < rawData[0].length; j++) {
      rowCells[j] = {
        row: i,
        col: j,
        value: rawData[i].charAt(j).toLowerCase(),
        neighbours: [],
        color: '',
      };
    }
    cellsArray[i] = rowCells;
  }

  // Link neighbours for all cells.
  for (let i = 0; i < cellsArray.length; i++) {
    for (let j = 0; j < cellsArray[i].length; j++) {
      [i - 1, i, i + 1].forEach((nRow) => {
        [j + -1, j, j + 1].forEach((nCol) => {
          if (
            nRow < 0 ||
            nCol < 0 ||
            nRow >= cellsArray.length ||
            nCol >= cellsArray[i].length
          )
            return; // outside of the grid.
          if (nRow === i && nCol === j) return; // cell itself.

          const cellNeighbour: Neighbour = {
            cell: cellsArray[nRow][nCol],
            directions: getRelativeDirection(i, j, nRow, nCol),
          };
          cellsArray[i][j].neighbours.push(cellNeighbour);
        });
      });
    }
  }

  return cellsArray;
};

const getRelativeDirection = (
  sourceRow: number,
  sourceCol: number,
  targetRow: number,
  targetCol: number
): Directions => {
  if (targetRow < sourceRow && targetCol < sourceCol) {
    return Directions.topLeft;
  } else if (targetRow < sourceRow && targetCol === sourceCol) {
    return Directions.top;
  } else if (targetRow < sourceRow && targetCol > sourceCol) {
    return Directions.topRight;
  } else if (targetRow === sourceRow && targetCol < sourceCol) {
    return Directions.left;
  } else if (targetRow === sourceRow && targetCol > sourceCol) {
    return Directions.right;
  } else if (targetRow > sourceRow && targetCol < sourceCol) {
    return Directions.bottomLeft;
  } else if (targetRow > sourceRow && targetCol === sourceCol) {
    return Directions.bottom;
  } else if (targetRow > sourceRow && targetCol > sourceCol) {
    return Directions.bottomRight;
  } else {
    console.error('this should never occure.....');
    return Directions.left;
  }
};

export const searchWord = (keyword: string, cells: Cell[][]): Cell[] => {
  if (!keyword) {
    return [];
  }

  const resultCells: Cell[] = [];
  let foundDirection = null;
  for (let i = 0; i < cells.length; i++) {
    for (let j = 0; j < cells[i].length; j++) {
      const cell = cells[i][j];
      if (isPotentialCell(cell, keyword)) {
        foundDirection = beginNeighbourSearch(cell, keyword.slice(1));
        if (foundDirection) {
          resultCells.push(cell);
          let neighbourResult = cell;
          for (let p = 0; p < keyword.length - 1; p++) {
            neighbourResult = getNeighbour(
              neighbourResult,
              foundDirection
            ) as Cell;
            resultCells.push(neighbourResult);
          }
          break;
        }
      }
    }
    if (foundDirection) break;
  }

  return resultCells;
};

const isPotentialCell = (cell: Cell, word: string) => cell.value === word[0];

const beginNeighbourSearch = (cell: Cell, word: string): Directions | null => {
  const neighbours = cell.neighbours;
  let foundInDirection: Directions | null = null;
  for (let i = 0; i < neighbours.length; i++) {
    if (searchDirection(neighbours[i].cell, word, neighbours[i].directions)) {
      foundInDirection = neighbours[i].directions;
      break;
    }
  }

  return foundInDirection;
};

const searchDirection = (
  cell: Cell,
  word: string,
  direction: Directions
): boolean => {
  if (cell.value === word[0]) {
    if (word.length === 1) return true; // Last word found.
    const nextCell = getNeighbour(cell, direction);
    return nextCell
      ? searchDirection(nextCell, word.slice(1), direction)
      : false;
  }
  return false;
};

const getNeighbour = (cell: Cell, direction: Directions) =>
  cell.neighbours.find((item) => item.directions === direction)?.cell;
