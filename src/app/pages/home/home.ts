import { Component, DestroyRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { selectAllAvailableStructures, selectSelectedStructure, selectStructureLoading, selectStructureTree } from '../../state/selectors/structure.selectors';
import * as StructureActions from '../../state/actions/structure.actions';
import { ListComponent } from '../../components/list/list';
import { LoadingComponent } from '../../components/loading/loading';
import { IFullStructureResponse } from '../../models/structure.model';
import { Actions, ofType } from '@ngrx/effects';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SvgPalletComponent } from '../../components/svg-components/svg-pallet/svg-pallet';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, SvgPalletComponent, ListComponent, LoadingComponent, ReactiveFormsModule],
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class HomeComponent {
  private fb = inject(FormBuilder);
  private store = inject(Store);
  private actions$ = inject(Actions);
  private destroyRef = inject(DestroyRef); // Для відписки

  data$ = this.store.select(selectAllAvailableStructures);
  // Отримуємо назву структури (напр. "Головний офіс")
  selectedStructure$ = this.store.select(selectSelectedStructure);

  // Отримуємо ієрархічне дерево
  structureTree$ = this.store.select(selectStructureTree);

  isLoading$ = this.store.select(selectStructureLoading) || true;

  showDialog = false;

  newStructureForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]]
  });

  constructor() {
    // Підписуємося на екшен успіху
    this.actions$.pipe(
      ofType(StructureActions.createStructureSuccess),
      takeUntilDestroyed(this.destroyRef) // Автоматична відписка при знищенні компонента
    ).subscribe(() => {
      this.closeModal(); // Метод для закриття форми/модалки
      this.newStructureForm.reset(); // Очищення форми
    });
  }
  ngOnInit() {
    // Припустимо, ID ми беремо з параметрів роута або конфігу
    this.store.dispatch(StructureActions.loadAllStructures());
    // this.store.dispatch(StructureActions.loadStructure({ structureId: id }));
  }


  createNewStructure() {
    this.showDialog = true;
  }

  createStructure() {
    if (this.newStructureForm.valid) {
      const name = this.newStructureForm.value.name;
      this.store.dispatch(StructureActions.createStructure({ name }));
    }
  }

  closeModal() {
    // Ваша логіка закриття (наприклад, зміна флажка або виклик сервісу модалок)
    this.showDialog = false;
  }

  onSelectStructure(structure: IFullStructureResponse) {
    this.store.dispatch(StructureActions.selectAndLoadStructure({ structure: structure }));
  }


}
