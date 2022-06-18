const table = d3.select("#tabla")

const load = async () => {
  const data = await d3.json("https://randomuser.me/api?results=10")
  console.log(data.results[0])

  // data.results.forEach((r) => {
  //   console.log(r.name.title, r.name.first, r.name.last)
  // })

  const rows = table.selectAll("tr").data(data.results)

  rows
    .enter()
    .append("tr")
    .html(
      (d) => `<tr>
  <td>
    <img
      src="${d.picture.medium}"
      class="rounded-circle shadow"
    />
  </td>
  <td>
    <strong>${d.name.title} ${d.name.first} ${d.name.last}</strong><br />
    2778 Berliner Straße<br />
    Weißwasser/O.L., Germany<br />
  </td>
</tr>
`
    )
}

load()
