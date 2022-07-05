



//#######################################
//         funcion pde graficado 
//#######################################
const draw = async (m = "Tasa", apuntador= "#graf") => {

    // Seleccion de elementos en el HTML
const graf = d3.selectAll(apuntador)

const metrica =d3.select("#metrica")

// Dimenciones
const margins = {
                    top: 50,
                    right: 20,
                    bottom: 70,
                    left: 50
                }

const anchoTotal = +graf.style("width").slice(0, -2)
const altoTotal = (anchoTotal * 9) / 16

const ancho =anchoTotal-margins.left-margins.right
const alto = altoTotal-margins.bottom-margins.top

// declaracion del elemento contenedor Y
// establecimiento de sus dimenciones
const svg = graf
  .append("svg")
  .attr("width", anchoTotal)
  .attr("height", altoTotal)
  .attr("class","graf")

// declaración del area del grafico y 
// establecimiento de de sus atributos
svg.append("rect")
    .attr("x",0)
    .attr("y",0)
    .attr("width",ancho)
    .attr("height",alto)
    .attr("transform",`translate(${margins.left}, ${margins.top})`)
    .classed("backdrop",true)

// crear un grupo, necesarios para interactividad
const g =svg.append("g")
.attr("transform",`translate(${margins.left}, ${margins.top})`)


    
    let data= await d3.csv('data/data.csv', d3.autoType)
    // convertir a numericos los datos
    // data.forEach( (d) => {d.Anio = +d.Anio}

    // funcion para obtener una lista de las columnas
    kpi=Object.keys(data[0]).slice(1)

    // insertando valores en el select
    metrica
        .selectAll("option")
        .data(kpi)
        .enter()
        .append("option")
        .attr("value", d => d)
        .text(d => d)

    //console.log(data)

    // Accesor
    const xAccesor = (d) => d.Anio

     // ESCALADORES eje Y
     const y = d3.scaleLinear()
                 .range([alto, 0])
    
    // ESCALADORES eje X
    
    const x = d3
            .scaleBand()
            .range([0, ancho])
            .paddingOuter(0.2)
            .paddingInner(0.2)   

    // ESCALADOR COLOR 
    const color =d3
                    .scaleOrdinal()
                    .domain(kpi)
                    //.range(["#06D6A0","#118AB2","#073B4C"])
                    .range(d3.schemePastel1)


    // dibujando ejes
    
    const xAxisGroup = g.append('g')
                        .attr('transform', `translate(0, ${alto})`)
                        .classed('axis',true)
                        

    
    const yAxisGroup = g.append('g')                                             
                        .classed('axis',true)
                      
    // titulos
    const titulo =g.append("text")
                    .attr("x",ancho/2)
                    .attr("y",-10)
                    .attr("text-anchor","middle")
                    .classed("titulo",true)


//#######################################
//     funcion particion dinamica
//#######################################
    const render = (m) => {
        // ordenar el año
        //data.sort((a,b) => a[m]- b[m])        

        const yAccesor = (d) => d[m]
        
        const anios =d3.map(data, (d) => d.Anio)
        x.domain(anios)
        y.domain([0,d3.max(data,yAccesor )])


        // Dibujo de las barras
        const rect = g
            .selectAll('rect')// seleccion vacia no existe rect
            .data(data)//cargamos los datos en base a las filas
            
        rect.enter()//itera sobre las filas
            //pocisiones inicieales
            .append('rect')
            .attr("x",(d) => x(xAccesor(d)))
            .attr("y",(d) => y(yAccesor(d)))
            .attr("width",x.bandwidth())
            .attr("height", 0)
            .attr("fill","green")

            // pocisiones a <actualizar
            .merge(rect)  //necesario para que se actualize
            .attr("fill","#EF476F")
            .transition()
            .duration(500)
            .attr("fill","#FFD166")
            .transition()
            .duration(500)
            .attr("x",(d) => x(xAccesor(d)))
            .attr("y",(d) => y(yAccesor(d)))
            .attr("width",x.bandwidth())
            .attr("height", function(d) {return alto-y(yAccesor(d))})
            .attr("fill", color(m))


        titulo
            .text("KPI económica "+"'"+m+"'")
            

        const xAxis = d3.axisBottom(x)
        xAxisGroup
            .call(xAxis).selectAll("text")
            .attr("transform", "translate(-10,10)rotate(-75)")
            .style("text-anchor", "end")

        const yAxis = d3.axisLeft(y)
        //.ticks(4);
        yAxisGroup
            .transition()
            .duration(1000)
            .call(yAxis)
        
    }

    var margin = {top: -60, right: -160, bottom: 20, left: 20},
    w = anchoTotal;
    h = altoTotal;

    enye = 'Años'

    svg.append("text")
       .attr("transform", "translate(" + (w/2) + " ," + (h-10) + ")")
       .style("text-anchor", "middle")
       .classed("titulo-eje-x",true)
       .text(enye);
    
    // escucha de eventos
    metrica.on("change", (e) => {
        // bloquea el compartamiento por defecto del elemento
        e.preventDefault()
        
    
        render(metrica.node().value)


    })
    render(m)

}
    




const draw2 = async (el, escala) =>{


    const margins = {
        top: 140,
        right: 240,
        bottom: 70,
        left: 150
    }

    const graf =d3.select(el)
    const anchoTotal = +graf.style("width").slice(0, -2)
    const box = (anchoTotal-8)/20
    const altoTotal = box*3 +10

    const anchoTotalTotal = anchoTotal-margins.left+margins.right
    const altoTotalTotal = altoTotal-margins.bottom+margins.top
      
    const svg = graf
        .append("svg")
        .classed("grafpureba",true)
        .attr("width", anchoTotalTotal)
        .attr("height", altoTotalTotal)
    const data= await d3.csv('data/data.csv', d3.autoType)
    
    // funcion para obtener una lista de las columnas
    const metrica =d3.selectAll("#metrica")
    kpi=Object.keys(data[0]).slice(2)

   

  
    // escalador
  let color
  switch (escala){
    case "linear":
        color = d3
        .scaleLinear()
        .domain(d3.extent(data, (d) =>d.Tasa))
        .range(["yellow","red"])
      break
  }
  
  switch (escala){
    case "quantize":
        color = d3
        .scaleQuantize()
        .domain(d3.extent(data, (d) =>d.Tasa))
        .range(["yellow","black","red"])
      break
  }
  
  
    console.log(data["Tasa"])
  
    svg.append("g")
      .attr("transform", "translate(5,5)")
      .selectAll("rect")
      .data(data)
      .join("rect")// enter y append
      .attr("x", (d,i) => (i%20)*box+margins.right-150)
      .attr("y",(d,i) => Math.floor(i/20) * box+15)
      .attr("fill",(d) => color(d.Tasa))
      //.attr("fill","yellow")
      .attr("stroke","#000000")
      .attr("width",box-4)
      .attr("height",box-4)


      const g =svg.append("g")
      .attr("transform",`translate(${margins.left}, ${margins.top})`)
  


   // ESCALADORES eje X

   var scale = d3.scaleLinear()
      
      .range([0, 600]);
   
   const x = d3
           .scaleBand()
           .range([0, anchoTotal])
           .domain([2002, 2003,2004,2005,2006,2007,2008,2009,2010,2011,
                    2012,2013,2014,2015,2016,2017,2018,2019,2020,2021]
                    )
           .paddingOuter(0.2)
           .paddingInner(0.2)   

    const anios =d3.map(data, (d) => d.Anio)
    x.domain(anios)

       // dibujando ejes   
   const xAxisGroup = g.append('g')
   .attr('transform', `translate(0, ${altoTotal})`)
   .classed('axis',true)
     
    const xAxis = d3.axisBottom(x)
    xAxisGroup.call(xAxis)               




    }
         

draw2("#graf4", "linear")


draw(m = "Tasa", apuntador= "#graf")
draw(m = "Poblacion", apuntador= "#graf2")
draw(m = "Desempleo", apuntador= "#graf3")
//.attr("transform", "translate")draw2("#graf3","linear")


//g.append("rect").attr("x",0).attr("y",0).attr("width",ancho).attr("height",alto)

