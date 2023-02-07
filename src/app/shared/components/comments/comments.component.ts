import { Component, ElementRef, HostListener, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { interval } from 'rxjs';
import { count, debounce } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/core/services';
import { DataService } from 'src/app/core/services/data.service';
import { SafeHtmlPipe } from 'src/app/safe-html.pipe';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-comments',
  host: {
    '(document:click)': 'onClick($event)',
  },
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})

export class CommentsComponent implements OnInit {


  environment = environment;
  message: any;
  loading: boolean;
  postCreated: boolean = false;
  postForm: UntypedFormGroup;
  alertData = {
    text: '',
    cssClass: ''
  };
  showData: boolean;
  commentDiv: string = '';
  stocksData = [];
  usersData = [];
  storageData = this.authenticationService.currentUserValue;
  userdetail;
  resultData = [];
  showStockSearch: boolean = false;
  showUserSearch: boolean = false;
  keyword = '';
  comment: string = '';
  @Input() stock;
  @Input() myPostData;
  postsData = [];
  feeling:string = 'Natural';
  reply_prediction_type: any;
  stored_comment: string = '';
  stocksArray: string [] = [];
  isUserPost: boolean = false;
  interval: any;
  gifData: any;
  gifUrl: string;
  @ViewChild('closeGifModal') closeModal: ElementRef;
  @ViewChild('imgClose') imgClose: ElementRef;
  @ViewChild('postOverflow', { static: false }) private postOverflow: ElementRef<HTMLDivElement>;
  isTestDivScrolledIntoView: boolean;
  page: number = 1;
  timerid: any;
  // @HostListener('window:scroll', ['$event'])


  ngOnInit(): void {
    this.initializeForm();

    // this.stock = this.stock == undefined || this.stock == null ? '' : this.stock;
    if (!this.myPostData) {

      if (this.stock != undefined && this.stock != "") {
        this.getStockComments(this.stock);
      }
      else {
        this.getAllStockComments(1);
      }

    }

    this.interval = setInterval(() => {
      if (this.myPostData !== undefined && this.myPostData.isUserPost) {
        this.isUserPost = this.myPostData.isUserPost;
        if (this.myPostData.posts != undefined) {
          this.manipulateComments(this.myPostData.posts);
          clearInterval(this.interval);
        }
      }
    }, 1000);
  }




  constructor(private dataService: DataService, private authenticationService: AuthenticationService, private formBuilder: UntypedFormBuilder, private _eref: ElementRef) {
    this.authenticationService.currentUser.subscribe(
      res => {
        this.userdetail = res;
      }
    );


  }

  isScrolledIntoView(elem) {

    let scrollTop = this.postOverflow.nativeElement.scrollTop;

    let totalHeight = this.postOverflow.nativeElement.scrollHeight;
    if (elem.target.id == 'postOverflow') {

      if (scrollTop + 406 >= totalHeight) {

        if (this.timerid !== null) {
          clearTimeout(this.timerid);
        }
        this.timerid = setTimeout(() => {
          this.timerid = null;
          this.page++;
          this.getAllStockComments(this.page);
        }, 400);

        }

    }

  }

  closeImage() {
    var close_image = document.getElementById('close_img');
    if (close_image != null) {
      close_image.style.display = 'none';
    }

    var elem = document.getElementById('gifImage');
    if (elem != null) {
      elem.style.display = 'none';
    }
  }

  performSearch(searchTerm: HTMLInputElement): void {

    let keyword = searchTerm != undefined ? searchTerm.value : '';
    let payload = {
      'keyword' : keyword
    }

    this.dataService.searchGifs(payload)
      .subscribe(res => {
        this.gifData = res;
      });

  }

  selectGif(image:string) {
    this.closeModal.nativeElement.click();
    this.gifUrl = image;

    var close_image = document.getElementById('close_img');
    if (close_image != null) {
      close_image.style.display = 'block';
    }

    var elem = document.getElementById('gifImage');
    if (elem != null) {
      elem.style.display = 'block';
    }
  }

  initializeForm() {

    this.postForm = this.formBuilder.group({
      text: '',
      feeling: 'Natural'
    });

  }


  get f1() {
    return this.postForm.controls;
  }

  onChangeDiv() {

    let commentDiv = document.getElementById('commentDiv').innerHTML;
    this.comment = commentDiv;
    // if (commentDiv.endsWith("&nbsp;")) {
    //   //console.log("nbsp;");
    //   commentDiv = commentDiv.substring(0, commentDiv.lastIndexOf('&nbsp;')) + '<div contenteditable="false"> </div>';
    // }

    // this.comment = commentDiv;
    this.onChangeSearch();
  }

  onChangeSearch() {
    let search_keyword = '';
    let lastIndexOfSpace = this.comment.lastIndexOf(" ");
    let mentionChar = this.comment.charAt(lastIndexOfSpace+1);
    if ((mentionChar == '$' ||
    mentionChar == '@')) {
      search_keyword = this.comment.slice(lastIndexOfSpace+1,this.comment.length);
    } else if (this.comment.includes("<div><br></div>")) {
      search_keyword = this.comment.slice((this.comment.lastIndexOf("<div><br></div>")) + 14 + 1, this.comment.length);
      if (search_keyword.includes("<div>")) {
        search_keyword = search_keyword.replace("<div>","");
        search_keyword = search_keyword.replace("</div>","");
      }
    } else if (this.comment.lastIndexOf("&nbsp;") + 6 === this.comment.lastIndexOf('@') || this.comment.lastIndexOf("&nbsp;") + 6 === this.comment.lastIndexOf('$')) {
      let mentionCharPosition = Math.max(this.comment.lastIndexOf('@'), this.comment.lastIndexOf('$'));
      search_keyword = this.comment.slice(mentionCharPosition, this.comment.length);
      if (search_keyword.includes("<div>")) {
        search_keyword = search_keyword.replace("<div>", "");
        search_keyword = search_keyword.replace("</div>", "");
      }
    } else if (this.comment.lastIndexOf("</div>") + 6 === this.comment.length) {

      let divStartPos = this.comment.lastIndexOf('<div>');
      search_keyword = this.comment.slice(divStartPos, this.comment.length);
      if (search_keyword.includes("<div>")) {
        search_keyword = search_keyword.replace("<div>", "");
        search_keyword = search_keyword.replace("</div>", "");
      }
    } else {
      search_keyword = this.comment.replace(this.stored_comment, '');
    }

    let val = search_keyword;

    if (val.endsWith("&nbsp;") || val.endsWith(" ")) {
      this.stored_comment = this.comment;
      this.showUserSearch = false;
      this.showStockSearch = false;
    } else {

      const first_char_of_search = val.charAt(0);
      var splitted = val.split(first_char_of_search, 2);
      var search_text = splitted[1];

    if (first_char_of_search == "$") {
      this.showData = true;
      this.showData = true;
      this.showStockSearch = true;
      this.showUserSearch = false;
      this.getSearchResults('stock', search_text);

    } else if (first_char_of_search == "@") {

      this.showData = true;
      this.showUserSearch = true;
      this.showStockSearch = false;
      this.getSearchResults('people', search_text);
    } else {

      this.showData = false;
      this.stored_comment = this.comment;
      this.showUserSearch = false;
      this.showStockSearch = false;
    }
    }

  }

  selectStockOrUser(type:string, text: string) {

    const url = type === 'stock' ? `/stock-profile` : (type==='people' ? `/user-profile` : '');

    if (type == 'stock') {
      this.stocksArray.push(text.substring(1));
    }

    let val = this.comment.slice(0, -1);
    this.comment = this.stored_comment + `&nbsp;<span contenteditable="false" > <a style="color: rgb(33, 141, 255); font-weight: bold;" href="${url}/${text.substring(1)}" ng-reflect-router-link="${url},${text.substring(1)}">${text}</a></span>&nbsp;`;

    // this.comment = this.stored_comment + `&nbsp;<span contenteditable="false" > <a style="color: rgb(33, 141, 255); font-weight: bold;" [routerLink]="['${url}', ${text.substring(1)}]">${text}</a></span>&nbsp;`;
    document.getElementById('commentDiv').textContent = this.comment;
    this.commentDiv = this.comment;
    this.stored_comment = this.comment;
    this.showData = false;
    this.showUserSearch = false;
    this.showStockSearch = false;
  }

  searchStocks(payload) {
    this.dataService.searchStocks(payload)
      .subscribe(res => {
        this.resultData['stock'] = res;
        if (this.resultData['stock'].length < 5) {
          this.stocksData = this.resultData['stock'].slice(0, this.resultData['stock'].length);
        } else {
          this.stocksData = this.resultData['stock'].slice(0, 15);
        }
        this.stocksData = this.resultData['stock'].slice(0, 15);
      });
  }

  searchUsers(payload) {
    this.dataService.searchUsers(payload)
      .subscribe(res => {
        this.resultData["user"] = res;


        if (this.resultData['user'].length < 5) {
          this.usersData = this.resultData['user'].slice(0, this.resultData['user'].length);
        } else {
          this.usersData = this.resultData['user'].slice(0, 15);
        }

      });
  }

  getSearchResults(type, search_text) {
    try {
      let payload = {
        "stock": search_text
      }

      if (type == 'stock') {
        this.searchStocks(payload);

          if (this.resultData['stock'].length < 5) {
            this.stocksData = this.resultData['stock'].slice(0, this.resultData['stock'].length);
          } else {
            this.stocksData = this.resultData['stock'].slice(0, 15);
          }
      } else if (type == 'people') {
        this.searchUsers(payload);
          if (this.resultData['user'].length < 5) {
            this.usersData = this.resultData['user'].slice(0, this.resultData['user'].length);
          } else {
            this.usersData = this.resultData['user'].slice(0, 15);
          }
      }
    } catch (error) {
      console.error("Error: error in manipulating result of search users");
    }

    return this.resultData;
  }

  getAllStockComments(page) {

    this.dataService.getAllStockComments(page)
      .subscribe(res => {
        this.manipulateComments(res);
      });
  }



  addPost() {


    const commentText = this.commentDiv === "" ? this.comment : this.commentDiv;
    let str = document.getElementById('commentDiv').textContent;

    str = str.replace(/\s/g, '');
    if (str == "") {
      this.alertData['text'] = 'Please write something.';
      this.alertData['cssClass'] = 'alert alert-warning';

      setTimeout(() => {
        this.alertData['text'] = '';
        this.alertData['cssClass'] = '';
      }, 5000);

      return false;
    } else {
      this.alertData['text'] = '';
      this.alertData['cssClass'] = '';
    }



    let payload = {
      "text": commentText,
      "stock": `${this.stock},${this.stocksArray.join()}`,
      "feeling": this.feeling,
      "picture": this.gifUrl
    }

    this.gifUrl = '';

    this.dataService.addPost(payload)
      .subscribe(res => {
        if (this.stock != "") {
          this.getStockComments(this.stock);
        }
        else {
          this.getAllStockComments(1);
        }
        if (res.statusText == "OK") {
          if (this.imgClose != undefined)
            this.imgClose.nativeElement.click();
            this.commentDiv = '';
            this.feeling = 'Natural';

          this.alertData['text'] = 'Idea has been posted.';
          this.alertData['cssClass'] = 'alert alert-success';

            setTimeout(() => {
              this.alertData['text'] = '';
              this.alertData['cssClass'] = '';
          }, 5000);
        } else {
          this.alertData['text'] = 'Something went wrong';
          this.alertData['cssClass'] = 'alert alert-danger';
        }

      });
  }

  deletePost(id:string) {

    let payload = {
      "id": id
    }

    this.dataService.deletePost(payload)
      .subscribe(res => {
        if (this.stock != "") {
          this.getStockComments(this.stock);
        }
        else {
          this.getAllStockComments(1);
        }
      });
  }

  addReply(parent,text,feeling,stock) {

    let payload = {
      "parent": parent,
      "text": text,
      "feeling": feeling.value,
      "stock": stock
    }


    this.dataService.addReply(payload)
      .subscribe(res => {
        if (this.stock != "")
        this.getStockComments(this.stock);
        else
        this.getAllStockComments(1);
      });
  }


  onClick(event) {


    try {
      var element = document.getElementById('search-dropdown');
      if (element != null) {

        if (!element.contains(event.target)) // or some similar check
          this.showData = false;
      }
      }  catch(error) {
      console.error(error.name+ " In Closing Search droplist of comments section");
      }
    }

  openReply(val_post) {
    if (!this.storageData) {
      this.authenticationService.setValueOftriggerLoginSubject = true;
    }
    val_post.isReply = !val_post.isReply;
  }

  openReplyList(val_post) {
    if (!this.storageData) {
      this.authenticationService.setValueOftriggerLoginSubject = true;
    }
    val_post.isReplyList = !val_post.isReplyList;
  }

  onClickPostForm() {
    if (this.postForm.invalid) {
      return;
    }
    this.loading = true;
    let payload = {
      "stock": this.stock,
      "text": this.f1.text.value,
      "feeling": this.f1.feeling.value,
    }

    this.dataService.addPost(payload)
      .subscribe(

        data => {
          this.commentDiv = '';
          this.feeling = 'Natural';
          data.text = 'Idea has been posted.';
          data.cssClass = 'alert alert-success';
          this.alertData = data;
          this.getStockComments(this.stock);
        },
        error => {
          if ((error.status == 400 || error.status == 401) && error.error != "") {

            error.text = error.error;
            error.cssClass = 'alert alert-danger';
            this.message = error;
          }

        }

      );
  }

  //get current stock comments
  getStockComments(stock) {

    this.dataService.getStock(stock).subscribe(
      stockData => {
        console.log(stockData)
        stockData = stockData.body;
        this.dataService.getStockComments(stock).subscribe(res => {

          res.forEach(element => {
            element.priceChange = '';
            element.changeInPrice = 0;
            element.changeInPercentage = 0;

            if (stockData.close < element.price) {
              element.priceChange = 'up';
              element.changeInPrice = element.price - stockData.close;
              element.changeInPercentage = ((element.price - stockData.close) / stockData.close * 100);
            } else if (stockData.close > element.price) {
              element.priceChange = 'down';
              element.changeInPrice = element.price - stockData.close;
              element.changeInPercentage = ((element.price - stockData.close) / stockData.close * 100);
            }
            element.prediction_type = 'Natural';
            element.comment = '';

            if (element.replies == undefined) {
              element.replies = [];
            } else {
              element.replies.forEach(element => {
                element.isReply = false;
                element.isReplyList = false;
                element.comment = '';

                element.prediction_type = 'Natural';
              });
            }

            switch (element.feeling) {
              case 'Long term Bearish':
                element.color = '#ff333a';
                break;
              case 'Short term Bearish':
                element.color = '#ff333a';
                break;
              case 'Long term Bullish':
                element.color = '#17b24b';
                break;
              case 'Short term Bullish':
                element.color = '#17b24b';
                break;

              default:
                element.color = '#595757';
                break;
            }


          });
          this.postsData = res;
        })
      }
    );


  }

  onReactComment(id, type) {
    try {

      if (!this.storageData) {
        this.authenticationService.setValueOftriggerLoginSubject = true;
      }
      let payload = {
        "comment": id,
        "creator": this.storageData['id'],
        "type": type
      }

      this.dataService.reactCommentStock(payload)
        .subscribe(res => {
          if (res != null) {
            if (this.stock != "")
              this.getStockComments(this.stock);
            else
              this.getAllStockComments(1);
          }
        });


    } catch (error) {
      this.authenticationService.setValueOfIsLoggedInCheckSubject = false;
    }
  }
  manipulateComments(res) {
    res = res.data;
    res = [...this.postsData, ...res];

    res.forEach(element => {

      element.priceChange = '';
      element.changeInPrice = 0;
      element.changeInPercentage = 0;

      if (element.stock_info.open < element.price) {
        element.priceChange = 'up';
        element.changeInPrice = element.price - element.stock_info.open;
        element.changeInPercentage = ((element.price - element.stock_info.open) / element.stock_info.open * 100);
      } else if(element.stock_info.open > element.price) {
        element.priceChange = 'down';
        element.changeInPrice = element.price - element.stock_info.open;
        element.changeInPercentage = ((element.price - element.stock_info.open) / element.stock_info.open * 100);
      }
      element.prediction_type = 'Natural';
      element.comment = '';

      if (element.replies == undefined) {
        element.replies = [];
      } else {
        element.replies.forEach(ele => {
          ele.isReply = false;
          ele.isReplyList = false;
          ele.comment = '';
          ele.prediction_type = 'Natural';
        });
      }

      switch (element.feeling) {
        case 'Long term Bearish':
          element.color = '#ff333a';
          break;
        case 'Short term Bearish':
          element.color = '#ff333a';
          break;
        case 'Long term Bullish':
          element.color = '#17b24b';
          break;
        case 'Short term Bullish':
          element.color = '#17b24b';
          break;

        default:
          element.color = '#595757';
          break;
      }





    });

    this.postsData = res;
  }
}
