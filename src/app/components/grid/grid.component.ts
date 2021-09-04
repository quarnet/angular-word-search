import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Cell } from 'src/app/app-state/app.models';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.sass'],
})
export class GridComponent implements OnInit {
  constructor() {}

  @Input() gridCells: Cell[][] | undefined;
  @Input() totalRows: number = 0;
  @Input() totalCols: number = 0;
  @Output()
  onCellClick = new EventEmitter<Cell>();

  onClick = (cell: Cell) => {
    this.onCellClick.emit(cell);
  };

  ngOnInit(): void {}
}
