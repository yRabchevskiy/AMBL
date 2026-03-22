import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
@Component({
  selector: 'app-dialog',
  imports: [DialogModule],
  templateUrl: './a-dialog.html',
  styleUrl: './a-dialog.scss',
})
export class ADialogComponent {
  @Input() visible: boolean = false;
  @Input() label: string = '';
  @Output() onClose = new EventEmitter<void>();
  @Output() onSave = new EventEmitter<void>();

  closeDialog() {
    this.onClose.emit();
  }

  saveData() {
    this.onSave.emit();
  }
}
