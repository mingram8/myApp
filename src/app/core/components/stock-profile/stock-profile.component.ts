import { Component, Input, OnInit, Output, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import {
  SingleSeries,
  MultiSeries,
  BubbleChartMultiSeries,
  BoxChartMultiSeries,
  Series,
  TreeMapData
} from '../../../../ngx-charts/src/lib/models/chart-data.model';
import { AuthenticationService, DataService } from "../../services";
// import { LegendPosition } from '@swimlane/ngx-charts/common/types/legend.model';
// import { ScaleType } from '@swimlane/ngx-charts/common/types/scale-type.enum';
// import { InputTypes } from '@swimlane/ngx-ui';
// import { Color } from '@swimlane/ngx-charts/utils/color-sets';

import * as d3 from 'd3';
//var d3Boxplot = require("d3-boxplot")
import { ScaleBand } from 'd3';
// import {
//   ChartComponent,
//   ApexChart,
//   ApexAxisChartSeries,
//   ApexTitleSubtitle,
//   ApexDataLabels,
//   ApexFill,
//   ApexYAxis,
//   ApexXAxis,
//   ApexTooltip,
//   ApexMarkers,
//   ApexAnnotations,
//   ApexStroke
// } from "ng-apexcharts";
import { count } from 'rxjs/operators';
//
//
// export type ChartOptions = {
//   series: ApexAxisChartSeries;
//   chart: ApexChart;
//   dataLabels: ApexDataLabels;
//   markers: ApexMarkers;
//   title: ApexTitleSubtitle;
//   fill: ApexFill;
//   yaxis: ApexYAxis;
//   xaxis: ApexXAxis;
//   tooltip: ApexTooltip;
//   stroke: ApexStroke;
//   annotations: ApexAnnotations;
//   colors: any;
//   toolbar: any;
// };


@Component({
  selector: 'app-stock-profile',
  templateUrl: './stock-profile.component.html',
  styleUrls: ['./stock-profile.component.css']
})
export class StockProfileComponent implements AfterViewInit {

  stockInfo: any;
  @Output() stock;
  marketNews: any;
  @Input() data!: { name: string, series: { name: string, value: number }[] }[];
  // @Input() height = 300;
  // @Input() margin = { top: 10, left: 50, right: 10, bottom: 20 };
  // @Input() innerPadding = 0.1;
  @Input() outerPadding = 0.1;
  @Input() seriesInnerPadding = 0.1;
  @Input() domain = [0, 1000];
  @Input() barColors = ['#00aeef', '#f98e2b', '#7C77AD'];

  feelingOptions = [{ key: 'Natural', value: 'Natural' }, { key: 'Bullish', value: 'Bullish' }, { key: 'Blurish', value: 'Blurish' }];
  loading: boolean;
  stockData: any;
  stockPriceData: any;

  // @ViewChild("chart") chart: ChartComponent;
  // chartOptions: Partial<ChartOptions>;




  public this_month_first_date = new Date("01" + " " + new Date().toLocaleString('default', { month: 'short' }) + " " + new Date().getFullYear()).getTime();
  public this_month_last_date = new Date(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate() + " " + new Date().toLocaleString('default', { month: 'short' }) + " " + new Date().getFullYear()).getTime();
  // let currentdate = new Date(new Date().getDate() + " " + new Date().toLocaleString('default', { month: 'short' }) + " " + new Date().getFullYear()).getTime();
  public tomorrow = new Date();
  public tomorrow_date = this.tomorrow.setDate(this.tomorrow.getDate() + 1);
  public tomorrow_date_time = new Date(this.tomorrow_date).getTime();
  public activeOptionButton = "1d";
  public data_start_date;
  

    data2 = [
      {
        "name": "Colombia",
        "series": [
          {
            "name": "2019",
            "value": 12
          },
          {
            "name": "2020",
            "value": 23
          },
          {
            "name": "2021",
            "value": 34
          },
          {
            "name": "2022",
            "value": 27
          },
          {
            "name": "2023",
            "value": 18
          },
          {
            "name": "2024",
            "value": 45
          }
        ]
      },
      {
        "name": "Chile",
        "series": [
          {
            "name": "2019",
            "value": 20
          },
          {
            "name": "2020",
            "value": 28
          },
          {
            "name": "2021",
            "value": 42
          },
          {
            "name": "2022",
            "value": 39
          },
          {
            "name": "2023",
            "value": 31
          },
          {
            "name": "2024",
            "value": 61
          }
        ]
      },
      {
        "name": "Perú",
        "series": [
          {
            "name": "2019",
            "value": 47
          },
          {
            "name": "2020",
            "value": 62
          },
          {
            "name": "2021",
            "value": 55
          },
          {
            "name": "2022",
            "value": 42
          },
          {
            "name": "2023",
            "value": 49
          },
          {
            "name": "2024",
            "value": 71
          }
        ]
      }
    ]
    theme = 'dark';
  chartType: string = "box-chart";
  chartGroups: any[];
  chart: any;
  realTimeData: boolean = false;
  countries: any[];
  single: any[];
  multi: any[];
  fiscalYearReport: any[];
  dateData: any[];
  dateDataWithRange: any[];
  calendarData: any[];
  statusData: any[];
  sparklineData: any[];
  timelineFilterBarData: any[];
  graph: { links: any[]; nodes: any[] };
  bubble: any;
  linearScale: boolean = false;
  range: boolean = false;

  view: [number, number];
  width: number = 700;
  height: number = 300;
  fitContainer: boolean = true;

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  legendTitle = 'Legend';
  legendPosition = "right";
  showXAxisLabel = true;
  tooltipDisabled = false;
  showText = true;
  xAxisLabel = 'Country';
  showYAxisLabel = true;
  yAxisLabel = 'GDP Per Capita';
  showGridLines = true;
  innerPadding = '10%';
  barPadding = 8;
  groupPadding = 16;
  roundDomains = false;
  maxRadius = 10;
  minRadius = 3;
  showSeriesOnHover = true;
  roundEdges: boolean = true;
  animations: boolean = true;
  xScaleMin: any;
  xScaleMax: any;
  yScaleMin: number;
  yScaleMax: number;
  showDataLabel: boolean = false;
  noBarWhenZero: boolean = true;
  trimXAxisTicks: boolean = true;
  trimYAxisTicks: boolean = true;
  rotateXAxisTicks: boolean = true;
  maxXAxisTickLength: number = 16;
  maxYAxisTickLength: number = 16;
  strokeColor: string = '#FFFFFF';
  strokeWidth: number = 2;

  curves = {
    // Basis: shape.curveBasis,
    // 'Basis Closed': shape.curveBasisClosed,
    // Bundle: shape.curveBundle.beta(1),
    // Cardinal: shape.curveCardinal,
    // 'Cardinal Closed': shape.curveCardinalClosed,
    // 'Catmull Rom': shape.curveCatmullRom,
    // 'Catmull Rom Closed': shape.curveCatmullRomClosed,
    // Linear: shape.curveLinear,
    // 'Linear Closed': shape.curveLinearClosed,
    // 'Monotone X': shape.curveMonotoneX,
    // 'Monotone Y': shape.curveMonotoneY,
    // Natural: shape.curveNatural,
    // Step: shape.curveStep,
    // 'Step After': shape.curveStepAfter,
    // 'Step Before': shape.curveStepBefore,
    // default: shape.curveLinear
  };
   
  // line interpolation
  curveType: string = 'Linear';
  curve: any = this.curves[this.curveType];
  interpolationTypes = [
    'Basis',
    'Bundle',
    'Cardinal',
    'Catmull Rom',
    'Linear',
    'Monotone X',
    'Monotone Y',
    'Natural',
    'Step',
    'Step After',
    'Step Before'
  ];

  closedCurveType: string = 'Linear Closed';
  closedCurve: any = this.curves[this.closedCurveType];
  closedInterpolationTypes = ['Basis Closed', 'Cardinal Closed', 'Catmull Rom Closed', 'Linear Closed'];

  colorSets: any;
  colorScheme: any;
  selectedColorScheme: string;
  rangeFillOpacity: number = 0.15;

  // Override colors for certain values
  customColors: any[] = [
    {
      name: 'Germany',
      value: '#a8385d'
    }
  ];

  // pie
  showLabels = true;
  explodeSlices = false;
  doughnut = false;
  arcWidth = 0.25;

  // line, area
  autoScale = true;
  timeline = false;

  // margin
  margin: boolean = false;
  marginTop: number = 40;
  marginRight: number = 40;
  marginBottom: number = 40;
  marginLeft: number = 40;

  // box
  boxData = this.data2;

  // gauge
  gaugeMin: number = 0;
  gaugeMax: number = 100;
  gaugeLargeSegments: number = 10;
  gaugeSmallSegments: number = 5;
  gaugeTextValue: string = '';
  gaugeUnits: string = 'alerts';
  gaugeAngleSpan: number = 240;
  gaugeStartAngle: number = -120;
  gaugeShowAxis: boolean = true;
  gaugeValue: number = 50; // linear gauge value
  gaugePreviousValue: number = 70;

  // heatmap
  heatmapMin: number = 0;
  heatmapMax: number = 50000;

  // Combo Chart


  showRightYAxisLabel: boolean = true;
  yAxisLabelRight: string = 'Utilization';

  // demos
  totalSales = 0;
  salePrice = 100;
  personnelCost = 100;

  mathText = '3 - 1.5*sin(x) + cos(2*x) - 1.5*abs(cos(x))';
  mathFunction: (o: any) => any;

  treemap: any[];
  treemapPath: any[] = [];
  sumBy: string = 'Size';

  // bubble chart interactive demo
  bubbleDemoTempData: any[] = [];

  // Reference lines
  showRefLines: boolean = true;
  showRefLabels: boolean = true;

  // Supports any number of reference lines.
  refLines = [
    { value: 42500, name: 'Maximum' },
    { value: 37750, name: 'Average' },
    { value: 33000, name: 'Minimum' }
  ];

  // data
  plotData: any;

  // Sidebar Controls:
  colorVisible: boolean = true;
  dataVisible: boolean = true;
  dimVisible: boolean = true;
  optsVisible: boolean = true;
  // const boxData: BoxChartMultiSeries = boxD
  //  const colors = this.fixColors(da)
  
  //@ts-ignore 
    fixColors(data): any {
    let color = [];
    let startDate = data[0]["date"].split(" ")[0]
    for (let i =data.length-1 ; i > 0; i-=2) {
      if (startDate != data[i]["date"].split(" ")[0]) {
        continue
      }
  
      let name = data[i]["date"].split(" ")[1]
      let open = data[i]["open"]
      let close = data[i]["close"]
      let high = data[i]["high"]
      let low = data[i]["low"]
      let colorCode = "#4AC825"
      if (close < open) {
        colorCode = "#C82C25"
      }
      let val = {
        name: name,
        value: colorCode
      }   
      color.push(val)
  }
  return color
  }
  //@ts-ignore
    fixData(data): BoxChartMultiSeries {
    let chartData = [];
    let startDate = data[0]["date"].split(" ")[0]
    for (let i =data.length-1 ; i > 0; i-=2) {
      if (startDate != data[i]["date"].split(" ")[0]) {
        continue
      }
  
      let name = data[i]["date"].split(" ")[1]
      let open = data[i]["open"]
      let close = data[i]["close"]
      let high = data[i]["high"]
      let low = data[i]["low"]
      let val = {"name":name, "series":[{"name":name, "value":open},{"name":name, "value":close},{"name":name, "value":high},{"name":name, "value":low}]}    
      chartData.push(val)
    } 
    return chartData;
    // return [{"name":"Intraday", "series":[{"name":"2023-01-23 17:00:00","value":8940},{"name":"2023-01-23 16:20:00","value":8932.7002},{"name":"2023-01-23 16:20:00","value":8937.96973}]}]
  
  }
  dateTime(date: string, days_ago: number = 0) {
    switch (date) {
      case 'days_ago':
        var current = new Date();
        var current_date = current.setDate(current.getDate() - days_ago);
        var current_date_time = new Date(current_date).getTime();
        return current_date_time;
        break;
      case 'current_year_first_date':
        var tomorrow = new Date();
        var first_date_of_the_year = (1 + " " + "January" + " " + tomorrow.getFullYear());
        var datetime_of_first_date_of_the_year = (new Date(first_date_of_the_year)).getTime();
        return datetime_of_first_date_of_the_year;
        break;
      case 'yesterday':
        var current = new Date();
        var current_date = current.setDate(current.getDate() - 5);
        // var current_date = current.setDate(current.getDate() - 1); //commented because of non-systematic data in chart api
        var current_date_time = new Date(current_date).getTime();
        return current_date_time;
        break;
      case 'today':
        var current = new Date();
        var current_date = current.setDate(current.getDate());
        var current_date_time = new Date(current_date).getTime();
        return current_date_time;
        break;
      case 'today_start_time':
        var current = new Date();
        current.setDate(current.getDate());
        current.setMonth(current.getMonth());
        current.setFullYear(current.getFullYear());
        current.setHours(0);
        current.setMinutes(0);
        current.setSeconds(0);
        var current_date_time = new Date(current).getTime();
        return current_date_time;
        break;
      case 'data_start_date':
        return this.data_start_date;
        break;
    }
  }

  public updateOptionsData = {
    "1d": {
      xaxis: {
        min: this.dateTime('today_start_time'),
        max: this.dateTime('today')
      }
    },
    "1m": {
      xaxis: {
        min: this.this_month_first_date,
        max: this.this_month_last_date
      }
    },
    "6m": {
      xaxis: {
        min: this.dateTime('days_ago', 182),
        max: new Date().getTime()
      }
    },
    "1ytd": {
      xaxis: {
        min: this.dateTime('current_year_first_date'),
        max: new Date().getTime()
      }
    },
    "1y": {
      xaxis: {
        min: this.dateTime('days_ago', 365),
        max: new Date().getTime()
      }
    },
    all: {
      xaxis: {
        min: undefined,
        max: undefined
      }
    },
  };


  cartData: void;
  objectOfChartData: any;
  arrayOfDataofChartData = [];
  arrayOfTimeofDataofChartData: any;

  public svg!: d3.Selection<SVGGElement, unknown, null, undefined>;
  public isRendered = false;

  @ViewChild('svgContainer', { read: ElementRef, static: true }) svgContainerRef!: ElementRef<HTMLDivElement>;

  constructor(private authenticationService: AuthenticationService, private dataService: DataService,
    private router: Router, private activate_route: ActivatedRoute) {
      this.boxData = [
        {
          "name": "Colombia",
          "series": [
            {
              "name": "2019",
              "value": 12
            },
            {
              "name": "2020",
              "value": 23
            },
            {
              "name": "2021",
              "value": 34
            },
            {
              "name": "2022",
              "value": 27
            },
            {
              "name": "2023",
              "value": 18
            },
            {
              "name": "2024",
              "value": 45
            }
          ]
        },
        {
          "name": "Chile",
          "series": [
            {
              "name": "2019",
              "value": 20
            },
            {
              "name": "2020",
              "value": 28
            },
            {
              "name": "2021",
              "value": 42
            },
            {
              "name": "2022",
              "value": 39
            },
            {
              "name": "2023",
              "value": 31
            },
            {
              "name": "2024",
              "value": 61
            }
          ]
        },
        {
          "name": "Perú",
          "series": [
            {
              "name": "2019",
              "value": 47
            },
            {
              "name": "2020",
              "value": 62
            },
            {
              "name": "2021",
              "value": 55
            },
            {
              "name": "2022",
              "value": 42
            },
            {
              "name": "2023",
              "value": 49
            },
            {
              "name": "2024",
              "value": 71
            }
          ]
        }
      ]
  
      // interactive drill down 
    this.data = [
      {
        name: 'Row1',
        series: [
          { name: 'Bar1', value: 150 },
          { name: 'Bar2', value: 200 }
        ],
      },
      {
        name: 'Row2',
        series: [
          { name: 'Bar1', value: 300 },
          { name: 'Bar2', value: 400 }
        ],
      },
      {
        name: 'Row3',
        series: [
          { name: 'Bar1', value: 500 },
          { name: 'Bar2', value: 1000 }
        ],
      }
    ];
  }

  calFunc(e) {
    let date = new Date(this.objectOfChartData[e].date);
    let time = date.getTime();
    let price = parseFloat(this.objectOfChartData[e].open);
    return [time, price]
  }
  initChart(): void {

    // try {
    this.objectOfChartData = this.cartData;

    this.objectOfChartData = JSON.stringify(this.objectOfChartData);
    this.objectOfChartData = JSON.parse(this.objectOfChartData);

    this.arrayOfDataofChartData = Object.keys(this.objectOfChartData).map(
      e => this.calFunc(e)
    );

    this.data_start_date = this.arrayOfDataofChartData[this.arrayOfDataofChartData.length - 1][0];

    const data = this.arrayOfDataofChartData;
    this.createChart("1d");
    this.isRendered = true;

    // this.chartOptions = {
    //   series: [
    //     {
    //       data: data
    //     }
    //   ],
    //   chart: {
    //     type: "area",
    //     height: 350
    //   },
    //   annotations: {
    //     yaxis: [
    //       {
    //         y: 30,
    //         borderColor: "#999",
    //         label: {
    //           text: "Support",
    //           style: {
    //             color: "#fff",
    //             background: "#00E396"
    //           }
    //         }
    //       }
    //     ],
    //     xaxis: [
    //       {
    //         x: this.dateTime('today'),
    //         borderColor: "#999",
    //         label: {
    //           text: "Rally",
    //           style: {
    //             color: "#fff",
    //             background: "#775DD0"
    //           }
    //         }
    //       }
    //     ]
    //   },
    //   dataLabels: {
    //     enabled: false
    //   },
    //   markers: {
    //     size: 0
    //   },
    //   xaxis: {
    //     type: "datetime",
    //     min: this.dateTime('data_start_date'),
    //     tickAmount: 6
    //   },
    //   tooltip: {
    //     x: {
    //       format: "dd MMM yyyy"
    //     }
    //   },
    //   fill: {
    //     type: "gradient",
    //     gradient: {
    //       shadeIntensity: 1,
    //       opacityFrom: 0.7,
    //       opacityTo: 0.9,
    //       stops: [0, 100]
    //     }
    //   }
    // };
    // } catch (error) {
    //   throw new Error(error.error);
    // }

  }

  // public updateOptions(option: any): void {
  //   this.activeOptionButton = option;
  //   this.chart.updateOptions(this.updateOptionsData[option], false, true, true);
  // }

  ngOnInit(): void {

    if (localStorage.getItem('currentUser')) {
      this.authenticationService.setValueOfIsLoggedInCheckSubject = true;
    }

    this.activate_route.paramMap.subscribe(params => {
      this.stock = params.get('stock');

      this.getStock(this.stock);
      this.getStockChartData(this.stock, "intraday", "2022-04-01", "2022-04-22");


      this.getNews(this.stock);
    });

  }


  getStockChartData(stock, series, from, to) {

    if (series == "intraday") {
        // @ts-ignore
    this.dataService.getStockChart(stock, series).subscribe(res => {
      this.cartData = res.data;
      if (res) {
        this.stockPriceData = res[0];
        this.initChart();
      }
    })
  } else {
    this.dataService.getStockChart(stock, series, from, to).subscribe(res => {
      this.cartData = res.data[0].historical;
      console.log(this.cartData)
      if (res) {
        this.stockPriceData = res.data[0].historical;
        this.initChart();
      }
    })
  }
  }

  getStock(stock) {
    this.dataService.getStock(stock).subscribe(res => {
      console.log(res)
      this.stockData = res.body;
      this.stockInfo = res.body;
      this.stockData.priceChange = '';
      console.log(this.stockData)
      if (this.stockData.prices.change > 0) {
        this.stockData.priceChange = 'up';
        this.stockData.changeInPrice = this.stockData.prices.change;
        this.stockData.changeInPercentage = this.stockData.prices.changesPercentage;
      } else if (this.stockData.prices.change < 0) {
        this.stockData.priceChange = 'down';
        this.stockData.changeInPrice = this.stockData.prices.change;
        this.stockData.changeInPercentage = this.stockData.prices.changesPercentage;
      }
    })
  }

  getNews(stock) {
    this.dataService.getReportsData(stock)
      .subscribe(res => {
        this.marketNews = res.news;
      });
  }

  addWatchList(stock) {
    let storageData = this.authenticationService.currentUserValue;

    if (!storageData) {
      this.authenticationService.setValueOftriggerLoginSubject = true;
      return false;
    }

    this.stockData.watch_list = true;
    let payload = {
      "stock": stock,
      "user": storageData['id']
    }


    this.dataService.addWatchList(payload)
      .subscribe(res => {
      });
  }


  removeWatchList(stock) {
    let storageData = this.authenticationService.currentUserValue;

    if (!storageData) {
      this.authenticationService.setValueOftriggerLoginSubject = true;
      return false;
    }

    this.stockData.watch_list = false;
    let payload = {
      "stock": stock,
      "user": storageData['id']
    }


    this.dataService.removeWatchList(payload)
      .subscribe(res => {
      });
  }
  ngAfterViewInit(): void {

  }
  private createSVG(): void {
    // this.svg = d3.select(this.svgContainerRef.nativeElement)
    //   .append('svg')
    //   .attr('width', '100%')
    //   .attr('height', this.height)
    //   .append('g')
    //   .attr('width', '100%')
    //   .attr('transform', 'translate(0, 0)')
  }

  private isDataValid(): boolean {
    return this.data && this.data.length > 0;
  }

  private getBandScale(domain: string[], range: any, innerPadding = 0, outerPadding = 0) {
    const scale: any | ScaleBand<string> = d3.scaleBand()
      .range(range)
      .domain(domain)
      .paddingInner(innerPadding)
      .paddingOuter(outerPadding);
    scale.type = 'BAND';
    return scale;
  }
  public updateOptions(op) {
    this.activeOptionButton = op;
    this.svg.selectAll(".stock").remove()
    // this.isRendered = false;
    // this.createSVG();
    // if (op != "1d") {
    //   op = "1m"
    // }
    if (op == "1d"){
        // @ts-ignore
      this.dataService.getStockChart(this.stock, "intraday").subscribe(res => {
        this.cartData = res.data;
        console.log(  this.cartData )
        if (res) {
          this.stockPriceData = res[0];
          this.createChart("1d");

        }
      })
    } else if (op == "1m") {
      var d = new Date();
      d.setDate(d.getDate()-30);
      console.log(d)
      let month = d.getMonth()+1;
      if (month < 10) {
          // @ts-ignore
        month = "0"+month;
      }
      let from = d.getFullYear()+"-"+month+"-"+d.getDate();
       d = new Date();
       month = d.getMonth()+1;
       if (month < 10) {
           // @ts-ignore
         month = "0"+month;
       }
       let to = d.getFullYear()+"-"+month+"-"+d.getDate();


      console.log(from)
        // @ts-ignore
      this.dataService.getStockChart(this.stock, "history", from, to).subscribe(res => {
        this.cartData = res.data[0].historical;
        console.log(this.cartData)
        if (res) {
          this.stockPriceData = res.data[0].historical;
          this.createChart("history");

        }
      })
      //this.getStockChartData(this.stock, "intraday", "2022-04-01", "2022-04-22");

    } else if (op == "6m") {
      var d = new Date();
      d.setDate(d.getDate()-(30*6));
      console.log(d)
      let month = d.getMonth()+1;
      if (month < 10) {
          // @ts-ignore
        month = "0"+month;
      }
      let from = d.getFullYear()+"-"+month+"-"+d.getDate();
       d = new Date();
       month = d.getMonth()+1;
       if (month < 10) {
           // @ts-ignore
         month = "0"+month;
       }
       let to = d.getFullYear()+"-"+month+"-"+d.getDate();


      console.log(from)
      this.dataService.getStockChart(this.stock, "history", from, to).subscribe(res => {
        this.cartData = res.data[0].historical;
        console.log(this.cartData)
        if (res) {
          this.stockPriceData = res.data[0].historical;
          this.createChart("history");

        }
      })
    } else if (op == "1y") {
      var d = new Date();
      d.setDate(d.getDate()-(30*12));
      console.log(d)
      let month = d.getMonth()+1;
      if (month < 10) {
          // @ts-ignore
        month = "0"+month;
      }
      let from = d.getFullYear()+"-"+month+"-"+d.getDate();
       d = new Date();
       month = d.getMonth()+1;
       if (month < 10) {
           // @ts-ignore
         month = "0"+month;
       }
       let to = d.getFullYear()+"-"+month+"-"+d.getDate();


      console.log(from)
      this.dataService.getStockChart(this.stock, "history", from, to).subscribe(res => {
        this.cartData = res.data[0].historical;
        console.log(this.cartData)
        if (res) {
          this.stockPriceData = res.data[0].historical;
          this.createChart("history");

        }
      })
    } else if (op == "1ytd") {
      var x = new Date();
      let d = new Date(x.getFullYear(), 0,1, 0)
      console.log(d)
      let month = d.getMonth()+1;
      if (month < 10) {
          // @ts-ignore
        month = "0"+month;
      }
      let from = d.getFullYear()+"-"+month+"-"+d.getDate();
       d = new Date();
       month = d.getMonth()+1;
       if (month < 10) {
           // @ts-ignore
         month = "0"+month;
       }
       let to = d.getFullYear()+"-"+month+"-"+d.getDate();


      console.log(from)
      this.dataService.getStockChart(this.stock, "history", from, to).subscribe(res => {
        this.cartData = res.data[0].historical;
        console.log(this.cartData)
        if (res) {
          this.stockPriceData = res.data[0].historical;
          this.createChart("history");

        }
      })
    } else if (op == "all") {
      var x = new Date();
      let d = new Date(1979, 0,1, 0)
      console.log(d)
      let month = d.getMonth()+1;
      if (month < 10) {
          // @ts-ignore
        month = "0"+month;
      }
      let from = d.getFullYear()+"-"+month+"-"+d.getDate();
       d = new Date();
       month = d.getMonth()+1;
       if (month < 10) {
           // @ts-ignore
         month = "0"+month;
       }
       let to = d.getFullYear()+"-"+month+"-"+d.getDate();


      console.log(from)
      this.dataService.getStockChart(this.stock, "history", from, to).subscribe(res => {
        this.cartData = res.data[0].historical;
        console.log(this.cartData)
        if (res) {
          this.stockPriceData = res.data[0].historical;
          this.createChart("history");

        }
      })
    }
    // this.createChart(op);
  }
  private createChart(option): void {
    if (!this.isRendered) {
      this.createSVG();
    }
    console.log(option)
    var staticWidth = 860
    var margin = { top: 10, right: 30, bottom: 30, left: 40 },
      width = staticWidth - margin.left - margin.right,
      height = 300 - margin.top - margin.bottom;

    // this.svg
    //   .append("rect")
    //   .attr("x", 0)
    //   .attr("y", 0)
    //   .attr("height", height + 20)
    //   .attr("width", staticWidth)
    //   .attr("stroke", "black")
    //   .style("fill", "#fff")
    // Show the Y scale

    const xAxis = d3.axisBottom(y).ticks(3, "").tickSizeOuter(0);
    const yAxis = d3.axisLeft(y).ticks(height / 40, "");
    const gap = 12;
    let current = 0;

    let hour = Date.parse(this.cartData[0].date)
    let date = new Date(this.cartData[0].date)
    var x = d3.scaleLinear()
      .domain([9.5, date.getHours() + (date.getMinutes() / 60)])
      .range([0, staticWidth])

    // this.svg.call(d3.axisBottom(x2).scale(x))

  // @ts-ignore
    var x_axis = d3.axisBottom()
      .scale(x).ticks(0);
    let highest = 0;
    let lowest = 100000000;
    let d = ""
    if (option == "1d"){
     d = this.cartData[0].date[8] + this.cartData[0].date[9];
  }
    let index = 0;
      // @ts-ignore
    this.tempData = [];
    let low = this.cartData[0].low;
    let high = this.cartData[0].high;
    let close = this.cartData[0].close;
    let open = this.cartData[0].open;
    let push = true;
    let volume = 0;
      // @ts-ignore
    let day = this.cartData[0].date[8] + this.cartData[0].date[9];
  // @ts-ignore
    for (let i = 0; i < this.cartData.length; i++) {
      let t = this.cartData[i];
      if (option == "1d"){
      if (d != t.date[8] + t.date[9]) {
        index = i - 1;
        break
      }
      if (push == true){
          // @ts-ignore
      this.tempData.push(t);
    }
      d = t.date[8] + t.date[9];
    } else if (option == "1m"){
      if (d != t.date[5] + t.date[6]) {
        index = i - 1;
        break
      }
      d = t.date[5] + t.date[6];
      if (day != t.date[8] + t.date[9]) {
        t.high =  high;
        t.low = low;
        t.open = open;
        t.volume = volume;
          // @ts-ignore
        this.tempData.push(t)
        open = t.close;
        volume = 0;
      }
      day = t.date[8] + t.date[9]

      if (high < t.high) {
        high = t.high;
    }
    if (low > t.low) {
      low = t.low;
    }
    volume += t.volume;
  }
      if (t.high > highest) {
        highest = t.high;
      }
      if (t.low < lowest) {
        lowest = t.low;
      }
    }
    let line_number = height / 20;
    for (let i = 0; i < line_number; i++) {
  // @ts-ignore
      // this.svg
      //   .append("line")
      //   .attr("x1", 0)
      //   .attr("x2", staticWidth)
      //   .attr("y1", height - (i * 20))
      //   .attr("y2", height - (i * 20))
      //   // .attr("y2", height + 20)
      //   .attr("stroke", "grey")
      //   let pix = (highest-(lowest*.99))/280;
      //   let val = highest-(pix*(i*20))
      //     // @ts-ignore
      //   this.svg.append("text")
      //     .attr("x", staticWidth-5)
      //     .attr("y",   (i * 20)-20)
      //     .attr("class", "y-text-val")
      //     .attr("dy", "3em")
      //     .attr("stroke", "grey")
      //     .text(val.toFixed(2));
    }
    line_number = staticWidth / 24;
    if (option == "history") {
      //console.log(this.cartData.length)
        // @ts-ignore
      this.tempData = this.cartData;
    }
    let end_date = new Date(this.cartData[0].date)
    let range = (end_date.getHours() + (end_date.getMinutes() / 60));
    // if (option == "history") {
    //   range = end_date.Date -
    // }
      // @ts-ignore
    let cartData = this.cartData;
      // @ts-ignore
    let tempData = this.tempData;
    //d3.select
      // @ts-ignore
    d3.selectAll("svg").on("mousemove", function(x, this, nodes) {
      let svg = d3.select(this)

      let xx = x.layerX;
      let yy = x.layerY;
      svg.selectAll(".x-line").remove()
      svg.selectAll(".y-line").remove()
      svg.selectAll(".y-text").remove()
      svg.selectAll(".yy-text").remove()

      svg.selectAll(".x-text").remove()
      svg.selectAll(".center-line").remove()
      svg.selectAll(".graph-line").remove()
      let gg = 280;
      let r = highest * 1.5
      let ff = 280/r
        // let time = parseInt(((x.layerX / staticWidth) * range) )
        console.log(tempData.length)
          // @ts-ignore
        let inz = parseInt((1 - (xx/ staticWidth)) * (tempData.length-1))
        if (option != "history") {
            // @ts-ignore
          inz =  parseInt( tempData.length-(xx/ staticWidth) *100)
        }
        console.log(inz)
        let currentTime = new Date(tempData[inz].date)


        let time = currentTime.getHours()
        let minutes = currentTime.getMinutes();
        if (currentTime.getMinutes() < 10) {
            // @ts-ignore
          minutes = "0" + currentTime.getMinutes()
        }
        let tStr = time + ":" + minutes + " AM";
        if (time > 12) {
          time -= 12;
          tStr = time + ":" + minutes + " PM";
        }
        if (time == 12) {
          tStr = time + ":" + minutes + " PM";

        }
        console.log(currentTime)
        if (option == "1m" || option == "history") {
          let month = currentTime.getMonth()+1;
           tStr =  month+"/"+ currentTime.getDate()+"/"+currentTime.getFullYear();
        }

        if (yy <280 && xx <= (staticWidth-60) && yy >=20) {
        svg
          .append("rect")
          .attr("class", "graph-line")
          .attr("x", xx + 2)
          .attr("y", yy - 22)
          .attr("height", 20)
          .attr("width", 60)
          .attr("stroke", "black")
          .style("fill", "#008ffb")
        } else if (yy <280 && yy >=20 && xx >= (staticWidth-60)) {
          svg
            .append("rect")
            .attr("class", "graph-line")
            .attr("x", xx -60)
            .attr("y", yy - 22)
            .attr("height", 20)
            .attr("width", 60)
            .attr("stroke", "black")
            .style("fill", "#008ffb")
        } else if (yy <= 20 && xx >= (staticWidth-60)) {
          console.log("hit")
          svg
            .append("rect")
            .attr("class", "graph-line")
            .attr("x", xx -60)
            .attr("y", yy)
            .attr("height", 20)
            .attr("width", 60)
            .attr("stroke", "black")
            .style("fill", "#008ffb")
        } else if (yy <280 && xx <= (staticWidth-60) && yy<=20) {
          console.log("hiot2")
          svg
            .append("rect")
            .attr("class", "graph-line")
            .attr("x", xx + 2)
            .attr("y", yy)
            .attr("height", 20)
            .attr("width", 60)
            .attr("stroke", "black")
            .style("fill", "#008ffb")
        }
        if (xx >= 65) {
          svg
            .append("rect")
            .attr("class", "center-line")
            .attr("x", xx - 50)
            .attr("y", height + 20)
            .attr("height", 20)
            .attr("width", 65)
            .attr("stroke", "black")
            .style("fill", "#008ffb")
            svg.append("text")
              .attr("x", xx-45)
              .attr("y", height-15)
              .attr("class", "x-text")
              .attr("dy", "3.5em")
              .attr("stroke", "white")
              .text(tStr);
        } else {
          svg
            .append("rect")
            .attr("class", "center-line")
            .attr("x", xx)
            .attr("y", height + 20)
            .attr("height", 20)
            .attr("width", 65)
            .attr("stroke", "black")
            .style("fill", "#008ffb")
            svg.append("text")
              .attr("x", xx)
              .attr("y", height-15)
              .attr("class", "x-text")
              .attr("dy", "3.5em")
              .attr("stroke", "white")
              .text(tStr);
        }

        svg
          .append("line")
          .attr("class", "y-line")
          .attr("x1", xx)
          .attr("x2", xx)
          .attr("y1", 0)
          .style("stroke-dasharray", ("3, 3"))
          .attr("y2", height + 20)
          .attr("stroke", "black")
          let pix = (highest-(lowest*.99))/280;
          let val = highest-(pix*yy)
          if (yy <280 && xx <= (staticWidth-60) && yy >=20) {


        svg.append("text")
          .attr("x", xx)
          .attr("y", yy - 47)
          .attr("class", "y-text")
          .attr("dy", "3em")
          .attr("stroke", "white")
          .text(val.toFixed(2));

        } else if (yy <280 && yy >=20 && xx >= (staticWidth-60)) {
        svg.append("text")
          .attr("x", xx-60)
          .attr("y", yy - 47)
          .attr("class", "y-text")
          .attr("dy", "3em")
          .attr("stroke", "white")
          .text(val.toFixed(2));
        } else if (yy <= 20 && xx >= (staticWidth-60)) {
          svg.append("text")
            .attr("x", xx-60)
            .attr("y", yy-27)
            .attr("class", "y-text")
            .attr("dy", "3em")
            .attr("stroke", "white")
            .text(val.toFixed(2));
        } else if (yy <280 && xx <= (staticWidth-60) && yy<=20) {
          svg.append("text")
            .attr("x", xx)
            .attr("y", yy-27)
            .attr("class", "y-text")
            .attr("dy", "3em")
            .attr("stroke", "white")
            .text(val.toFixed(2));

        }
        if (yy >200 && xx > 70) {
        svg.append("text")
        .attr("x", xx-70)
        .attr("y", yy-120)
          .attr("class", "yy-text")
          .attr("dy", "3em")
          .attr("stroke", "black")
          .text("O: " + tempData[inz].open);

        svg.append("text")
        .attr("x", xx-70)
        .attr("y", yy-100)
          .attr("class", "yy-text")
          .attr("dy", "3em")
          .attr("stroke", "black")
          .text("H: " + tempData[inz].high);

        svg.append("text")
        .attr("x", xx-70)
        .attr("y", yy-80)
          .attr("class", "yy-text")
          .attr("dy", "3em")
          .attr("stroke", "black")
          .text("L: " + tempData[inz].low);

        svg.append("text")
        .attr("x", xx-70)
        .attr("y", yy-60)
          .attr("class", "yy-text")
          .attr("dy", "3em")
          .attr("stroke", "black")
          .text("C: " + tempData[inz].close);
        svg.append("text")
        .attr("x", xx-70)
        .attr("y", yy-40)
          .attr("class", "yy-text")
          .attr("dy", "3em")
          .attr("stroke", "black")
          .text("V: " + tempData[inz].volume);

        } else   if (yy <200 && xx > 70) {
          svg.append("text")
          .attr("x", xx-70)
          .attr("y", yy)
            .attr("class", "yy-text")
            .attr("dy", "3em")
            .attr("stroke", "black")
            .text("O: " + tempData[inz].open);

          svg.append("text")
          .attr("x", xx-70)
          .attr("y", yy+20)
            .attr("class", "yy-text")
            .attr("dy", "3em")
            .attr("stroke", "black")
            .text("H: " + tempData[inz].high);

          svg.append("text")
          .attr("x", xx-70)
          .attr("y", yy+40)
            .attr("class", "yy-text")
            .attr("dy", "3em")
            .attr("stroke", "black")
            .text("L: " + tempData[inz].low);

          svg.append("text")
          .attr("x", xx-70)
          .attr("y", yy+60)
            .attr("class", "yy-text")
            .attr("dy", "3em")
            .attr("stroke", "black")
            .text("C: " + tempData[inz].close);
          svg.append("text")
          .attr("x", xx-70)
          .attr("y", yy+80)
            .attr("class", "yy-text")
            .attr("dy", "3em")
            .attr("stroke", "black")
            .text("V: " + tempData[inz].volume);

          } else if (yy >200 && xx < 70) {
            svg.append("text")
            .attr("x", xx)
            .attr("y", yy-120)
              .attr("class", "yy-text")
              .attr("dy", "3em")
              .attr("stroke", "black")
              .text("O: " + tempData[inz].open);

            svg.append("text")
            .attr("x", xx)
            .attr("y", yy-100)
              .attr("class", "yy-text")
              .attr("dy", "3em")
              .attr("stroke", "black")
              .text("H: " + tempData[inz].high);

            svg.append("text")
            .attr("x", xx)
            .attr("y", yy-80)
              .attr("class", "yy-text")
              .attr("dy", "3em")
              .attr("stroke", "black")
              .text("L: " + tempData[inz].low);

            svg.append("text")
            .attr("x", xx)
            .attr("y", yy-60)
              .attr("class", "yy-text")
              .attr("dy", "3em")
              .attr("stroke", "black")
              .text("C: " + tempData[inz].close);
            svg.append("text")
            .attr("x", xx+70)
            .attr("y", yy-40)
              .attr("class", "yy-text")
              .attr("dy", "3em")
              .attr("stroke", "black")
              .text("V: " + tempData[inz].volume);

            } else   if (yy <200 && xx < 70) {
              svg.append("text")
              .attr("x", xx)
              .attr("y", yy)
                .attr("class", "yy-text")
                .attr("dy", "3em")
                .attr("stroke", "black")
                .text("O: " + tempData[inz].open);

              svg.append("text")
              .attr("x", xx)
              .attr("y", yy+20)
                .attr("class", "yy-text")
                .attr("dy", "3em")
                .attr("stroke", "black")
                .text("H: " + tempData[inz].high);

              svg.append("text")
              .attr("x", xx)
              .attr("y", yy+40)
                .attr("class", "yy-text")
                .attr("dy", "3em")
                .attr("stroke", "black")
                .text("L: " + tempData[inz].low);

              svg.append("text")
              .attr("x", xx)
              .attr("y", yy+60)
                .attr("class", "yy-text")
                .attr("dy", "3em")
                .attr("stroke", "black")
                .text("C: " + tempData[inz].close);
              svg.append("text")
              .attr("x", xx)
              .attr("y", yy+80)
                .attr("class", "yy-text")
                .attr("dy", "3em")
                .attr("stroke", "black")
                .text("V: " + tempData[inz].volume);

              }
          if (yy <280) {

        svg
          .append("line")
          .attr("class", "x-line")
          .attr("x1", 0)
          .attr("x2", staticWidth)
          .attr("y1", yy)
          .attr("y2", yy)
          .attr("stroke", "black")
          .style("stroke-dasharray", ("3, 3"))
        }

    })
      // @ts-ignore
      d3.selectAll(".user-profile-border").on("mouseenter", function(x, this, nodes) {
      let svg = d3.selectAll("svg")
      svg.selectAll(".x-line").remove()
      svg.selectAll(".y-line").remove()
      svg.selectAll(".y-text").remove()
      svg.selectAll(".yy-text").remove()

      svg.selectAll(".x-text").remove()
      svg.selectAll(".center-line").remove()
      svg.selectAll(".graph-line").remove()

    });
    var center = 0;


    var y = d3.scaleLinear()
      .domain([lowest*.99, highest])
      .range([280, 0]);
    // this.svg.call(d3.axisLeft(y))
    let space = 0;
    if (option == "1d") {
      space = staticWidth/(500/5)
    } else if (option == "history"){
        // @ts-ignore
      space = staticWidth/ (this.tempData.length-2.5);
    }
    //console.log( this.tempData)
    //d = this.cartData[0].date[8] + this.cartData[0].date[9];
      // @ts-ignore
    for (let i = this.tempData.length-1; i>0; i--) {
        // @ts-ignore
      let t = this.tempData[i];
      let data = [t.open, t.close, t.high, t.low]
      var data_sorted = data.sort(d3.descending)
      var q1 = d3.quantile(data_sorted, .25)
      var median = d3.quantile(data_sorted, .5)
      var q3 = d3.quantile(data_sorted, .75)
      var interQuantileRange = q3 - q1
      var min = t.low
      var max = t.high
      current += space;
      var center = current
      var width = 5
      let color = "green"
      let fill = "#fff"
      if (t.close >= t.open) {
        color = "green";
        fill = "green"
      } else {
        color = "red";
        fill = "red"
      }
        // @ts-ignore
      // this.
      //   svg
      //   .append("line")
      //   .attr("class","stock")
      //   .attr("x1", center)
      //   .attr("x2", center)
      //   .attr("y1",Math.abs(y(min)))
      //   .attr("y2", Math.abs(y(max)))
      //   .attr("stroke", color)
      //
      // // Show the box
      //   // @ts-ignore
      // this.svg
      //   .append("rect")
      //   .attr("class","stock")
      //   .attr("x", center - width / 2)
      //   .attr("y", Math.abs(y(q3)))
      //   .attr("height", Math.abs(y(q1) - y(q3)))
      //   .attr("width", width)
      //   .attr("stroke", color)
      //   .style("fill", fill)
    }
    // for (let i=0; i < this.cartData.length; i++) {
    //
    // let currentTime = new Date(this.cartData[i].date)
    //
    //
    // let time = currentTime.getHours()
    // let minutes = currentTime.getMinutes();
    // if (currentTime.getMinutes() < 10) {
    //   minutes = "0" + currentTime.getMinutes()
    // }
    // let tStr = time + ":" + minutes + " AM";
    // if (time > 12) {
    //   time -= 12;
    //   tStr = time + ":" + minutes + " PM";
    // }
    // if (time == 12) {
    //   tStr = time + ":" + minutes + " PM";
    //
    // }
    // console.log(currentTime)
    // if (option == "1m" || option == "history") {
    //   let month = currentTime.getMonth()+1;
    //    tStr =  month+"/"+ currentTime.getDate()+"/"+currentTime.getFullYear();
    // }
    // console.log(tStr)
    // let pix = staticWidth/this.cartData.length;
    // let xxx = i*pix
    // console.log(xxx)
    //   this.svg.append("text")
    //     .attr("x", xxx)
    //     .attr("y", height)
    //     .attr("class", "x-texts")
    //     .attr("dy", "3.5em")
    //     .attr("stroke", "black")
    //     .text(tStr);
    //
    //   }

  }
  private drawLine(x) {
      // @ts-ignore
    // this.svg = d3.select(this.svgContainerRef.nativeElement)
    //
    // this.
    //   svg
    //   .append("line")
    //   .attr("x1", x.layerX)
    //   .attr("x2", x.layerX)
    //   .attr("y1", 0)
    //   .attr("y2", x.layerY)
    //   .attr("stroke", "black")
  }
}
