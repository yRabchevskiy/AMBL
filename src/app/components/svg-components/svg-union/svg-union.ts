import { Component, Input } from '@angular/core';
import { IUnion } from '../../../models/structure.model';

@Component({
  selector: 'app-svg-union',
  imports: [],
  templateUrl: './svg-union.html',
  styleUrl: './svg-union.scss',
})
export class SvgUnionComponent {
  @Input() union!: IUnion; // Вхідні дані для підрозділу
}
