import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthenticationService, DataService } from "../../../core/services";
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-header',
  host: {
    '(document:click)': 'onClick($event)',
  },
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  environment = environment;
  marketNews: any = [];
  user = "";
  keyword = '';
  stocksData = [];
  usersData = [];
  resultData = [];
  showData: boolean = false;
  showStockSearch: boolean = false;
  showUserSearch: boolean = false;
  userdetail: any;
  currentUser: string;
  // @ViewChild('loginOpenButton') loginOpenButton: HTMLAnchorElement;
  // @ViewChild('registerOpenButton') registerOpenButton: HTMLAnchorElement;
  showit: boolean;

  constructor(private el: ElementRef,private authenticationService: AuthenticationService, private router: Router, private dataService: DataService) {
    this.user = this.authenticationService.currentUserValue;
    this.authenticationService.currentUser.subscribe(
      res => {
        this.userdetail = res;
      }
    );
  }


  onClick(event) {


    // try {



    var element = document.getElementById('header-search-box');

    let header_search_box = this.el.nativeElement.querySelector("li#header-search-box");

    if (event.isTrusted && event.target.id == "myCloseBtn") {
      this.showData = false;
      let searchbox = this.el.nativeElement.querySelector("div#searchBox");
      searchbox.classList.remove('input');
    } else if (!header_search_box.contains(event.target)) {
      this.showData = false;
      let searchbox = this.el.nativeElement.querySelector("div#searchBox");
      searchbox.classList.remove('input');
    }
    // if (element != null) {

    //   // if (element != event.target || !element.contains(event.target)) // or some similar check
    //   //   this.showData = false;
    // }




    // }  catch(error) {
    // //console.log(error.name+ " In Closing Search droplist of comments section");
    // }
  }

  openModal(modalName: string) {
    let element: any;
    if (modalName == 'signin') {
      let element: HTMLElement = document.getElementById('loginOpenButton') as HTMLElement;
      element.click();
    } else {
      let element: HTMLElement = document.getElementById('registerOpenButton') as HTMLElement;
      element.click();
    }
  }

  ngOnInit(): void {

    this.currentUser = localStorage.getItem('currentUser');

    var i = 0;
    this.authenticationService.triggerLogin.subscribe(isLoggedIn => {
      if (i != 0) {
        this.openModal('signin');
      }
      i++;
    });




    this.getSearchResults('', '');
    this.showStockSearch = true;
    this.showUserSearch = true;

  }

  logout() {
    this.authenticationService.logout();
    window.location.href = '/';
  }

  selectEvent() {
  }

  onChangeSearch() {
    this.showData = true;
    let val = this.keyword;
    const first_char_of_search = val.charAt(0);
    var splitted = val.split(first_char_of_search, 2);
    var search_text = splitted[1];
    if (first_char_of_search == "$") {
      this.showUserSearch = false;
      this.getSearchResults('stock', search_text);
    } else if (first_char_of_search == "@") {
      this.showStockSearch = false;
      this.getSearchResults('people', search_text);
    } else if (first_char_of_search != "$" && first_char_of_search != "@") {
      this.showStockSearch = true;
      this.showUserSearch = true;
      this.getSearchResults('', val);
    }


    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
  }

  onFocused() {
    this.showData = true;
  }

  focusOutFunction() {
    document.getElementById("myCloseBtn").click();
  }

  getSearchResults(type, search_text) {

    let payload = {
      "stock": search_text
    }


    if (type == 'stock') {
      this.searchStocks(payload);
    } else if (type == 'people') {
      this.searchUsers(payload);
    } else if (type == '') {
      this.searchStocks(payload);
      this.searchUsers(payload);
    }
    console.log(  this.resultData )


  //  this.resultData = this.resultData["data"]
    console.log(  this.resultData )
    if (this.resultData['user'] != undefined && this.resultData['user'].length > 0) {
      this.usersData = this.resultData['user'].data.slice(0,5);
    }

    if (this.resultData['stock'] != undefined && this.resultData['stock'].length > 0) {
      this.stocksData = this.resultData['stock'].data.slice(0,5);
    }

    return this.resultData;
  }

  searchStocks(payload) {
    this.dataService.searchStocks(payload)
      .subscribe(res => {
        this.resultData['stock'] = res;

        this.stocksData = this.resultData['stock'].data.slice(0, 5);
      });
  }

  searchUsers(payload) {
    this.dataService.searchUsers(payload)
      .subscribe(res => {
        this.resultData["user"] = res;
        if (this.resultData["user"].length > 0) {
          this.usersData = this.resultData['user'].data.slice(0, 5);
        }
      });
  }


}
