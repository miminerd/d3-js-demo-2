import define1 from "./a33468b95d0b15b0@808.js";

const nodes =[
  {source: 'Flare', target: 'cluster', type: 'analytics'},
  {source: 'Flare', target: 'graph', type: 'analytics'},
  {source: 'Flare', target: 'optimization', type: 'analytics'},
  {source: 'Flare', target: 'interpolate', type: 'analytics'},

  {source: 'cluster', target: 'AgglomerativeCluster', type: 'query'},
  {source: 'cluster', target: 'CommunityStructure', type: 'query'},
  {source: 'cluster', target: 'HierarchicalCluster', type: 'query'},
  {source: 'cluster', target: 'MergeEdge', type: 'query'},

  {source: 'graph', target: 'BetweennessCentrality', type: 'query'},
  {source: 'graph', target: 'LinkDistance', type: 'query'},
  {source: 'graph', target: 'ShortestPaths', type: 'query'},
  {source: 'graph', target: 'SpanningTree', type: 'query'},

  {source: 'optimization', target: 'AspectRatioBanker', type: 'query'},

  {source: 'interpolate', target: 'ColorInterpolator', type: 'query'},
  {source: 'interpolate', target: 'ArrayInterpolator', type: 'query'},

  {source: 'interpolate', target: 'DelimitedTextConverter', type: 'converters'},
  {source: 'DelimitedTextConverter', target: 'IDataConverter', type: 'converters'},
  {source: 'IDataConverter', target: 'JSONConverter', type: 'display'},
  {source: 'IDataConverter', target: 'DataUtil', type: 'display'},
]

function _chart(data,d3,width,height,types,color,location,drag,linkArc,invalidation)
{
  const links = data.links.map(d => Object.create(d));
  const nodes = data.nodes.map(d => Object.create(d));

  const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id(d => d.id))
      .force("charge", d3.forceManyBody().strength(-400))
      .force("x", d3.forceX())
      .force("y", d3.forceY());

  const svg = d3.create("svg")
      .attr("viewBox", [-width / 2, -height / 2, width, height])
      .style("font", "12px sans-serif");

  // Per-type markers, as they don't inherit styles.
  svg.append("defs").selectAll("marker")
    .data(types)
    .join("marker")
      .attr("id", d => `arrow-${d}`)
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 15)
      .attr("refY", -0.5)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
    .append("path")
      .attr("fill", color)
      .attr("d", "M0,-5L10,0L0,5");

  const link = svg.append("g")
      .attr("fill", "none")
      .attr("stroke-width", 1.5)
    .selectAll("path")
    .data(links)
    .join("path")
      .attr("stroke", d => color(d.type))
      .attr("marker-end", d => `url(${new URL(`#arrow-${d.type}`, location)})`);

  const node = svg.append("g")
      .attr("fill", "currentColor")
      .attr("stroke-linecap", "round")
      .attr("stroke-linejoin", "round")
    .selectAll("g")
    .data(nodes)
    .join("g")
      .call(drag(simulation));

  node.append("circle")
      .attr("stroke", "white")
      .attr("stroke-width", 1.5)
      .attr("r", 4);

  node.append("text")
      .attr("x", 8)
      .attr("y", "0.31em")
      .text(d => d.id)
    .clone(true).lower()
      .attr("fill", "none")
      .attr("stroke", "white")
      .attr("stroke-width", 3);

  simulation.on("tick", () => {
    link.attr("d", linkArc);
    node.attr("transform", d => `translate(${d.x},${d.y})`);
  });

  invalidation.then(() => simulation.stop());

  return svg.node();
}


async function _linksO(d3,FileAttachment){return(
   d3.csvParse(await FileAttachment("suits.csv").text())
)}

async function _links(){return(
nodes
)}

function _types(links){
  return(
    Array.from(new Set(nodes.map(d => d.type)))
    )
  /*return(
Array.from(new Set(links.map(d => d.type)))
  )*/}

function _data(links){
  console.log('data ', Array.from(new Set(links.flatMap(l => [l.source, l.target])), id => ({id})), links)
  return(
{nodes: Array.from(new Set(links.flatMap(l => [l.source, l.target])), id => ({id})), links}
)}

function _height(){return(
600
)}

function _color(d3,types){return(
// d3.scaleOrdinal(types, d3.schemeCategory10)
// d3.scaleOrdinal(types, d3.schemeTableau10)
d3.scaleOrdinal(types, d3.schemeDark2 )
)}

function _linkArc(){return(
function linkArc(d) {
 const r = Math.hypot(d.target.x - d.source.x, d.target.y - d.source.y);
  // const r = 678;
  return `
    M${d.source.x},${d.source.y}
    A${r},${r} 1 0,1 ${d.target.x},${d.target.y}
  `;
}
)}

function _drag(d3){return(
simulation => {
  
  function dragstarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }
  
  function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
  }
  
  function dragended(event, d) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }
  
  return d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);
}
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer("chart")).define("chart", ["data","d3","width","height","types","color","location","drag","linkArc","invalidation"], _chart);
  main.variable(observer("links")).define("links",  _links);
  main.variable(observer("types")).define("types", ["links"], _types);
  main.variable(observer("data")).define("data", ["links"], _data);
  main.variable(observer("height")).define("height", _height);
  main.variable(observer("color")).define("color", ["d3","types"], _color);
  main.variable(observer("linkArc")).define("linkArc", _linkArc);
  main.variable(observer("drag")).define("drag", ["d3"], _drag);
  const child1 = runtime.module(define1);
  main.import("Swatches", child1);
  return main;
}
