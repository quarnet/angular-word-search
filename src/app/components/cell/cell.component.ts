import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { Cell } from 'src/app/app-state/app.models';
import { AppState } from 'src/app/app-state/app.store';

@Component({
  selector: 'app-cell',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.sass'],
})
export class CellComponent implements OnInit, OnDestroy {
  @Input() cell?: Cell;

  constructor() {}
  @Select(AppState.getActiveCell) activeCell$: Observable<Cell> | undefined;
  activeCellSubscription: Subscription | undefined;

  @Select(AppState.isNeighboutHighlight) highlightNeighbours$:
    | Observable<boolean>
    | undefined;
  highlightNeighboursSubscription: Subscription | undefined;

  @Output()
  onCellClick = new EventEmitter();

  isNeighbour = false;
  isActive = false;
  isResultCell = false;
  highlightNeighbours = false;
  activeCell: Cell | undefined;

  onclick = () => {
    this.onCellClick.emit(this.cell);
  };

  setNeighbourHighlight = (cellActive: Cell | undefined) => {
    this.isNeighbour =
      this.highlightNeighbours &&
      !!cellActive?.neighbours.find((item) => {
        return (
          item.cell.col === this.cell?.col && item.cell.row === this.cell?.row
        );
      });
  };

  ngOnInit(): void {
    this.activeCellSubscription = this.activeCell$?.subscribe((cell1) => {
      this.activeCell = cell1;
      if (!cell1) {
        this.isActive = false;
        this.isNeighbour = false;
        this.highlightNeighbours = false;
        return;
      }
      this.isActive =
        cell1.col === this.cell?.col && cell1.row === this.cell?.row;
      this.setNeighbourHighlight(cell1);
    });

    this.highlightNeighboursSubscription = this.highlightNeighbours$?.subscribe(
      (data) => {
        this.highlightNeighbours = data;

        this.setNeighbourHighlight(this.activeCell);
      }
    );
  }

  ngOnDestroy() {
    this.activeCellSubscription?.unsubscribe();
    this.highlightNeighboursSubscription?.unsubscribe();
  }
}
