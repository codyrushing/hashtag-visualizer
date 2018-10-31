import * as d3 from 'd3';
import processData from '../lib/process-data';

export default class TweetChordChart {
  constructor(container, params={}, data=[]){
    this.container = container;
    this.params = params;
    this.width = 800;
    this.height = 800;
    this.initDOM();
    this.initDrawingLib();
    this.update(data);
  }
  initDOM(){
    this.svg = d3.select(this.container).append('svg');
    this.svg
      .attr('viewBox', [-this.width / 2, -this.height / 2, this.width, this.height])
      .style('font-size', '16px')
      .style('width', '100%')
      .style('height', 'auto');

    // group that will house arcs and labels
    this.g = this.svg.append('g');

    // group that will house ribbons
    this.chordsG = this.svg.append('g')
      .attr('fill-opacity', 0.8);

  }
  initDrawingLib(){
    const smallestDimension = Math.min(this.width, this.height);
    this.outerRadius = smallestDimension / 2;
    this.innerRadius = this.outerRadius - smallestDimension * 0.16;

    this.chordLayout = d3.chord()
      .padAngle(.02)
      .sortSubgroups(d3.descending)
      .sortChords(d3.descending);

    this.arcGenerator = d3.arc()
      .innerRadius(this.innerRadius)
      .outerRadius(this.innerRadius + 20);

    this.ribbon = d3.ribbon()
      .radius(this.innerRadius);

    this.colorScale = d3.scaleOrdinal(d3.schemeSet1);
  }
  update(data, query){
    if(!data || !data.length) return;
    this.data = data;
    this.processedData = processData(this.data, query);
    this.draw();
  }
  draw(){
    const {
      tweets,
      indexByName,
      nameByIndex,
      matrix
    } = this.processedData;

    const fadeClass = 'fade';
    const chords = this.chordLayout(matrix);

    const arcGroups = this.g
      .selectAll('g.arc-group')
      .data(chords.groups);

    const arcGroupsEnter = arcGroups.enter()
      .append('g')
      .attr('class', 'arc-group');

    arcGroupsEnter
      .append('path')
      .attr('class', 'arc')
      .attr('fill', d => this.colorScale(d.index))
      .attr('stroke', d => d3.rgb(this.colorScale(d.index)).darker());

    arcGroups.exit().remove()

    // select both enter and update
    const arcGroupsEnterUpdate = arcGroups.merge(arcGroupsEnter);

    // draw arcs
    arcGroupsEnterUpdate
      .select('path')
      .transition()
      .attr('d', this.arcGenerator);

    // draw labels
    arcGroupsEnter.append('text');
    arcGroupsEnterUpdate.select('text')
      .each(d => { d.angle = (d.startAngle + d.endAngle) / 2; })
      .attr('dy', '.35em')
      .transition()
      .attr('transform', d => `
        rotate(${(d.angle * 180 / Math.PI - 90)})
        translate(${this.innerRadius + 26})
        ${d.angle > Math.PI ? 'rotate(180)' : ''}
      `)
      .attr('text-anchor', d => d.angle > Math.PI ? 'end' : null)
      .text(d => nameByIndex.get(d.index));

    // draw chords
    const chordPaths = this.chordsG
      .selectAll('path.chord')
      .data(chords);

    const chordPathsEnter = chordPaths.enter()
      .append('path')
      .attr('class', 'chord');

    const chordPathsEnterUpdate = chordPaths.merge(chordPathsEnter);

    chordPathsEnterUpdate
      .attr('stroke', d => d3.rgb(this.colorScale(d.source.index)).darker())
      .attr('fill', d => this.colorScale(d.source.index))
      .transition()
      .attr('d', this.ribbon);

    chordPaths.exit().remove();

    // when mousing over arcs, show the cords that correpond to that word
    arcGroupsEnterUpdate
      .on(
        'mouseover',
        d => {
          chordPathsEnterUpdate.classed(fadeClass, false)
            .filter(_d => _d.source.index !== d.index && _d.target.index !== d.index)
            .classed(fadeClass, true);
        }
      )
      .on(
        'mouseout',
        d => {
          chordPathsEnterUpdate
            .classed(fadeClass, false);
        }
      );

  }
}
