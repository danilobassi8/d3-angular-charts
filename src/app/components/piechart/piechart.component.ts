import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-piechart',
  templateUrl: './piechart.component.html',
  styleUrls: ['./piechart.component.scss'],
})
export class PiechartComponent implements OnInit {
  constructor() {}

  // static
  width = 500;
  height = 500;
  margin = 40;
  strokeWidth = 7;
  animationDuration = 1000; //ms

  // calculated
  radius: number;
  innerRadius: number;
  svg: any;
  colorScale: any;
  dataKeys: Array<string>;
  hiddenDataKeys: Array<string> = []; // data keys to hide

  // data
  data1 = [
    { key: 'Saphire', value: 100 },
    { key: 'Lewis', value: 100 },
    { key: 'Daredevil', value: 250 },
    { key: 'Rabbit', value: 50 },
    { key: 'San Marino', value: 200 },
  ];
  data2 = [
    { key: 'Saphire', value: 70 },
    { key: 'Lewis', value: 130 },
    { key: 'Daredevil', value: 240 },
    { key: 'Rabbit', value: 100 },
    { key: 'Other robot', value: 120 },
  ];

  data = this.data1;

  ngOnInit(): void {
    this.initWaterfall();
  }

  initWaterfall(data: any = this.data) {
    this.data = data;
    this.buildSVG();
    this.updateSVGData(data);
  }

  buildSVG() {
    // remove the previous svg if exists.
    d3.select('#d3-piechart').remove();
    this.svg = d3.select('#d3-container').append('div').attr('id', 'd3-piechart');

    this.radius = Math.min(this.width, this.height) / 2 - this.margin;
    this.innerRadius = this.radius / 2.71;

    this.svg = d3
      .select('#d3-piechart')
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .append('g')
      .attr('transform', 'translate(' + this.width / 2 + ',' + this.height / 2 + ')')
      .attr('class', 'main-d3-piechart');

    this.dataKeys = this.data.map((e) => e.key);
    this.colorScale = d3.scaleOrdinal().domain(this.dataKeys).range(d3.schemeCategory10);
  }

  updateSVGData(data: any) {
    this.dataKeys = data.map((e) => e.key);
    // Compute the position of each group on the pie:
    const pie = d3
      .pie()
      .value((d: any) => {
        const { result } = this.isKeyHiddenWithIndex(d.value.key);
        if (result) {
          return 0;
        }
        return d.value.value;
      })
      .sort(function (a: any, b: any) {
        return d3.ascending(a.key, b.key);
      });

    const data_ready = pie(d3.entries(data) as any);

    // Map data ready into the piechart
    const u = this.svg.selectAll('path').data(data_ready);

    // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
    u.enter()
      .append('path')
      .merge(u)
      .transition()
      .duration(this.animationDuration)
      .attr('d', d3.arc().innerRadius(this.innerRadius).outerRadius(this.radius))
      .attr('fill', (d: any) => {
        return this.colorScale(d.data.value.key);
      })
      .attr('stroke', 'white')
      .style('stroke-width', `${this.strokeWidth}px`)
      .style('opacity', 0.9);

    u.exit().remove();
  }

  toggleDataKey(key: string) {
    // delete this from hidden if exists, else, add it to the list
    const { result, index } = this.isKeyHiddenWithIndex(key);
    if (result) {
      this.hiddenDataKeys.splice(index, 1);
    } else {
      this.hiddenDataKeys.push(key);
    }
    this.initWaterfall();
  }
  isKeyHiddenWithIndex(key: string) {
    const index = this.hiddenDataKeys.indexOf(key);
    if (index > -1) {
      return { result: true, index };
    }
    return { result: false, index: undefined };
  }
  isKeyHidden(key): boolean {
    const { result } = this.isKeyHiddenWithIndex(key);
    return result;
  }
}
