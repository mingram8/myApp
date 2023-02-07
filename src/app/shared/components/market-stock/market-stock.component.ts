import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { DataService } from 'src/app/core/services';
import { DatePipe, formatDate } from '@angular/common'
import { interval, Subscription } from 'rxjs';
import * as moment from 'moment';

@Component({
  selector: 'app-market-stock',
  templateUrl: './market-stock.component.html',
  styleUrls: ['./market-stock.component.css']
})
export class MarketStockComponent implements OnInit, OnDestroy {
  trendingStocks:any = [];
  topMover:any = [];
  topLoser:any = [];
  mostTalkedOfDay:any = [];
  stockData:any = [];
  date: Date;
  refreshTimeSubscription: Subscription;
  market_open_text: string;
  marketOpenTime: any;
  marketCloseTime: any;
  convertTime12to24 = (time12h) => moment(time12h, 'hh:mm A').format('HH:mm');

  constructor(private dataService: DataService, private http: HttpClient, public datepipe: DatePipe) { }

  ngOnInit(): void {

    this.getTrendingStocks();
    this.refreshTime();
    this.getMarketTimings();
  }

  getMarketTimings() {
    this.dataService.getMarketTimings()
      .subscribe(res => {
        console.log(res)
        this.marketOpenTime = this.convertTime12to24(res.stockMarketHours.openingHour.slice(0,10).split('.').join(""));
        this.marketCloseTime = this.convertTime12to24(res.stockMarketHours.closingHour.slice(0,10).split('.').join(""));

        this.market_open_text = this.getMarketOpenText()
      });
  }



  // formatTime(time) {
  //   //console.log(time)
  //     var hours = Number(time.match(/^(\d+)/)[1]);
  //     var minutes = Number(time.match(/:(\d+)/)[1]);
  //     var AMPM = time.match(/\s(.*)$/)[1];

  //     if (AMPM == "am" && hours < 12) hours = hours + 12;
  //     if (AMPM == "pm" && hours == 12) hours = hours - 12;
  //     var sHours = hours.toString();
  //     var sMinutes = minutes.toString();
  //     if (hours < 10) sHours = "0" + sHours;
  //     if (minutes < 10) sMinutes = "0" + sMinutes;

  //   alert(sHours + ":" + sMinutes);
  // }

  ngOnDestroy(): void {
    this.refreshTimeSubscription.unsubscribe();
  }

  getTrendingStocks(){
    this.dataService.getStocksLive()
      .subscribe(res => {
        this.stockData = res;
        //console.log(this.stockData)
        // this.stockData = this.stockData.sort((a, b) => parseFloat(a.high) - parseFloat(b.high));
        if (this.stockData.length >= 5) {
          this.stockData = this.stockData.slice(0,5);
        }

        this.stockData.forEach(element => {
          element.priceChange = '';
          element.changeInPrice = 0;
          element.changeInPercentage = 0;

          if (element.change > 0) {
            element.priceChange = 'up';
            element.changeInPrice = element.change;
            element.changeInPercentage = element.changesPercentage;
          } else if(element.change < 0) {
            element.priceChange = 'down';
            element.changeInPrice = element.change;
            element.changeInPercentage = element.changesPercentage;
          }

        });
      });
  }

  refreshTime() {



    // Create an Observable that will publish a value on an interval
    const secondsCounter = interval(1000*60);
    // Subscribe to begin publishing values
    this.refreshTimeSubscription = secondsCounter.subscribe(() =>
      this.market_open_text = this.getMarketOpenText());
  }

  getMarketOpenText() {
    this.date = new Date();

    var inputJSON = {
      "created_date": formatDate(this.date, 'yyyy/MM/dd ', 'en-US', '-0500') + " " + this.marketOpenTime + ":00",
      "current_time": formatDate(this.date, 'yyyy/MM/dd H:m:s', 'en-US', '-0500')
    };

    inputJSON.created_date = inputJSON.created_date;

    function getDataDiff(startDate, endDate) {
      var diff = endDate.getTime() - startDate.getTime();
      var days = Math.floor(diff / (60 * 60 * 24 * 1000));
      var hours = Math.floor(diff / (60 * 60 * 1000)) - (days * 24);
      var minutes = Math.floor(diff / (60 * 1000)) - ((days * 24 * 60) + (hours * 60));
      var seconds = Math.floor(diff / 1000) - ((days * 24 * 60 * 60) + (hours * 60 * 60) + (minutes * 60));
      return { day: days, hour: hours, minute: minutes, second: seconds };
    }
    var diff = getDataDiff(new Date(inputJSON.created_date), new Date(inputJSON.current_time));
    var diff_close = getDataDiff(new Date(formatDate(this.date, 'yyyy/MM/dd ', 'en-US', '-0500') + " " + this.marketCloseTime + ":00"), new Date(inputJSON.current_time));

    if (diff.day == -1) {
      diff.hour = 24 - diff.hour;


      if (diff.minute > 0) {
        diff.minute = 60 - diff.minute;
        diff.hour--;
      }
      if (diff.second) {
        diff.second = 60 - diff.second;
      }
    }

    if (diff_close.day == -1) {
      diff_close.hour = 24 - diff_close.hour;


      if (diff_close.minute > 0) {
        diff_close.minute = 60 - diff_close.minute;
        diff_close.hour--;
      }
      if (diff_close.second) {
        diff_close.second = 60 - diff_close.second;
      }
    }

    // Create an Observable that will publish a value on an interval

    if (diff.day == -1) {
      this.market_open_text = "US Market will open in " + diff.hour  + " hours " + diff.minute + " minutes " ;
    } else {
      this.market_open_text = "US Market will close in " + diff_close.hour + " hours " + diff_close.minute + " minutes "  ;
    }

    return this.market_open_text;
  }

}
