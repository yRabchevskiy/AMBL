import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-list',
  imports: [CommonModule],
  templateUrl: './list.html',
  styleUrl: './list.scss',
})
export class ListComponent {
  @Input() items: any[] = [];
  @Input() selectedItemId: string = '';
  @Output() itemClick = new EventEmitter<any>();
  @Output() onAdd = new EventEmitter<any>();

  onItemClick(item: any) {
    this.itemClick.emit(item);
  }

  addItem() {
    this.onAdd.emit();
  }
}
