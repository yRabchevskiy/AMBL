import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { SvgZoomDirective } from '../../directives/svg/zoom.directive';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, SvgZoomDirective],
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class HomeComponent  {
  private store = inject(Store);
  // Об'єкт для форми (згідно зі схемою Mongoose)
 

  data$: Observable<any[]> = this.store.select(state => state.user.users);

  constructor() { }


  
}
