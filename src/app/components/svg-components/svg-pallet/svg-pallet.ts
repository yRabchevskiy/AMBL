import { Component, inject, Input } from '@angular/core';
import { SvgZoomDirective } from '../../../directives/svg/zoom.directive';
import { ICreateUnion, IFullStructureResponse, IUnion } from '../../../models/structure.model';
import { SvgUnionComponent } from '../svg-union/svg-union';
import * as StructureActions from '../../../state/actions/structure.actions';
import { ADialogComponent } from '../../a-dialog/a-dialog';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-svg-pallet',
  imports: [SvgZoomDirective, SvgUnionComponent, ADialogComponent, ReactiveFormsModule],
  templateUrl: './svg-pallet.html',
  styleUrl: './svg-pallet.scss',
})
export class SvgPalletComponent {
  private store = inject(Store);
  private fb = inject(FormBuilder);
  @Input() dataItem!: IFullStructureResponse; // Вхідні дані для дерева
  dialogVisible: boolean = false;

  unionForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(1)]],
  });

  createUnion() {
    this.dialogVisible = true;
  }

  onSaveUnion() {
    if (this.unionForm.valid) {
      const _form: ICreateUnion = {
        name: this.unionForm.value.name,
        parentId: null,
        structureId: this.dataItem._id,
        positions: []
      };
      this.store.dispatch(StructureActions.createUnion({ union: _form }));
    }
  }

  onCloseDialog() {
    this.dialogVisible = false;
    this.unionForm.reset();
  }
}
