function init() {
    d3.json("/api/forecast_dates").then((data) => {

        console.log(data)
        date_dropdown = d3.select("#date-selection")   
        data.forEach((date) => {
            date_dropdown.append("option")
                .attr("value", date['DATE'])
                .text(date['DATE'])
            console.log(date['DATE'])
        })

    })

    var z = d3.scaleLinear()
        .range(["#ba721f", "#9b150c"])


    var $container = $('#chart-area')
    var svg = d3.select("#chart-area").append('svg');        
        // xAxis = svg.select("#x-axis"),
        // yAxis = svg.select("#y-axis");

    var margin = {
            top: 40,
            right: 40,
            bottom: 40,
            left: 40
        };

    svgWidth = $container.width();
    svgHeight = 600;
    chartWidth = svgWidth - margin.left - margin.right; 
    chartHeight = 600 - margin.top - margin.bottom;

    svg 
        .attr("width", svgWidth)
        .attr("height", svgHeight)

        .style("border", "1px solid")

    var chartGroup = svg.append("g")
        .attr("id", "chart-group")
        .attr("transform", "translate(40,40)")

    var xAxis = chartGroup.append("g")
                    .attr("id", "x-axis")
                    .attr("transform", `translate(0, ${chartHeight})`)

    var yAxis = chartGroup.append("g")
                .attr("id", "y-axis")

    filter_button = d3.select("#filter-btn")

    filter_button.on("click", function() {
        d3.event.preventDefault();
        var inputElement = d3.select("#date-selection").node().value
        console.log(inputElement)

        d3.json("/api/forecast/" + inputElement).then((projection_list) => {
            console.log(projection_list)
            projections = projection_list['projection_inputs']
            console.log(projections)

            var format = d3.format(",.2r")

            chartGroup.data(projection_list)
            var maxY = d3.max(projections, function(d) {return d.LOAD})
            var minY = d3.min(projections, function(d) {return d.LOAD})
            console.log("max: " + maxY)

            z.domain([minY, maxY])

            var timemap = projections.map(d => {return d['TIME']})
            console.log(timemap)

            yScale = d3.scaleLinear()
                .domain([0, maxY])
                .range([chartHeight, 0])
            console.log(yScale)

            xScale = d3.scaleBand()
                .domain(projections.map(d => {return d['TIME']}))
                .range([0, chartWidth])
                .padding(.4)

            var leftAxis = d3.axisLeft(yScale)
            var botAxis = d3.axisBottom(xScale)

            var chart = d3.select("#chart-group")
            // if (d3.selectAll("#y-axis").empty()) {
            svg.select("#y-axis")
            .transition()
            .ease(d3.easeCubicOut)
            .duration(1000)
            .call(leftAxis);

            svg.select("#x-axis")
            .transition()
            .duration(1000)
            .call(botAxis)
                // .selectAll("text")
                // .style("text-anchor", "end")
                // .attr("font-size", "1.2em")
                // .attr("dx", "-10px")
                // .attr("dy", "0px")
                // .attr("transform", "rotate(-55)")

            var bars = svg.selectAll(".bar")

            bars
                .data(projections)
                .enter().append("rect")
                    .attr("class", "bar")
                    .attr("x", function(d) {return xScale(d.TIME) + 40})
                    .attr("width", xScale.bandwidth())
                    .attr("y", chartHeight + 40)
                    .attr("height", 0)
                    .attr("fill", d => {return z(d.LOAD)})
                    .merge(bars)
                    .transition()
                    .ease(d3.easeCubicOut)
                    .duration(1000)
                    .attr("y", d => {return yScale(d.LOAD) + 40})
                    .attr("height", d => {return (chartHeight - yScale(d.LOAD))})
                    .attr("fill", d => {return z(d.LOAD)})

            var bartext = chartGroup.selectAll(".bar-text")
                .data(projections)
                .enter().append("text")
                .attr("class", "bar-text")
                .attr("x", function(d) {return xScale(d.TIME)})
                .attr("y", chartHeight - 5)
                .attr("font-family", "Segoe UI Light")
                .attr("font-size", ".8em")
                .attr("font-weight", "bolder")
                .attr("dx", "0em")
                .text(0)
                // .merge(bartext)
                d3.selectAll(".bar-text")
                .merge(bartext)
                .transition()
                .ease(d3.easeCubicOut)
                .duration(1000)
                .attr("y", d => {
                    console.log(this)
                    return yScale(d.LOAD) - 5
                })
                .tween("text", function(d) {
                    var that = d3.select(this)
                    var prevnumber = that.node().textContent
                    prevnumber = parseFloat(prevnumber)
                    console.log(prevnumber)
                    var i = d3.interpolate(prevnumber, d.LOAD)
                    console.log(that)
                    console.log(that.node())
                    console.log(that.node().textContent)
                    return t => {that.text(i(t).toFixed(2))}
                })

            // var bartext = bars.selectAll(".bar-text")

            // bartext.data(projections)
            // .enter().append("text")
            //     .attr("class", ".bar-text")
            //     .attr("x", function(d) {return xScale(d.TIME) + 40})
            //     .attr("text", 0)
            //     .attr("y", chartHeight + 35)
            //     .merge(bartext)
            //     .transition()
            //     .duration(599)
            //     .attr("y", d=> {return yScale(d.LOAD) + 35})
            //     .tween("text", d=> {
            //         var i = d3.interpolate(0, d.LOAD)
            //         var that = d3.select(this)
            //         return function(t) {that.text(i(t))}
            //     })

            // bars.append("text")
            //     .attr("y", 5)
            //     .attr("x", function(d) {return xScale(d.TIME) + 40})
            //     .attr("text", 0)




            // var toolTip = d3.tip()
            //     .attr("class", "tooltip")
            //     .html(d => {return d.LOAD})

            // chartGroup.call(toolTip)

            // d3.selectAll("rect").on("mouseover", function(d) {
            //     console.log("mouseover")
            //     toolTip
            //     .offset([-10,0])
            //     .show(d, this)
            // }).on("mouseout", function(d) {
            //     toolTip.hide(d)
            // })
            // }else if (!d3.selectAll("#y-axis").empty()) {
            //     d3.select("#y-axis")
            //     .transition()
            //     .call(leftAxis)

            //     bars
            //     .data(projections)
            //     .enter().append("rect")
            //         .attr("class", "bar")
            //         .attr("width", xScale.bandwidth())
            //         .attr("y", d => {return yScale(d.LOAD) + 40})
            //         .attr("height", 0)
            //         .merge(b)
            //         .transition()
            //         .duration(599)
            //         .attr("height", d => {return chartHeight - yScale(d.LOAD)})
            // }

            g = chart.append("g")
                .selectAll("g")
                .enter().append("g")
                .attr("transform", function(d) { return "translate(" + xScale(d['TIME']) + ",0)"; });


            


        })



    })
}




init()