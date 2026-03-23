import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
import * as d3 from 'd3';

@Directive({
  selector: '[appSvgZoom]',
  standalone: true,
  exportAs: 'appSvgZoom'
})
export class SvgZoomDirective implements OnInit {
  @Input() minZoom = 0.1;
  @Input() maxZoom = 10;

  private svg!: d3.Selection<SVGSVGElement, unknown, null, undefined>;
  private container!: d3.Selection<SVGGElement, unknown, null, undefined>;
  private zoomBehavior!: d3.ZoomBehavior<SVGSVGElement, unknown>;

  constructor(private el: ElementRef<SVGSVGElement>) {}

  ngOnInit() {
    this.svg = d3.select(this.el.nativeElement);
    this.container = this.svg.select<SVGGElement>('#a-zoom-container');

    this.zoomBehavior = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([this.minZoom, this.maxZoom])
      .on('zoom', (event) => {
        this.container.attr('transform', event.transform);
      });

    this.svg.call(this.zoomBehavior);
  }

  zoomIn() {
    this.svg.transition().duration(300).call(this.zoomBehavior.scaleBy, 1.1);
  }

  zoomOut() {
    this.svg.transition().duration(300).call(this.zoomBehavior.scaleBy, 0.9);
  }

  resetZoom() {
    this.svg.transition().duration(750).call(this.zoomBehavior.transform, d3.zoomIdentity);
  }

  fitToScreen() {
    const svgNode = this.el.nativeElement;
    const { width: svgWidth, height: svgHeight } = svgNode.getBoundingClientRect();
    const gBox = (this.container.node() as SVGGElement).getBBox();

    if (gBox.width === 0 || gBox.height === 0) return;

    const padding = 50;
    const scale = Math.min(
      (svgWidth - padding) / gBox.width,
      (svgHeight - padding) / gBox.height
    );

    const limitedScale = Math.max(this.minZoom, Math.min(this.maxZoom, scale));

    const transform = d3.zoomIdentity
      .translate(
        svgWidth / 2 - (gBox.x + gBox.width / 2) * limitedScale,
        svgHeight / 2 - (gBox.y + gBox.height / 2) * limitedScale
      )
      .scale(limitedScale);

    this.svg.transition().duration(750).call(this.zoomBehavior.transform, transform);
  }
}