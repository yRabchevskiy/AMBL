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
  @Input() selectedItem: any;
  @Output() itemClick = new EventEmitter<any>();
  @Output() onAdd = new EventEmitter<any>();

  onItemClick(item: any) {
    if (this.selectedItem && this.selectedItem._id === item._id) { return }
    this.itemClick.emit(item);
  }

  addItem() {
    this.onAdd.emit();
  }
}
