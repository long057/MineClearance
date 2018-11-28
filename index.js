
var gameStart = document.getElementsByClassName('game_start')[0];
var closeBtn = document.getElementsByClassName('close')[0];
var choose = document.getElementsByClassName('choose')[0];
var gameStage = document.getElementsByClassName('game_main')[0];
var gameOver = document.getElementsByClassName('game_over')[0];
var mineNumNode = document.getElementsByClassName('num')[0];
var block;
var flag = true;
var spacing = 1;
var  mineOver;
var difficults = {
    easy: {
        rows: 9,
        cols: 9,
        mineNum: 10,
        mineWidth: 50
    },
    usual: {
        rows: 16,
        cols: 16,
        mineNum: 40,
        mineWidth: 25
    },
    hard: {
        rows: 16,
        cols: 30,
        mineNum: 99,
        mineWidth: 25
    }
};
var chooseDifficult = difficults.easy;

gameStart.onclick = function () {
    init(chooseDifficult)
}
function init (difficult) {
    if (flag) {
        flag = false;
        gameStage.style.display = 'block';
        bindEvent(difficult);
        initBoard(difficult);
    }
}


function initBoard(difficult) {
    mineOver = difficult.mineNum;
    // console.log(mineOver)
    gameStage.innerHTML = '';
    gameStage.style.width = difficult.mineWidth * difficult.cols + (difficult.cols + 1) * spacing + 'px';
    gameStage.style.height = difficult.mineWidth * difficult.rows + (difficult.rows + 1) * spacing + 'px';
    for (var i = 0; i < difficult.rows; i++) {
        for (var j = 0; j < difficult.cols; j++) {
            var temp = createMine(difficult, i, j);
            gameStage.appendChild(temp);
        }
    }
    block = document.getElementsByClassName('block');
    // console.log(block);
    randGenerateMine(difficult);
}

function randGenerateMine(difficult) {
    var num = difficult.mineNum;
    while (num) {
        var randIndex = Math.floor(Math.random() * difficult.rows * difficult.cols);
        if (!block[randIndex].classList.contains('isLei')) {
            block[randIndex].classList.add('isLei');
            num--;
        }
    }
}

function createMine(difficult, i, j) {
    var temp = document.createElement('div');
    temp.style.width = difficult.mineWidth + 'px';
    temp.style.height = difficult.mineWidth + 'px';
    temp.style.lineHeight = difficult.mineWidth + 'px';
    temp.classList.add('block');
    temp.setAttribute('id', i + '-' + j);
    temp.row = i;
    temp.col = j;
    return temp;
}

function bindEvent(difficult) {
    gameStage.addEventListener('contextmenu', function (e) {
        e.preventDefault();
    });
    gameOver.addEventListener('contextmenu', function (e) {
        e.preventDefault();
    });
    gameStage.addEventListener('mousedown', function (e) {
        e.stopPropagation();

        var target = e.target;
        if (e.which == 1) {
            leftClick(target, difficult);
        } else if (e.which == 3) {
            rightClick(target, difficult);
        }
    });
    closeBtn.addEventListener('click', function (e) {
        gameOver.style.display = 'none';
        gameStage.style.display = 'none';
        gameStage.innerHTML = '';
        block = null;
        mineOver = chooseDifficult.mineNum;
        flag = true;
    });
    choose.addEventListener('click', function (e) {
        var target = e.target;
        chooseDifficult = difficults[target.className];
        init(chooseDifficult);
    });

}

function leftClick(dom, difficult) {
    // console.log(dom);
    if(dom.classList.contains('flag')) {
        return;
    }
    var isLei = document.getElementsByClassName('isLei');
    // 判断是否是雷
    if (dom && dom.classList.contains('isLei')) {
        gameOver.style.display = 'block';
        setTimeout(function () {
            for (var i = 0; i < isLei.length; i++) {
                isLei[i].classList.add('show');
            }
        }, 800)
    } else {
        // 不是雷显示数字
        var num = 0;
        var minX = dom.row - 1 < 0 ? 0 : dom.row - 1;
        var maxX = dom.row + 1 < difficult.rows ? dom.row + 1 : dom.row;
        var minY = dom.col - 1 < 0 ? 0 : dom.col - 1;
        var maxY = dom.col + 1 < difficult.cols ? dom.col + 1 : dom.col;
        // console.log(dom.row, dom.col);
        // console.log(minX, maxX);
        // console.log(minY, maxY);
        dom && dom.classList.add('num');
        for (var i = minX; i <= maxX; i++) {
            for (var j = minY; j <= maxY; j++) {
                var around = document.getElementById(i + '-' + j);
                if (around.classList.contains('isLei')) {
                    num++;
                }
            }
        }
        dom.innerHTML = num;
        if (num == 0) {
            dom.innerHTML = '';
            for (var i = minX; i <= maxX; i++) {
                for (var j = minY; j <= maxY; j++) {
                    var near = document.getElementById(i + '-' + j);
                    if (near && near.length != 0) {
                        if (!near.classList.contains('check')) {
                            near.classList.add('check');
                            leftClick(near, difficult);
                        }
                    }
                }
            }
        }
    }


}

function rightClick(dom, difficult) {
    if(dom.classList.contains('num')) {
        return;
    }
    // console.log(dom);
    dom.classList.toggle('flag');
    if (dom.classList.contains('isLei') && dom.classList.contains('flag')) {
        mineOver--;
    }
    if (dom.classList.contains('isLei') && !dom.classList.contains('flag')) {
        mineOver++;
    }
    mineNumNode.innerHTML = mineOver;
    if (mineOver == 0) {
        gameOver.style.display = 'block';
        gameOver.getElementsByClassName('text')[0].innerText = '恭喜成功，再来一次';
    }
    
    
}