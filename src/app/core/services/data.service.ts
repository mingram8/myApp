import { Injectable, resolveForwardRef } from '@angular/core';
import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import { BehaviorSubject, Observable, pipe } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthenticationService } from "./authentication.service";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class DataService {


  constructor(
    private http: HttpClient,
    private authenticationService: AuthenticationService,
    ) {

    }

    getHeaders() {
      const storageData = this.authenticationService.currentUserValue;

      type bodyType = 'body';

      return {
        headers: new HttpHeaders({
        'Authorization': 'JWT ' + (storageData == null ? '' : storageData.token)
      }),
      observe: <bodyType>'response'
    };
  }

  uploadImage(file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    formData.append('pic', file);

    // const req = new HttpRequest('POST', `${environment.server}/upload`, formData);

       return this.http.post<any>(`${environment.server}/upload`, formData)
        .pipe(map(user => {
          user = user;
          return user;
        }));

    // return this.http.request(req);
  }

  updateUser(payload)
  {
    const body = payload;




    const httpOptions = this.getHeaders();

    return this.http.post<any>(`${environment.server}/updateUser`, body, httpOptions)
      .pipe(map(user => {
        user = user.body;
      return user;
      }));
  }



  changePassword(payload)
  {
    const body = {"confirm_password": payload.confirm_password, "new_password": payload.new_password};

    const httpOptions = this.getHeaders();

    return this.http.post<any>(`${environment.server}/changePassword`, body, httpOptions)
      .pipe(map(user => {
        user = user.body;
      return user;
      }));
  }

  getCompanyNews(stock) {
    let header = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    }

    return this.http.get<any>(`${environment.server}/getStockNews?stock=${stock}&limit=10`, header)
    return this.http.get<any>(`${environment.server}/getCompanyNews?stock=AAPL&limit=5`, header)
      .pipe(map(res => {
        return res;
      }));
  }



  addPost(payload)
  {
    const httpOptions = this.getHeaders();
    const body = payload;
    return this.http.post<any>(`${environment.server}/commentStock`, body, httpOptions)
      .pipe(map(res => {
        return res;
      }));
  }


  deletePost(payload)
  {
    const httpOptions = this.getHeaders();
    const body = payload;
    return this.http.post<any>(`${environment.server}/deleteStockComment`, body, httpOptions)
      .pipe(map(res => {
        return res;
      }));
  }


  addReply(payload)
  {
    const headers = { 'Content-Type': 'application/json' }
    const body = payload;
    const httpOptions = this.getHeaders();
    return this.http.post<any>(`${environment.server}/replyCommentStock`, body, httpOptions)
      .pipe(map(res => {
        return res;
      }));
  }


  addWatchList(payload)
  {
    const headers = { 'Content-Type': 'application/json' }
    const body = payload;

    const httpOptions = this.getHeaders();

    return this.http.post<any>(`${environment.server}/addWatchlist`, body, httpOptions)
      .pipe(map(res => {
        return res;
      }));
  }



  removeWatchList(payload) {
    const body = payload;

    const httpOptions = this.getHeaders();
    return this.http.post<any>(`${environment.server}/removeWatchlist`, body, httpOptions)
      .pipe(map(res => {
        return res;
      }));
  }

  reactCommentStock(payload) {
    const body = payload;
    const httpOptions = this.getHeaders();

    return this.http.post<any>(`${environment.server}/reactCommentStock`, body, httpOptions)
      .pipe(map(res => {
        return res;
      }));
  }


  getAllStockComments(page)
  {
    const headers = { 'Content-Type': 'application/json' }
    const body = {};
    return this.http.get<any>(`${environment.server}/getAllStockComments?page=${page}&limit=${3}`, body)
      .pipe(map(res => {
        return res;
      }));
  }


  getCurrentUserDetails()
  {
    const headers = { 'Content-Type': 'application/json' }
    const storageData = this.authenticationService.currentUserValue;
    const user = storageData;
    type bodyType = 'body';


    // upload file to the pre-signed url
    const httpOptions = this.getHeaders();


  const body = {};
  return this.http.get<any>(`${environment.server}/getCurrentUser`, httpOptions)
  .pipe(map(res => {
        // localStorage.setItem('currentUser', JSON.stringify(res.body)); // need to UNcomment when we start receiving token in this api
        res.body.token = this.authenticationService.currentUserValue.token;
        this.authenticationService.setValueOfCurrentUserSubject = res.body;
        localStorage.setItem('currentUser', JSON.stringify(res.body));
        return res.body;

      }));
  }


  getUserDetails(username: string) {
    const headers = { 'Content-Type': 'application/json' }
    const storageData = this.authenticationService.currentUserValue;
    let user = storageData;
    type bodyType = 'body';
    // upload file to the pre-signed url
    const httpOptions = this.getHeaders();
    const body = {};
    return this.http.get<any>(`${environment.server}/getUser?username=${username}`,httpOptions)
      .pipe(map(res => {
        return res.body;
      }));
      // .toPromise();
  }

  //https://www.alphavantage.co/query?function=OVERVIEW&symbol=IBM&apikey=demo
  getStockDataByTicker()  {
    let header = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    }



    return this.http.get<any>("https://www.alphavantage.co/query?function=OVERVIEW&symbol=IBM&apikey=demo", header)
      .pipe(map(res => {
        return res;
      })).toPromise();

  }

  getAllStocks() {
    let header = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    }

    return this.http.get<any>(`${environment.server}/getAllStocks?limit=5`, header)
      .pipe(map(res => {
        return res;
      }));

  }

  getStocksLive() {
    let header = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    }

    return this.http.get<any>(`${environment.server}/stockIndexes?limit=5`, header)
      .pipe(map(res => {
        return res.data;
      }));

  }

  getTrendingStocks() {
    let header = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    }

    return this.http.get<any>(`${environment.server}/trendingStock?limit=5`, header)
      .pipe(map(res => {
        return res.data;
      }));

  }

  getMarketTimings() {
    let header = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    }

    return this.http.get<any>(`${environment.server}/marketTimings`, header)
      .pipe(map(res => {
        return res.data;
      }));

  }


  getAllTrendingStocks() {
    let header = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    }

    return this.http.get<any>(`${environment.server}/trendingStock`, header)
      .pipe(map(res => {
        console.log(res)
        return res.data;
      }));

  }

  searchStocks(payload) {
    let header = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    }
    let stock = payload.stock;

    return this.http.get<any>(`${environment.server}/searchStock?stock=${stock}&limit=5`, header)
      .pipe(map(res => {
        return res;
      }));
  }

  searchGifs(payload) {

    let keyword = payload.keyword;

    let url = '';
    if (keyword == "") {
      url = `http://api.giphy.com/v1/gifs/trending?api_key=230RqXewgheWE17cL1kooOUSNOtn4ElI&limit=12`;
    } else {
      url = `http://api.giphy.com/v1/gifs/search?api_key=230RqXewgheWE17cL1kooOUSNOtn4ElI&limit=12&q=${payload.keyword}`;
    }
    return this.http.get<any>(url)
      .pipe(map(res => {
        return res.data;
      }));
  }

  searchUsers(payload) {
    let header = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    }
    let stock = payload.stock;
    return this.http.get<any>(`${environment.server}/searchUser?q=${stock}&limit=5`, header)
      .pipe(map(res => {
        return res;
      }));
  }

  getNews() {
    let header = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    }

    return this.http.get<any>(`${environment.server}/getNews?limit=5`, header)
      .pipe(map(res => {
        return res.data;
      }));
  }

  // getReportsData(stock) {
  //   let header = {
  //     headers: new HttpHeaders({
  //       'Content-Type': 'application/json',
  //       /*'Authorization': 'Bearer ' + localStorage.getItem('currentUser'),*/
  //     })
  //   }
  //   return this.http.get<any>(`${environment.server}/getCompanyNews?stock=${stock}&limit=5`, header)
  //     .pipe(map(res => {
  //       return res;
  //     }));
  // }

  getReportsData(qryParam) {
    let header = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        /*'Authorization': 'Bearer ' + localStorage.getItem('currentUser'),*/
      })
    }


    return this.http.get<any>(`${environment.server}/getStockNews?stock=${qryParam}&limit=5`, header)
      .pipe(map(res => {
        return res.data;
      }));
  }

  //stock info api
  //get current stock comments
  getStockComments(stock)
  {
    let header = {
      headers: new HttpHeaders({
        'Content-type' : 'application/json',
      })
    }
    // return this.http.get<any>(`${environment.server}/getStockComments?stock=AAPL`, header).pipe(map(res => {
    return this.http.get<any>(`${environment.server}/getStockComments?stock=${stock}`, header).pipe(map(res => {
      // //console.log(res.reactions);
      // if (res.reactions) {
      //   res.reactions.map(reactions=>{
      //     reactions.map()
      //     return {...reactions};
      //   });
      // }
      return res.data.map(reactions => {
        let calcLikeCount = 0;
        return {...reactions, likeCount: calcLikeCount};
      });
    }));
  }

  getStock(stock) {


    const httpOptions = this.getHeaders();

    return this.http.get<any>(`${environment.server}/getStock?stock=${stock}`, httpOptions).pipe(map(res => {
      console.log(res)
      return res;
    }));
  }
  getBlogs() {
    const httpOptions = this.getHeaders();

    return this.http.get<any>(`${environment.server}/getBlogs?next_page=1&limit=10`, httpOptions).pipe(map(res => {
      console.log(res)
      return res.body;
    }));
  }
  getMessages() {
    const httpOptions = this.getHeaders();
    const storageData = this.authenticationService.currentUserValue;
    let userData = storageData;
    let user_id = userData['id'];
    return this.http.get<any>(`${environment.server}/getMessages`, httpOptions).pipe(map(res => {
      console.log(res)
      return res.body;
    }));
  }

  sendMessage(payload) {
    const httpOptions = this.getHeaders();

    const body = payload;
    return this.http.post<any>(`${environment.server}/sendMessage`, body, httpOptions).pipe(map(res => {
      return res.body;
    }));
  }

  getChat(sender_id) {
    const httpOptions = this.getHeaders();

    const body = {
      "receiver": sender_id
    };
    return this.http.post<any>(`${environment.server}/getChat`, body, httpOptions).pipe(map(res => {
      return res.body;
    }));
  }

  getBlogDetail(id:string) {
    const httpOptions = this.getHeaders();

    return this.http.get<any>(`${environment.server}/getBlogPost?id=${id}&next_page=1&limit=10`, httpOptions).pipe(map(res => {
      console.log(res)
      return res.body.data;
    }));
  }
  getStockChart(stock, series, from, to) {


    const httpOptions = this.getHeaders();

    if (series == "history") {
    return this.http.get<any>(`${environment.server}/stockChart?stock=${stock}&type=history&from=${from}&to=${to}`, httpOptions).pipe(map(res => {
      return res.body;
    }));
  } else {
    return this.http.get<any>(`${environment.server}/stockChart?stock=${stock}&type=intraday&from=${from}&to=${to}`, httpOptions).pipe(map(res => {
      return res.body;
    }));
  }
  }


  getStockPrices(stock) {


    const httpOptions = this.getHeaders();


    // return this.http.get<any>(`${environment.server}/stockPrices?stock=AAPL`, httpOptions).pipe(map(res => {
      return this.http.get<any>(`${environment.server}/stockPrices?stock=${stock}`, httpOptions).pipe(map(res => {
      return res.data;
    }));
  }

  //get stockinfo
  getStockInfo(stock) {
    let header = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    }

    return this.http.get<any>(`${environment.server}/stockInfo?stock=${stock}`, header)
      .pipe(map(res => {
        return res.data;
      }));
  }

  //get current stock comments
  getWatchlist(id,sortType:string)
  {
    const headers = { 'Content-Type': 'application/json' }
    const body = {};

    return this.http.get<any>(`${environment.server}/getWatchList?id=${id}&sort=${sortType}`, body)
      .pipe(map(res => {
        return res.data;
      }));
  }


  //get blog post getBlogPost
  getLatestBlogs(id)
  {
    let header = {
      headers : new HttpHeaders({
        'Content-type' : 'application/json',
      })
    }
    return this.http.get<any>(`${environment.server}/getUserStockComments?id=${id}`, header).pipe(map(res => {
      return res.data;
    }))
  }

  getFollower(id)
  {
    const headers = { 'Content-Type': 'application/json' }
    const httpOptions = this.getHeaders();

    return this.http.get<any>(`${environment.server}/getFollowers?next_page=1&limit=1&id=${id}`, httpOptions).pipe(map(res => {
      return res.body;
    }));
  }

  getFollowings(id) {
    const headers = { 'Content-Type': 'application/json' }
    const httpOptions = this.getHeaders();

    return this.http.get<any>(`${environment.server}/getFollowings?next_page=1&limit=1&id=${id}`, httpOptions).pipe(map(res => {
      return res.body;
    }));
  }

  followUser(payload) {
    const body = {
      "follow": payload.id
    };
    const httpOptions = this.getHeaders();

    return this.http.post<any>(`${environment.server}/followUser`, body, httpOptions).pipe(map(res => {
      return res.body;
    }));
  }
  unfollowUser(payload) {
    const body = {
      "follow": payload.id
    };
    const httpOptions = this.getHeaders();

    return this.http.post<any>(`${environment.server}/unfollowUser`, body, httpOptions).pipe(map(res => {
      return res.body;
    }));
  }
  //get my post
  getMyPost(id)
  {
    let header = {
      headers: new HttpHeaders({
        'Content-type' : 'application/json',
      })
    }
    return this.http.get<any>(`${environment.server}/getUserStockComments?id=${id}`, header).pipe(map(res => {
      return res;
    }));
  }
}
