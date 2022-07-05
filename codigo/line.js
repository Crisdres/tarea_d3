// set the dimensions and margins of the graph
const margins = {
  top: 50,
  right: 20,
  bottom: 70,
  left: 50
}

const line = d3.selectAll("#line")
const pais =d3.select("#pais")
const tooltip = d3.select("#tooltip")
const anchoT = +line.style("width").slice(0, -2)
const altoT = (anchoT * 9) / 16

const anc =anchoT-margins.left-margins.right
const alt = altoT-margins.bottom-margins.top
console.log(anchoT, altoT, alt,  anc)
  // append the svg object to the body of the page
  var svg = line
  .append("svg")
  .attr("width", anchoT)
  .attr("height", altoT)
  .append("g")
  .classed("line",true)
  .attr("transform",
  "translate(" + margins.left + "," + margins.top + ")");

//Read the data
const drawLine = async (val = "Mundo") => {

  let dataSet= await d3.csv('data/data.csv', d3.autoType)
  dataSet.sort((a,b) => b[b.Anio] - a[a.Anio]) 

  var paises = dataSet.map(d => d.Pais).filter((v, i, d) => d.indexOf(v) === i);
  // insertando valores en el select
  pais
      .selectAll("option")
      .data(paises)
      .enter()
      .append("option")
      .attr("value", d => d)
      .text(d =>  d)


    var data = dataSet.filter((d) => d.Pais === val ? d : NaN)

    // Add X axis
    var x = d3.scaleLinear()
      .domain(d3.extent(data, function(d) { return d.Anio; }))
      .range([ 0, anc ]);
    svg.append("g")
      .attr("transform", "translate(0," + alt + ")")
      .call(d3.axisBottom(x));

      let color = d3.scaleOrdinal()
      .domain(paises)
      .range(["blue","yellow","green","red"]);

      
    // Add Y axis
    var y = d3.scaleLinear()
      .domain([0, d3.max(data, function(d) { return +d.Tasa; })])
      .range([ alt, 0 ]);
    svg.append("g")
      .call(d3.axisLeft(y));


    // Add the line
    var sLine = svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke-width", 3.5)
      .attr("d", d3.line()
        .x(function(d) { return x(d.Anio) })
        .y(function(d) { return y(d.Tasa) }))
      .attr("stroke", (d) => color(d.Pais))

    var dots = svg.selectAll("dot")
    .data(data)
    .enter().append("circle")								
        .attr("r", 3)		
        .attr("cx", function(d) { return x(d.Anio); })		 
        .attr("cy", function(d) { return y(d.Tasa); })		
    .on("mouseover", function(event, d) {	
      tooltip.transition()		
          .duration(200)		
          .style("opacity", .9);		
          tooltip.html("Año:" + (d.Anio) + "Tasa:"  + d.Tasa)	
          .style("left", (event.x + 5) + "px")		
          .style("top", (event.y - 20) + "px");	
          console.log(event.x,event.y)
      })					
    .on("mouseout", function(d) {		
      tooltip.transition()		
          .duration(500)		
          .style("opacity", 0);	
      });

    const titulo = svg.append("text")
                .attr("x",anc/2)
                .attr("y",-10)
                .attr("text-anchor","middle")
                .classed("titulo",true)
                .text("Tasa por pais - " +val )

  function update(value){
    var dataU = dataSet.filter((d) => d.Pais === value ? d : NaN)
    console.log(dataU)
    sLine
    .datum(dataU)
    .transition()
    .duration(1000)
    .attr("d", d3.line()
      .x(function(d) { return x(d.Anio) })
      .y(function(d) { return y(d.Tasa) })
    )
    .attr("stroke", (d) => color(d.Pais))
    dots
    .data(dataU)
    .enter().append("circle")	
    .merge(dots)  //necesario para que se actualize
    .transition()
    .duration(1000)							
        .attr("r", 3)		
        .attr("cx", function(d) { return x(d.Anio); })		 
        .attr("cy", function(d) { return y(d.Tasa); })	
    titulo.text("Tasa por pais - " + value)
  }

    // escucha de eventos
    pais.on("change", (e) => {
      // bloquea el compartamiento por defecto del elemento
      e.preventDefault()
      update(pais.node().value)
  })
}
drawLine()
