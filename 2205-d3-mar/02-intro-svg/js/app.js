const graf = d3.select("#graf")
const colorSelect = d3.select("#colorSelect")

const anchoTotal = +graf.style("width").slice(0, -2)
const altoTotal = (anchoTotal * 9) / 16

const svg = graf
  .append("svg")
  .attr("width", anchoTotal)
  .attr("height", altoTotal)

let cx = anchoTotal / 2
let cy = altoTotal / 2
let r = 75
let color = "#000"

const c = svg.append("circle").attr("cx", cx).attr("cy", cy).attr("r", r)

const colores = [
  { nombre: "rojo", color: "#f00" },
  { nombre: "verde", color: "#0f0" },
  { nombre: "azul", color: "#00f" },
  { nombre: "amarillo", color: "#ff0" },
]

colorSelect
  .selectAll("option")
  .data(colores)
  .enter()
  .append("option")
  .attr("value", (d) => d.color)
  .text((d) => d.nombre)

// DRY - Don't Repeat Yourself
const delta = (d) => {
  // Coalescence Operator
  cx += d.x ?? 0
  cy += d.y ?? 0

  if (d.color) {
    color = colorSelect.node().value
  }

  c.transition()
    .duration(1500)
    .attr("cx", cx)
    .attr("cy", cy)
    .attr("fill", color)
}
