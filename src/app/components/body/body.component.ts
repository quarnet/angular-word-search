import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import {
  activateCell,
  clearResult,
  InitGrid,
  setResult,
  toggleNeighbourHeighlight,
} from 'src/app/app-state/app.actions';
import { Cell } from 'src/app/app-state/app.models';
import { AppState, AppStateModel } from 'src/app/app-state/app.store';
import { NotificationService } from 'src/app/notification.service';
import { searchWord } from 'src/app/utils/utils';

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.sass'],
})
export class BodyComponent implements OnInit, OnDestroy {
  constructor(
    private store: Store,
    private notificationService: NotificationService
  ) {}

  searchKeyword: string = '';

  @Select(AppState.getGrid) grid$: Observable<Cell[][]> | undefined;
  gridSubcription: Subscription | undefined;

  gridCells: Cell[][] = [];
  totalRows: number = 0;
  totalCols: number = 0;

  @Select(AppState.isNeighboutHighlight) highlightNeighbours$:
    | Observable<boolean>
    | undefined;
  highlightNeighboursSubscription: Subscription | undefined;
  highlightNeighbours = false;

  ngOnInit(): void {
    const rawData = [
      'QQEDEQINTERNETEXPLORERED',
      'WSWODNIWCDKDDRAOBREHTOMR',
      'FUSSFBKTOVPINSTAGRAMATBA',
      'LZENSVNIZDZNROUTEREWANNO',
      'CWEMCEMJNUWNAAPTYTROMYXB',
      'DHISIIRKMDILNDNPSCICMUDY',
      'FJIKZRKDCOLUSITYBYVINLOE',
      'GLAPBCAQDHTERASREBUIXEIK',
      'VFAOVAOFKAOPBGOCZELBLOGK',
      'LOHSPOCDAZPLNWTIRRHCESOF',
      'IUAGHFADESEISSNXGBILAVRB',
      'ASROTDCXUTTEEIOAXUREVRES',
      'MSDYGHRWIARRAZYWILITUEKN',
      'ECWCPGOIRNENEFSNRLHKPBOI',
      'UAAYXVVEVTUEGHOBWYOWPUOS',
      'MNRRUAPINEOHARDDRIVEPTBO',
      'ENEACOBITSMARTPHONEZDUEF',
      'DEBNPYPMMARJYBFIOSYCFOCT',
      'ORVIGOOGLECHROMEUOZWBYAW',
      'MCMBKLRTMOZILLAFIREFOXFA',
      'NXKROWTENTOETISBEWICDRSR',
      'ESUOMOFGSLLAWERIFLMAYFUE',
      'CRZOWDDNOTZOEAPPLICATION',
      'RAIDEMLAICOSGROSSECORPXJ',
    ];
    this.store.dispatch(new InitGrid(rawData));

    this.gridSubcription = this.grid$?.subscribe((data) => {
      this.totalRows = data.length;
      this.totalCols = data[0].length;
      this.gridCells = data;
    });

    this.highlightNeighboursSubscription = this.highlightNeighbours$?.subscribe(
      (data) => {
        this.highlightNeighbours = data;
      }
    );
  }

  onCellClick = (cell: Cell) => {
    this.store.dispatch(new activateCell(cell));
  };

  onSearchClick = () => {
    const foundInCells = searchWord(
      this.searchKeyword.toLowerCase(),
      this.gridCells
    );
    if (foundInCells && foundInCells.length) {
      this.store.dispatch(
        new setResult(foundInCells as Cell[], 'rgb(9 255 13)')
      );
    } else {
      this.notificationService.addMessage(
        `Keyword not found "${this.searchKeyword.toUpperCase()}"`
      );
      this.searchKeyword = '';
    }
  };

  onKeydown = (ev: any) => {
    if (ev.key === 'Enter') {
      this.onSearchClick();
    }
  };

  onClearClick = () => {
    this.searchKeyword = '';
    this.notificationService.clear();
    this.store.dispatch(new clearResult());
  };

  heighlightNeighbourChange = () => {
    this.store.dispatch(new toggleNeighbourHeighlight());
  };

  ngOnDestroy() {
    this.gridSubcription?.unsubscribe();
    this.highlightNeighboursSubscription?.unsubscribe();
  }
}
