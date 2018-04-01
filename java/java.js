const open=document.getElementsByClassName('openNow');
const li=document.getElementById('myid').getElementsByTagName('li');
let openCards=[]; //tracking number of fixed cards
let list=[];  //comapres the 2 cards
let hand= 0; //counts how many hands
let time=0; // timer
const cardCollection=['fa-car','fa-car',
                      'fa-bicycle','fa-bicycle',
                      'fa-bomb','fa-bomb',
                      'fa-bus','fa-bus',
                      'fa-heart','fa-heart',
                      'fa-instagram','fa-instagram',
                      'fa-bolt','fa-bolt',
                      'fa-question','fa-question']

const mixCards= mix(cardCollection);

//push mixed cards to the DOM//
mixCards.forEach((item,i) => {
    li[i].querySelector('.fa').classList.add(item)
});


start();

//fisher yates shuffle/mix
function mix(array){
    let currentIndex=array.length;
    let temp, randomIndex;

    while(currentIndex != 0){
        RandomIndex=Math.floor(Math.random()*currentIndex)
        currentIndex--
        temp=array[currentIndex]
        array[currentIndex]=array[RandomIndex]
        array[RandomIndex]=temp
    }
    return array;
}


//open cards on klik and add openNow/showIcons class//
function start(){
const card = document.querySelectorAll('.card');
let count=0;

    //add event listeners to all cards
    for(var i=0; i<card.length; i++){
        if(card[i].classList.contains('fixed') === false){
            card[i].addEventListener('click',callback,false);
        }
    }

    //just in case because some wierd bugs were ocuring if i molested the click
    for(var i=0; i<card.length; i++){
        if(card[i].classList.contains('fixed')){
         card[i].removeEventListener('click',callback, false);
        }
    }

    function callback(e){
            count++

            if(time===0){
                timer.run();
            }

            e.stopPropagation();
            e.target.classList.add('openNow')
            e.target.querySelector('.fa').classList.replace('hideIcons','showIcons')

            //remove event from clicked card to prevent bugs
            e.target.removeEventListener('click',callback,false);

            // remove all event when 2 cards are open
            if(count===2){
                for(var i=0; i<card.length; i++){
                card[i].removeEventListener('click',callback,false)
                }
            //add transitionEnd to see when to call checkOpen
                e.target.addEventListener('transitionend', function some(e){
                    e.target.removeEventListener('transitionend',some,false);
                    if(e.propertyName==='transform'){ //specify what transition to listen
                        checkOpen();
                    }
                },false)
            }

        }

};

// comapre 2 open cards
function checkOpen(){
    for(let i=0; i<open.length; i++){
        let icons=open[i].querySelector('i').classList
            let arr=[...icons]
            list.push(arr[2]);
    }

    if(list.length===2){
        if(list[0]===list[1]){
            stayOpen();
            list.splice(0);
            addHand();

        }else{
            list.splice(0);
            close();
            addHand();
        }
    }
}

//Close cards which don't match//
function close(){
    for(let i =0; i<li.length; i++){
        li[i].addEventListener('transitionend',whenEnd,true);

        if(li[i].classList.contains("openNow")){
            li[i].classList.add("notMatch")
            li[i].classList.remove("openNow")
            li[i].querySelector('i').classList.replace("showIcons","hideIcons")
        }

        function whenEnd(e){
            if(e.propertyName === "background-color" && e.elapsedTime < 2){
                this.classList.remove('notMatch');
            }
        }

    }

    start();
}

//FIX THE CARDS TO BOARD//
function stayOpen(){

    openCards.push(list[0],list[1]);

    for(let i=0; i<li.length; i++){
        li[i].addEventListener('transitionend',whenEnd,true);

        if(li[i].classList.contains("openNow")){
            li[i].classList.add('match')
            li[i].classList.remove("openNow")
            li[i].classList.add("fixed")
        }

        function whenEnd(e){
            if(e.propertyName === "box-shadow"){
                this.classList.remove('match');
            }
        }

    }

//Check how many fixed cards//
    if(openCards.length===16){
        timer.stop();
        for(let i=0; i<li.length; i++){
        li[i].classList.add('match')
        }
        setTimeout(function(){
            finish();
        },300);
    }else{
        start();
    }

}


function addHand(){
    hand++;
    const stars=document.querySelectorAll('.fa-star')
    const hands= document.querySelector('.hands')
    hands.innerHTML =  `Hands: <i>${hand}</i>`

    if(hand===9){
        stars[4].style.color= "#ffffff"
    }
    if(hand===14){
        stars[3].style.color= "#ffffff"
    }
    if(hand===19){
        stars[2].style.color= "#ffffff"
    }
    if(hand===24){
        stars[1].style.color= "#ffffff"
    }

};


// timer function //
function timeGet(){
   
  this.run = function(){
        var interval= setInterval(startTime,10)

        function startTime(){
            time++
            let msec=time%100
            let sec=Math.floor(time/100%60)
            let min=Math.floor(time/100/60)

            if(min<10){
                min="0"+min
            }

            if(sec<10){
                sec="0"+sec
            }

            if(msec<10){
                msec="0"+msec
            }

            const updateTime= document.querySelector('.time')
            updateTime.innerHTML=`${min} : ${sec} : ${msec}`

        }

            this.stop = function(){
                clearInterval(interval)
            }

    }

}

const timer= new timeGet();


function finish(){
    const board= document.querySelector('.board')
    const stats= document.querySelector('.stats')
    document.querySelector('.stats').style.cssText="  text-align: center;"

    document.querySelector('.refresh').style.cssText=`display: block;
                                                      font-size: 18px;
                                                      margin-top: 10px;
                                                      margin-left: 0;`

    document.querySelector('.time').style.cssText=`   display: block;
                                                      font-size: 25px;
                                                      margin-top: 10px;
                                                      margin-left: 0;`

    document.querySelector('.stars').style.cssText=`  display: block;
                                                      font-size: 30px;
                                                      padding-right: 40px;`

    document.querySelector('.hands').style.cssText=`  display: block;
                                                      margin-left: 0;`

    const message=`<h1 style="color: rgba(25,217,21,0.52); text-shadow: 1px 1px;">
                    YOU WIN!!!!</h2>`


    board.remove()
    stats.insertAdjacentHTML('afterbegin',message);

}



//refresh the page on click
document.querySelector('.refresh').addEventListener('click',function(e){
    document.location.reload();
});
