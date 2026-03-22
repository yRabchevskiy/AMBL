import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IUnion } from '../../../models/structure.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'g[app-svg-union]',
  imports: [CommonModule],
  templateUrl: './svg-union.html',
  styleUrl: './svg-union.scss',
  standalone: true, // Додайте це явно
})
export class SvgUnionComponent {
  @Input() union!: IUnion; // Вхідні дані для підрозділу
  @Input() selected: boolean = false;
  @Output() onSelect = new EventEmitter<any>();

  onItemClick() {
    this.onSelect.emit(this.union);
  }
}
