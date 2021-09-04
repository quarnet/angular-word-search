import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { convertArrayToCells } from '../utils/utils';
import {
  activateCell,
  clearResult,
  InitGrid,
  setResult,
  toggleNeighbourHeighlight,
} from './app.actions';
import { Cell } from './app.models';

export class AppStateModel {
  grid: Cell[][] = [];
  activeCell: Cell | null = null;
  heighlightNeighbours: boolean = false;
}

@State<AppStateModel>({
  name: 'appstore',
  defaults: {
    grid: [],
    activeCell: null,
    heighlightNeighbours: false,
  },
})
@Injectable()
export class AppState {
  @Selector()
  static getGrid(state: AppStateModel) {
    return state.grid;
  }

  @Selector()
  static getActiveCell(state: AppStateModel) {
    return state.activeCell;
  }

  @Selector()
  static isNeighboutHighlight(state: AppStateModel) {
    return state.heighlightNeighbours;
  }

  @Action(InitGrid)
  initGrid({ setState }: StateContext<AppStateModel>, { payload }: InitGrid) {
    const grid = convertArrayToCells(payload);
    setState({
      grid: grid,
      activeCell: null,
      heighlightNeighbours: false,
    });
  }

  @Action(activateCell)
  activateCell(
    { patchState }: StateContext<AppStateModel>,
    { payload }: activateCell
  ) {
    patchState({
      activeCell: { ...payload },
    });
  }

  @Action(setResult)
  setResult(
    { getState, patchState }: StateContext<AppStateModel>,
    { payload, color }: setResult
  ) {
    const cells = getState().grid;
    for (let i = 0; i < cells.length; i++) {
      for (let j = 0; j < cells[i].length; j++) {
        const isResultCell = !!payload.find(
          (item) => item.col === cells[i][j].col && item.row === cells[i][j].row
        );
        if (isResultCell) {
          cells[i][j].color = color;
        }
      }
    }
    patchState({
      grid: cells,
    });
  }

  @Action(clearResult)
  clearResult({ getState, patchState }: StateContext<AppStateModel>) {
    const cells = getState().grid;
    for (let i = 0; i < cells.length; i++) {
      for (let j = 0; j < cells[i].length; j++) {
        cells[i][j].color = '';
      }
    }
    patchState({
      grid: cells,
      activeCell: null,
      heighlightNeighbours: false,
    });
  }

  @Action(toggleNeighbourHeighlight)
  heighlightneighbours({ getState, patchState }: StateContext<AppStateModel>) {
    patchState({
      heighlightNeighbours: !getState().heighlightNeighbours,
    });
  }
}
