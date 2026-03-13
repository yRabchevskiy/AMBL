import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { SvgZoomDirective } from '../../directives/svg/zoom.directive';
import { selectStructureLoading, selectStructureName, selectStructureTree } from '../../state/selectors/structure.selectors';
import * as StructureActions from '../../state/actions/structure.actions';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, SvgZoomDirective],
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class HomeComponent {
  private store = inject(Store);

  // Отримуємо назву структури (напр. "Головний офіс")
  structureName$ = this.store.select(selectStructureName);

  // Отримуємо ієрархічне дерево
  structureTree$ = this.store.select(selectStructureTree);

  isLoading$ = this.store.select(selectStructureLoading);

  ngOnInit() {
    // Припустимо, ID ми беремо з параметрів роута або конфігу
    const id = 'some-structure-id';
    this.store.dispatch(StructureActions.loadStructure({ structureId: id }));
  }


  createNewStructure() {
    const name = prompt('Введіть назву нової структури:');
    if (name) {
      this.store.dispatch(StructureActions.createStructure({ name }));
    }
  }


}
