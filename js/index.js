
 HTMLElement.prototype.creatTurnPage = function (ImageArray) {
    //====生成dom元素==============
    var DocUl = '<ul class ="sliderPage">'
    doated = '<div class ="sliderIndex">',
        length = ImageArray.length;
    //插入图片
    for (var i = 0; i < length; i++) {
        DocUl += `<li>
        <img src = "` + ImageArray[i] + `">
    </li>`
        //控制点
        doated += `<span></span>`
    }
    //要将第一张图片再多插入一次
    DocUl += `<li>
        <img src = "` + ImageArray[0] + `">
    </li>
    </ul>`
    //插入左右两侧的按钮
    btn = `<div class = "btn btnLeft">&lt;</div>
        <div class ="btn btnRight">&gt;</div>`
    //插入轮播图的控制
    doated += '</div>'
    this.innerHTML = DocUl + btn + doated;
    //====样式设置================
    var sliderPage = document.getElementsByClassName('sliderPage')[0],
        Oli = sliderPage.getElementsByTagName('li'),
        Oimg = sliderPage.getElementsByTagName('img'),
        Obtn = document.getElementsByClassName('btn'),
        sliderIndex = document.getElementsByClassName('sliderIndex')[0],
        Ospan = sliderIndex.getElementsByTagName('span');

    //给wrapper定位
    this.style = `position:relative;
            overflow:hidden;`;
    //ul的样式 宽高
    sliderPage.style = `width:` + this.offsetWidth * (length + 1) + `px;
            height:` + this.offsetHeight + `px;
            list-style:none;
            position:absolute;`;
    //li img 标签的样式
    for (var i = 0; i <= length; i++) {
        Oimg[i].style.width = Oli[i].style.width = this.offsetWidth + 'px';
        Oimg[i].style.height = Oli[i].style.height = this.offsetHeight + 'px';
        Oli[i].style.float = 'left';
    }
    //左右两侧按钮的样式
    for (var i = 0; i < Obtn.length; i++) {
        Obtn[i].style = `width:20px;
                    height:40px;
                    background:#000;
                    opacity:0.2;
                    color:#fff;
                    text-align:center;
                    line-height:40px;
                    position:absolute;
                    top:50%;
                    margin-top:-20px;
                    cursor:pointer;`
    }
    Obtn[0].style.left = '5px';
    Obtn[1].style.right = '5px';
    //控制点样式
    sliderIndex.style = `position:absolute;
                    bottom:15px;
                    width:100%;
                    text-align:center;`
    for (var i = 0; i < length; i++) {
        Ospan[i].style = `display:inline-block;
                    width:8px;
                    height:8px;
                    border-radius:50%;
                    background:#ccc;
                    margin:0 5px;`
    }
    //默认第一个圆点变色
    Ospan[0].style.background = '#f40';

    //图片自动轮播
    var index = 0,
        moveWidth = this.offsetWidth,
        timer = setInterval(autoMove, 1500);

    //进入wrapper轮播停止，移出轮播启动
    this.onmouseenter = function(){
        clearInterval(timer)
        //左侧和右侧控制按钮变色
        for (var i = 0; i < Obtn.length; i++) {
            Obtn[i].style.opacity = 0.5;
            Obtn[i].onmouseenter = function(){
                this.style.opacity = 0.8;
            }
            Obtn[i].onmouseleave = function(){
                this.style.opacity = 0.5;
            }
        }
    }
    this.onmouseleave = function(){
        timer = setInterval(autoMove, 1500);
        for (var i = 0; i < Obtn.length; i++) {
            Obtn[i].style.opacity = 0.2;
        }
    }
    //点击左侧按钮
    Obtn[0].onclick = function(){
        autoMove('left->right')
    }
    //点击右侧anniu
    Obtn[1].onclick = function(){
        autoMove('right->left')
    }
    //点击小圆点轮播切换
    for(let i = 0;i<Ospan.length;i++){
        (function(j){
            Ospan[j].onclick = function(){
                index = j;
                changeIndex(index)
                startMove(sliderPage,{left:- index * moveWidth})
            }
        }(i))
    }
   
    //==== 轮播 ===========
    function autoMove(direction) {
        direction = direction || 'left->right';
        if (direction == 'left->right') {
            index++;
            startMove(sliderPage, { left: sliderPage.offsetLeft - moveWidth }, function () {
                if (index == length){
                    index = 0;
                    sliderPage.style.left = '0px';
                }
                changeIndex(index)
            })
        } else if (direction == 'right->left') { 
            if(index == 0){
                index = length;
                sliderPage.style.left = - length * moveWidth + 'px';
            }
            index--;
            changeIndex(index)
            startMove(sliderPage, { left: sliderPage.offsetLeft + moveWidth})
        }
    }
    //控制圆点切换
    function changeIndex(_index){
        //将所有的小圆点变为原色
        for(var i = 0;i<Ospan.length;i++){
            Ospan[i].style.background = '#ccc';
        }
        Ospan[_index].style.background = '#f40';
    }
}
//移动函数
function startMove(demo, json, callback) {
    clearInterval(demo.timer);//清除定时器，防止定时器的累加
    var speed, cur;
    demo.timer = setInterval(function () { //启动定时器
        var bStop = true;
        for (var prop in json) {
            if (prop == 'opacity') {
                cur = parseFloat(getStyle(demo, 'opacity')) * 10;
            } else {
                cur = parseInt(getStyle(demo, prop));
            }
            speed = (json[prop] - cur) / 7;
            speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);
            if (prop == 'opacity') {
                demo.style.opacity = (cur + speed) / 10;
            } else {
                demo.style[prop] = cur + speed + 'px';
            }
            if (json[prop] !== cur) { //运动的值等于你所要最终到达的值，回调函数才可以执行
                bStop = false;
            }
        }
        if (bStop) {
            clearInterval(demo.timer);
            typeof callback == 'function' ? callback() : ''; //回调函数存在,执行回调函数
        }
    }, 30)
}
//样式的获取
function getStyle(obj, attr) {
    if (obj.currentStyle) { //支持IE6
        return obj.currentStyle[attr]
    } else {
        //获取最终视觉上看到的最终样式
        return window.getComputedStyle(obj, null)[attr]
    }
}