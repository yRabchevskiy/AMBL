import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { SvgZoomDirective } from '../../directives/svg/zoom.directive';
import { selectAllAvailableStructures, selectSelectedStructure, selectStructureLoading, selectStructureTree } from '../../state/selectors/structure.selectors';
import * as StructureActions from '../../state/actions/structure.actions';
import { ListComponent } from '../../components/list/list';
import { LoadingComponent } from '../../components/loading/loading';
import { IFullStructureResponse } from '../../models/structure.model';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, SvgZoomDirective, ListComponent, LoadingComponent, ReactiveFormsModule],
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class HomeComponent {
  private fb = inject(FormBuilder);
  private store = inject(Store);

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

  onSelectStructure(structure: IFullStructureResponse) {
    this.store.dispatch(StructureActions.selectAndLoadStructure({ structure: structure }));
  }


}
