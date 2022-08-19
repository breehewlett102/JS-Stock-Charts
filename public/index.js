async function main() {

    let apiKey = 'f44303f265034089b6da32a1ef1b95b7';
    let endpoint = `https://api.twelvedata.com`;

    let symbols = ['GME', 'MSFT', 'DIS', 'BNTX'];

    let url = `${endpoint}/time_series?symbol=${symbols.join(',')}&interval=1day&apikey=${apiKey}`;

    let res = await fetch(url);
    let data = await res.json();

    if (!!data.code){
        console.log('api request failed')
        data = mockData;
    }

    const timeChartCanvas = document.querySelector('#time-chart');

    let datasets = [];
    let labels = Object.entries(data)[0][1].values.map(val => val.datatime);

    for (let symbol in data) {
        let obj = {};
        let values = data[symbol].values;
        obj.label = symbol;
        obj.data = values.map(val => val.high).reverse();
        obj.backgroundColor = ['rgba(255, 99, 132, 0.2)'];
        obj.borderColor = ['rgba(255, 99, 132, 1)'];
        obj.borderWidth = 1;
        datasets.push(obj);
    }

    const timeChart = new Chart(timeChartCanvas, {
        type: 'line',
        data: {labels: labels.reverse(), datasets},
        obtions: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    const highestPriceChartsCanvas = document.querySelector('#highest-price-chart');

    let highest = [];

    Object.entries(data).forEach(([ symbol, {meta, values}], idx) => {
        values.forEach(({high}) => {
            if (highest[idx] == undefined || Number(high) > Number(highest[idx])) highest[idx] = high;
        })
    })
    console.log(highest);

    const highChart = new Chart(highestPriceChartsCanvas, {
        type: 'bar',
        data: { labels: Object.keys(data), datasets: [{
            label: 'Highest Price',
            data: highest
        }]},
        options:{
            scales:{
                y:{
                    beginAtZero: true
                }
            }
        }
    });

    const averagePriceChartCanvas = document.querySelector('#average-price-chart');
}

main()