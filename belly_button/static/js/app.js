
function buildMetadata(sample) {
  
  let url_2 = "/metadata/" + sample;
  d3.json(url_2).then(function(sample){
    var table = d3.select(`#sample-metadata`);
    console.log(table)

    table.html("");
      Object.entries(sample).forEach(function([key,value]){
        var trow = table.append("tr");
        trow.append("td").text(`${key} : ${value}`)
      })
    });
  
}

function buildCharts(sample) {
  let url = "/samples/" + sample;
  d3.json(url).then(function(x){
    console.log(x.otu_ids);
    
    //Bubble chart 
    var trace = {
      x: x.otu_ids,
      y: x.sample_values,
      text: x.otu_labels,
      mode: 'markers',
      marker: {
        colorscale: "Rainbow",
        size: x.sample_values,
        color: x.otu_ids
        
      }
    };
    
    var data = [trace];
    
    var layout = {
      title: 'Belly Button Bubble',
      showlegend: false,
      plot_bgcolor:"#F4F4F4",
      paper_bgcolor:"#F4F4F4",
      height: 600,
      width: 1000,
      xaxis: {
        title: "OTU ID"
      }
    };
    
    Plotly.newPlot('bubble', data, layout);

    //Pie chart
    let data1 = [{

      values: x.sample_values.slice(0,10),
      labels: x.otu_ids.slice(0,10),
      hovertext: x.otu_labels.slice(0,10),
      type: 'pie'
    }];

    // console.log(
    //   data1[0]["data_values"].sort((a, b) => b - a)
    // )

    // console.log(
    //   data1[0]["labels"].sort((a, b) => data1[0]["data_values"][data1[0]["labels"].indexOf(b)] - data1[0]["data_values"][data1[0]["labels"].indexOf(a)])
    // )


    var layout1 = {
      plot_bgcolor:"#F4F4F4",
      paper_bgcolor:"#F4F4F4",
      height: 600,
      width: 800
    };
    
    Plotly.newPlot('pie', data1, layout1);

    
  
  })
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
