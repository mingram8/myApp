


// document.addEventListener('keyup', logKey);

// function logKey(e) {
//   if (e.keyCode == 38 || e.keyCode == 40) { // up
//     //console.log("here");
//     var selected = $(".selected");

//     $("li.list-group-item").removeClass("selected");

//     // if there is no element before the selected one, we select the last one
//     if (selected.prev().length == 0) {
//       selected.siblings().last().addClass("selected");
//     } else { // otherwise we just select the next one
//       selected.prev().addClass("selected");
//     }
//   }

// }




      function getCodeBoxElement(index) {
        return document.getElementById('codeBox' + index);
      }
      function onKeyUpEvent(index, event) {
        const eventCode = event.which || event.keyCode;
        if (getCodeBoxElement(index).value.length === 1) {
          if (index !== 4) {
            getCodeBoxElement(index+ 1).focus();
          } else {
            getCodeBoxElement(index).blur();
            // Submit code
            //console.log('submit code ');
          }
        }
        if (eventCode === 8 && index !== 1) {
          getCodeBoxElement(index - 1).focus();
        }



      }
      function onFocusEvent(index) {
        for (item = 1; item < index; item++) {
          const currentElement = getCodeBoxElement(item);
          if (!currentElement.value) {
              currentElement.focus();
              break;
          }
        }
      }

      function addSearch(obj,evt){
        var container  = $(obj).closest('.searchBox');
       if(!container.hasClass("input")){
        container.addClass("input");
        $('#myInput').focus();
        evt.preventDefault();
      }
        // else if(container.hasClass('input') && $(obj).closest('.inputBox').length == 0){
        //   container.removeClass("input");
        // }

        // var element = document.getElementById('search-dropdown');
        // if (element != null) {

        //   if (!element.contains(event.target)) // or some similar check
        //     this.showData = false;
        // }
      }

      function closeSearch(event) {
        //console.log(event);
      }


        // $("body").on("click",function (e) {

        //   var element = document.getElementById('search-dropdown');

        //   if (element != null) {
        //     if (e.target !== element || !element.contains(e.target)) {
        //       element.remove();
        //       // element.style.display = 'none';
        //     }
        //   }

        // });


