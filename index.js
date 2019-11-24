var MYAPP = MYAPP || {};
MYAPP.virtualKeyboard = {
    generate: function(target, matrix, language, uppercase = false, shift = 'symbols') {
      var self = this;
      for(var i = 0; i < matrix.length; i++) {
        var position = matrix[i];
        
        var vkr = document.createElement('div');
        vkr.setAttribute('class', 'virtual-keyboard-row');
        
        var vkc = document.createElement('div');
        vkc.setAttribute('class', 'virtual-keyboard-column');
        
        for (var j = 0; j < position.length; j++) {
          var button = document.createElement('button');
          
          switch(matrix[i][j]) {
            case '+backspace': 
              button.innerHTML = 'Backspace';
              button.setAttribute('data-trigger', 'backspace');
              button.setAttribute('title', 'Backspace');
              /* the slicing using timer */
              var mouseTimerHandler = null;
              button.addEventListener("mousedown", function(event) {
                mouseTimerHandler = setInterval(function(){
                  if (event) {
                    MYAPP._lastElementFocused.value = MYAPP._lastElementFocused.value.slice(0, -1);
                  }
                }, 200);
              }, false);
              button.addEventListener("mouseup", function() {
                clearTimeout(mouseTimerHandler);
              });
              break;
            case '+international':
              button.innerHTML = 'Lang';
              button.setAttribute('data-trigger', 'international');
              button.setAttribute('title', 'International');
              break;
            case '+shift':
              button.innerHTML = 'Shift';
              button.setAttribute('data-trigger', 'shift');
              button.setAttribute('title', 'Shift');
              break;
            case '+space':
              button.innerHTML = 'Space';
              button.setAttribute('data-trigger', 'space');
              button.setAttribute('title', 'Space');
              break;
            case '+tab':
              button.innerHTML = 'Tab';
              button.setAttribute('data-trigger', 'tab');
              button.setAttribute('title', 'tab');
              break;
             case '+enter':
              button.innerHTML = 'Enter';
              button.setAttribute('data-trigger', 'enter');
              button.setAttribute('title', 'enter');
              break;
              
            default: 
              button.innerText = uppercase ? (matrix[i][j]).toUpperCase() : matrix[i][j]; 
              break;
          }
          
          button.setAttribute('class', 'virtual-keyboard-button');
          button.addEventListener('click', function () {
            MYAPP._lastElementFocused.focus();
            var x = this.getAttribute('data-trigger');
            if (x) {
              switch(x) {
                case 'backspace':
                  MYAPP._lastElementFocused.value = MYAPP._lastElementFocused.value.slice(0, -1);
                  break;
                case 'international':
                  var reversed = language === 'en'? 'ru' : 'en';
				          localStorage.setItem('language', reversed);
                  target.innerHTML = '';
                  self.generate(target,self.getMatrix(reversed), reversed);
                  break;
                case 'space':
                  MYAPP._lastElementFocused.value = MYAPP._lastElementFocused.value + ' ';
                  break;
                case 'tab':
                  MYAPP._lastElementFocused.value = MYAPP._lastElementFocused.value + '\t';
                  break;
                case 'enter':
                  MYAPP._lastElementFocused.value = MYAPP._lastElementFocused.value + '\n';
                  break;
                case 'shift':
                  var u = !uppercase;
                  var s = shift === 'num' ? 'symbols' : 'num';
                  target.innerHTML = '';
                  self.generate(target,self.getMatrix(language,shift), language, u, s);
                  break;
                      }
            }
            else {
              MYAPP._lastElementFocused.value = MYAPP._lastElementFocused.value + this.innerText;
            }
          });
          vkc.appendChild(button);
          vkr.appendChild(vkc);
          target.appendChild(vkr);
        }
      }
    },
    getMatrix: function(language,shift = 'num') {
      var matrix = {
        symbols: [['!','@','$','%','^','&','*','(',')','_','+']],
        num: [['1','2','3','4','5','6','7','8','9','0']],
        en: [
        ['q','w','e','r','t','y','u','i','o','p'],
        ['+tab','a','s','d','f','g','h','j','k','l'],
        ['+shift','z','x','c','v','b','n','m','.',','],
        ['+international','+space','+backspace','+enter']
      ],
        ru: [
          ['й','ц','у','к','е','н','г','ш','щ','з','х','ъ'],
          ['+tab','ф','ы','в','а','п','р','о','л','д','ж','э'],
          ['+shift','я','ч','с','м','и','т','ь','б','ю','ё','.',','],
          ['+international','+space','+backspace','+enter']
        ]};
      return matrix[shift].concat(matrix[language]);
    },
    init: function(args) {
      if (args && Object.keys(args).length) {
          var self = this;
  
          MYAPP._lastElementFocused = null;
  
          var target = document.getElementById(args['targetId']);
          var language = args['defaultLanguage'];
          var elements = document.querySelectorAll(args['inputSelector']);
  
          MYAPP._lastElementFocused = elements[0];
  
          for (var i = 0; i < elements.length; i++) {
            elements[i].addEventListener('focus', function () {
              MYAPP._lastElementFocused = this;
            });
          }
          self.generate(target,self.getMatrix(language), language);
        }
      }
    
  }

 
  document.addEventListener('keydown',(event)=>{
    if(event.key == "Tab") {event.preventDefault();}
      let buttons = document.getElementsByClassName('virtual-keyboard-button');
      for(let i =0; i<buttons.length;i++){
          if( buttons[i].innerHTML == (event.key === ' ' ? 'Space': event.key)){
              buttons[i].style = "background-color: white";
          } 
      }
      
    });
    document.addEventListener('keyup',(event)=>{
      if(event.key == "Tab") event.preventDefault();
        let buttons = document.getElementsByClassName('virtual-keyboard-button');
        for(let i =0; i<buttons.length;i++){
            if( buttons[i].innerHTML == (event.key === ' ' ? 'Space': event.key)){
              buttons[i].removeAttribute('style');
            } 
        }
      })

  let myStorage = window.localStorage; 
  let keyboard =  document.createElement('div');
  let input = document.createElement('textarea');
  let defLang = myStorage.getItem('language');
  input.setAttribute('data-virtual-element','');
  input.setAttribute('cols','30');
  input.setAttribute('rows','10');
  keyboard.setAttribute('id','virtual-keyboard');
  document.getElementsByTagName('body')[0].appendChild(input);
  document.getElementsByTagName('body')[0].appendChild(keyboard);
  
  MYAPP.virtualKeyboard.init({targetId: 'virtual-keyboard', defaultLanguage: defLang || 'en', inputSelector: '[data-virtual-element]'});


