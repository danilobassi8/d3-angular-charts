import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import * as d3 from 'd3/index';
import { legendColor } from 'd3-svg-legend';

@Component({
  selector: 'app-d3-piechart',
  templateUrl: './d3-piechart.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./d3-piechart.component.scss'],
})
export class D3PiechartComponent implements OnInit {
  // Harcoded data
  data = [
    { name: 'San Marino', value: 80 },
    { name: 'Daredevil', value: 110 },
    { name: 'Lewis', value: 80 },
    { name: 'Rabbit', value: 190 },
    { name: 'Saphire', value: 190 },
  ];

  // Example data2
  data2 = [
    { name: 'San Marino', value: 80 },
    { name: 'Daredevil', value: 110 },
    { name: 'Lewis', value: 80 },
    { name: 'Rabbit', value: 190 },
    { name: 'Saphire', value: 190 },
  ];

  selectedData = this.data

  dataValues = this.selectedData.map((element) => element.value);
  dataKeys = this.selectedData.map((element) => element.name);

  // Charts dimension
  svgDimensions = { width: 800, height: 500 };
  margin = { left: 20, right: 10, top: 20, bottom: 10 };
  chartDimensions = {
    width: this.svgDimensions.width - this.margin.left - this.margin.right,
    height: this.svgDimensions.height - this.margin.bottom - this.margin.top,
  };

  // Colors
  colors = [
    '#ED1D25',
    '#0056A8',
    '#5BC035',
    '#6B2E68',
    '#F3B219',
    '#FA5000',
    '#C50048',
    '#029626',
    '#A3C940',
    '#0DDEC5',
    '#FFF203',
    '#FFDB1B',
    '#E61C13',
    '#73B1E6',
    '#BECD48',
    '#017252',
  ];
  colorOrdinal = d3.scaleOrdinal(this.colors).domain(this.dataKeys);

  private svg: any;
  private chartGroup: any;
  private spaceForLegend = 30;
  private paddingForLegend = 20;
  private radius =
    Math.min(this.chartDimensions.width, this.chartDimensions.height) / 3 - this.spaceForLegend;
  private arc: any;
  private arcs: any;
  private pieChart: any;
  private pie: any;
  private tooltip: any;

  constructor() {}

  ngOnInit(): void {
    this.buildSVG();
  }

  buildSVG() {
    this.svg = d3
      .select('#d3-piechart')
      .append('svg')
      .attr('width', this.svgDimensions.width)
      .attr('height', this.svgDimensions.height);

    this.chartGroup = this.svg
      .append('g')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`)
      .attr('width', this.chartDimensions.width)
      .attr('height', this.chartDimensions.height);

    // Move the center of the piechart from (0,0) to (r,r) where r = radius
    this.chartGroup.attr('transform', `translate(${this.radius},${this.radius})`);

    // Create the donut ring with innerRadius and outerRadius
    this.arc = d3
      .arc()
      .innerRadius(this.radius / 3) // We want to have an arc with a propotional width
      .outerRadius(this.radius);

    this.pieChart = d3.pie().padAngle(0.1);

    this.pie = this.pieChart(this.dataValues);

    this.arcs = this.chartGroup.selectAll('slice').data(this.pie).enter();

    this.tooltip = d3
      .select('body')
      .append('div')
      .attr('id', 'd3-piechart-tooltip')
      .style('opacity', 0);

    this.arcs
      .append('path')
      .attr('d', this.arc)
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`)
      .attr('fill', (d, i) => this.colors[i])
      // ADD ANIMATIONS
      .on('mouseover', (d, i, n) => {
        d3.select(n[i]).attr('fill', `black`);
        this.tooltip.transition().duration(200).style('opacity', 0.9);
        this.tooltip
          .html(`<span>${this.data[i].name}: ${this.data[i].value}</span>`)
          .style('left', `${d3.event.pageX}px`)
          .style('top', `${d3.event.pageY - 28}px`);
      })
      .on('mouseout', (d, i, n) => {
        d3.select(n[i]).attr('fill', this.colors[i]);
        this.tooltip.transition().duration(500).style('opacity', 0);
      });

    // Here we add the legend of the piechart
    this.addLegend();
  }

  updateChart(data) {

    d3.selectAll('path')
      .data(this.pieChart(data))
      .transition()
      .duration(500)
      .attr('d', this.arc);

  }

  addLegend() {
    // TODO: Make all legends visibles
    const legendOrdinal = legendColor().scale(this.colorOrdinal);
    const legendLeft = this.margin.left;
    const legendTop = this.radius * 2 + this.paddingForLegend;
    const legendGroup = this.svg
      .append('g')
      .attr(
        'transform',
        `translate(${legendLeft + this.margin.left}, ${legendTop + this.margin.top})`
      );
    legendGroup.call(legendOrdinal);

    legendGroup.selectAll('.cell').attr('transform', (d, i) => {
      // TODO: make this variable to the string length
      const w = 55; // width of each entry (so you can position the next column)
      const tx = 10; // tx/ty are essentially margin values

      const x = i * w + tx;
      let y;

      if (i % 2) {
        y = 0;
      } else {
        y = 20;
      }

      return 'translate(' + x + ',' + y + ')';
    });
  }
}
