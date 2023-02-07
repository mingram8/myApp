import { Component, OnInit } from '@angular/core';
import {AuthenticationService, DataService} from '../../services';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  environment = environment;
  followers: any = [];
  followings: any = [];
  myPost: any = [];
  watchList:any = [];
  customOptions: OwlOptions = {
      loop: true,
      mouseDrag: false,
      touchDrag: false,
      pullDrag: false,
      dots: false,
      navSpeed: 700,
      navText: ['Previous', 'Next'],
      responsive: {
        0: {
          items: 1
        },
        150: {
          items: 2
        },
        220: {
          items: 3
        },
        340: {
          items: 4
        }
      },
      nav: true
  }
  userdetail: any;
  isSelfProfile: boolean = false;
  watchListLength: number;
  myPostLength: number;
  username: string;
  follwingsLenght: number;
  currentUserId: string;
  keyword = '';
  inputContent : any;
  sortType: string = 'MySort';
  enableEdit: boolean = false;

  showData: boolean = false;
  showStockSearch: boolean = false;
  showUserSearch: boolean = false;
  storageData = this.authenticationService.currentUserValue;
  userDetail = this.storageData;
  stocksData = [];
  usersData = [];
  resultData = [];
  myPostData = { isUserPost: true, posts: undefined};

  constructor(private dataService: DataService, private activatedRoute: ActivatedRoute, private authenticationService: AuthenticationService) {
    this.authenticationService.currentUser.subscribe(
      res => {
        this.userdetail = res;
      }
    );
    activatedRoute.params.forEach(params => {
      this.ngOnInit();
    });
   }


  ngOnInit(): void {

    if (localStorage.getItem('currentUser')) {
      this.authenticationService.setValueOfIsLoggedInCheckSubject = true;
    }

    this.activatedRoute.paramMap.subscribe(params => {
      this.username = params.get('username');
    });

    var currentUserJson = localStorage.getItem('currentUser');

    if (currentUserJson != null) {
      this.authenticationService.setValueOfCurrentUserSubject = JSON.parse(currentUserJson);
      var currentUserDetail = JSON.parse(currentUserJson);
      this.currentUserId = currentUserDetail['id'];

    } else {
       this.currentUserId = '';
    }

    this.getUserDetails();
  }

  enableEditMode() {
    this.enableEdit = !this.enableEdit;
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


  getWatchlist() {
    try {
      this.dataService.getWatchlist(this.userDetail['id'],this.sortType)
        .subscribe(res => {
          this.watchList = res;
          this.watchListLength = res.length;
          if (this.watchList) {

            this.watchList.forEach(element => {
              element.priceChange = '';
              element.changeInPrice = 0;
              element.changeInPercentage = 0;

              if (element.prices.change > 0) {
                element.priceChange = 'up';
                element.changeInPrice = element.prices.change;
                element.changeInPercentage = element.prices.changesPercentage;
              } else if (element.prices.change < 0) {
                element.priceChange = 'down';
                element.changeInPrice = element.prices.change;
                element.changeInPercentage = element.prices.changesPercentage;
              }

            });
          }
          //console.log(this.watchList)
        });

    } catch (error) {
      this.authenticationService.setValueOfIsLoggedInCheckSubject = false;
    }
  }
  addWatchList(stock) {
    let storageData = this.authenticationService.currentUserValue;
    this.showData = false;
    let payload = {
      "stock": stock,
      "user": storageData['id']
    }

    this.dataService.addWatchList(payload)
      .subscribe(res => {
        this.getWatchlist();
      });
  }

  getUserDetails(){

    this.dataService.getUserDetails(this.username)
    .subscribe(
      res => {
        this.userdetail = res;
        this.isSelfProfile = (res.id == this.currentUserId) ? true : false;
        //console.log(this.isSelfProfile)
        this.getFollowers(); //get follower list
        this.getFollowings(); //get follower list
        this.getMyPost(); //get my post
        this.getWatchlist(); //get my post

      }
    );
  }


  getFollowers()
  {
    this.dataService.getFollower(this.userdetail.id).subscribe(res => {
      this.followers = res;
      console.log(this.followers)
    });
  }

  getFollowings()
  {
    this.dataService.getFollowings(this.userdetail.id).subscribe(res => {
      this.followings = res;
      this.follwingsLenght = (this.followings instanceof Array) ? this.followings.length : 0;
    });
  }

  followUser(id)
  {
    let storageData = this.authenticationService.currentUserValue;

    if (!storageData) {
      this.authenticationService.setValueOftriggerLoginSubject = true;
      return false;
    }

    var payload = {
      id : id
    }
    this.dataService.followUser(payload).subscribe(res => {

      this.getUserDetails();
    });
  }

  unfollowUser(id)
  {
    let storageData = this.authenticationService.currentUserValue;

    if (!storageData) {
      this.authenticationService.setValueOftriggerLoginSubject = true;
      return false;
    }

    var payload = {
      id : id
    }
    this.dataService.unfollowUser(payload).subscribe(res => {

      this.getUserDetails();
    });
  }

  getMyPost()
  {
    this.dataService.getMyPost(this.userdetail.id).subscribe(res => {
      this.myPost = res;
      this.myPostData.posts = this.myPost;

      this.myPostLength = (this.myPost instanceof Array) ? this.myPost.length : 0;
    });
  }
}
