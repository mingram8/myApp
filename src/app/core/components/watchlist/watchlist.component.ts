import { Component, ElementRef, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthenticationService, DataService } from '../../../core/services';
@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  host: {
    '(document:click)': 'onClick($event)',
  },
  styleUrls: ['./watchlist.component.css']
})
export class WatchlistComponent implements OnInit {
  environment = environment;
  keyword = '';
  inputContent : any
  watchList: any
  sortType: any = "MySort";
  enableEdit: boolean = false;
  storageData = this.authenticationService.currentUserValue;
  userDetail;
  showData: boolean = false;
  showStockSearch: boolean = false;
  showUserSearch: boolean = false;

  stocksData = [];
  usersData = [];
  resultData = [];

  constructor(private dataService: DataService, private authenticationService: AuthenticationService, private _eref: ElementRef) {
    this.authenticationService.currentUser.subscribe(
      res => {
        this.userDetail = res;
      }
    );
   }

  ngOnInit(): void {
    this.getWatchlist();
  }

  onClick(event) {
    if (event.target.id != 'myInputWatchlist') {
      this.showData = false;
    }
  }

  enableEditMode() {
    this.enableEdit = !this.enableEdit;
  }

  onChangeSearch() {
    this.showData = true;
    let val = this.keyword;
    const first_char_of_search = val.charAt(0);
    var splitted = val.split(first_char_of_search, 2);
    var search_text = splitted[1];
    if (first_char_of_search == "$") {
      this.showStockSearch = false;
      this.getSearchResults('people', search_text);
    } else {
      this.showStockSearch = true;
      this.getSearchResults('', val);
    }


    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
  }

  getSearchResults(type, search_text) {

    let payload = {
      "stock": search_text
    }


      this.searchStocks(payload);

    this.stocksData = this.resultData['stock'];

    return this.resultData;
  }

  searchStocks(payload) {
    this.dataService.searchStocks(payload)
      .subscribe(res => {
        this.resultData['stock'] = res;

        this.stocksData = this.resultData['stock'].slice(0, 5);
      });
  }


  getWatchlist()
  {
    try {
      this.dataService.getWatchlist(this.userDetail['id'],this.sortType)
        .subscribe(res => {
          this.watchList = res;

          if (this.watchList) {

            this.watchList.forEach(element => {
              element.priceChange = '';
              element.changeInPrice = 0;
              element.changeInPercentage = 0;


              if (element.open < element.close) {
                element.priceChange = 'up';
                element.changeInPrice = element.close - element.open;
                element.changeInPercentage = ((element.close - element.open) / element.open * 100);
              } else if(element.open > element.close) {
                element.priceChange = 'down';
                element.changeInPrice = element.close - element.open;
                element.changeInPercentage = ((element.close - element.open) / element.open * 100);
              }

            });
          }
        });

    } catch (error) {
      this.authenticationService.setValueOfIsLoggedInCheckSubject = false;
    }
  }

  addWatchList(stock){
    let storageData = this.authenticationService.currentUserValue;

    let payload = {
      "stock": stock,
      "user":storageData['id']
    }

    this.dataService.addWatchList(payload)
    .subscribe(res => {
      this.getWatchlist();
    });
  }

  removeWatchList(stock) {
    let storageData = this.authenticationService.currentUserValue;

    let payload = {
      "stock": stock,
      "user": storageData['id']
    }

    this.dataService.removeWatchList(payload)
      .subscribe(res => {
        this.getWatchlist();
      });
  }









}
