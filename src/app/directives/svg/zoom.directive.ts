import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
import * as d3 from 'd3';

@Directive({
  selector: '[appSvgZoom]',
  standalone: true
})
export class SvgZoomDirective implements OnInit {
  // Можна налаштовувати межі масштабування через Input
  @Input() minZoom = 0.5;
  @Input() maxZoom = 5;

  constructor(private el: ElementRef<SVGSVGElement>) {}

  ngOnInit() {
    const svg = d3.select(this.el.nativeElement);
    
    // Шукаємо групу <g>, яку будемо рухати. 
    // Якщо її немає, зум працюватиме некоректно (координати будуть "стрибати").
    const container = svg.select('#a-zoom-container');
    if (container.empty()) {
      console.log('SvgZoomDirective: В середині <svg> не знайдено елемента <g>.');
      return;
    }

    const zoomBehavior = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([this.minZoom, this.maxZoom])
      .on('zoom', (event) => {
        container.attr('transform', event.transform);
      });

    svg.call(zoomBehavior);
  }
}