import { Component, DestroyRef, inject, Input } from '@angular/core';
import { SvgZoomDirective } from '../../../directives/svg/zoom.directive';
import { ICreateUnion, IFullStructureResponse, IUnion } from '../../../models/structure.model';
import { SvgUnionComponent } from '../svg-union/svg-union';
import * as StructureActions from '../../../state/actions/structure.actions';
import { ADialogComponent } from '../../a-dialog/a-dialog';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LayoutType, TreeHelper } from '../tree.helper';

@Component({
  selector: 'app-svg-pallet',
  imports: [SvgZoomDirective, SvgUnionComponent, ADialogComponent, ReactiveFormsModule],
  templateUrl: './svg-pallet.html',
  styleUrl: './svg-pallet.scss',
})
export class SvgPalletComponent {
  private store = inject(Store);
  private fb = inject(FormBuilder);
  private actions$ = inject(Actions);
  private destroyRef = inject(DestroyRef);
  currentLayout: LayoutType = LayoutType.hybrid;

  private _dataItem!: IFullStructureResponse;

  get dataItem() { return this._dataItem; }
  @Input() set dataItem(v: IFullStructureResponse) {

    this.updateUnionsMap(v.unions);
    v.unions = this.applyLayout(v.unions, this.currentLayout);
    this._dataItem = v;
    
    console.log(this._dataItem)
  } // Вхідні дані для дерева

  selectedUnion: IUnion | null = null;
  dialogVisible: boolean = false;

  unionForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(1)]],
  });

  unionsMap = new Map<string, IUnion>();

  // Та сама функція для шаблону
  getParent(parentId: string): IUnion | undefined {
    return this.unionsMap.get(parentId);
  }

  constructor() {
    this.actions$.pipe(
      ofType(StructureActions.createUnionSuccess),
      takeUntilDestroyed(this.destroyRef) // Автоматична відписка при знищенні компонента
    ).subscribe(() => {
      this.onCloseDialog(); // Метод для закриття форми/модалки
      this.unionForm.reset(); // Очищення форми
    });
  }

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

  onSelectUnion(u: IUnion) {
    if (this.selectedUnion?._id === u._id) {
      this.selectedUnion = null;
      return;
    }
    this.selectedUnion = u;
  }

  onCloseDialog() {
    this.dialogVisible = false;
    this.unionForm.reset();
  }

  // Викликайте це щоразу, коли отримуєте нові дані з сервера/store
  updateUnionsMap(unions: IUnion[]) {
    this.unionsMap.clear();
    unions.forEach(u => this.unionsMap.set(u._id, u));
  }



  applyLayout(data: IUnion[], type: LayoutType) {
    this.currentLayout = type;
    const tree = TreeHelper.buildTree(data); // твоя функція побудови дерева

    if (type === LayoutType.horizontal) TreeHelper.layoutHorizontal(tree);
    if (type === LayoutType.vertical) TreeHelper.layoutVertical(tree);
    if (type === LayoutType.hybrid) TreeHelper.layoutHybrid(tree);

    return tree;
  }


}
