let pokets = [];
pokets = reset(pokets);
// console.log(pokets)

let turn = true;

$(function(){
  show()
  $('span').click(function(){
    // ボタンをクリックしたとき
    selectedBoxNum = parseInt($(this).attr('class'));
    // console.log(selectedBoxNum);

    if(turnJudge(selectedBoxNum)){
      moveStones(selectedBoxNum)
      if(endJudge()){
        end();
      }
      show();
    }
  });

  // ホバー時に選んでいるポケットと、そこから何個分石が落とせるかを背景色で示す
  $('span').hover(function(){
    // ホバー時
    selectedBoxNum = parseInt($(this).attr('class'));
    if(turnJudge(selectedBoxNum)){
      let color = '#00f';
      let color2 = '#bcbcff';
      if(turn){
        color = '#f00';
        color2 = '#ffbcbc';
      }else {
        color = '#0f0';
        color2 = '#bcffbc';
      }
      $(this).css("background", color);
        // 選択したポケットに入っている石の数を取得
      let stoneNum = pokets[selectedBoxNum];
      // 持った石を一つずつポケットに置いていく
      let putPlace = selectedBoxNum + 1
      for(var i = 1; i <= stoneNum; i++){
        $('span.'+putPlace).css("background", color2);
        putPlace++
        if(putPlace > 13){
          putPlace = 0
        }
      }
      // console.log(pokets[selectedBoxNum] != 0)
      // console.log(pokets[putPlace-1] == 0)
      // console.log( !goalBoxJudge(putPlace-1))
      // console.log( areaJudge(putPlace-1))
      if(pokets[selectedBoxNum] != 0 && pokets[putPlace-1] == 0 && !goalBoxJudge(putPlace-1) && areaJudge(putPlace-1)){
        $('span.'+(13 - putPlace)).css("border", "2px solid red");
      }


    }

  },
  function(){
    // 離れたとき
    $('span').css('background','#fff');
    $('span').css('border','2px solid #000');
  }
  )

});

function reset(pokets){
  pokets = [4,4,4,4,4,4,0,4,4,4,4,4,4,0];
  // pokets = [0,0,0,0,0,4,0,4,4,4,4,4,4,0];
  // pokets = [4,4,4,4,4,4,0,0,0,0,0,2,1,0];
  // pokets = [0,1,2,3,4,5,6,7,8,9,10,11,12,13];
  return pokets;
}

function show(){
  console.log('show')
  for ($i = 0; $i < pokets.length; $i++){
    $('span.' + $i).html(pokets[$i].toString()); 
  }
  let color = '#00f';
  if(turn){
    color = '#f00';
  }else {
    color = '#0f0';
  }
  $('table').css('border', '5px solid ' + color)
}

function turnJudge(selectedBoxNum){
  if(goalBoxJudge(selectedBoxNum)){
    return false;
  }
  if(areaJudge(selectedBoxNum)){
    return true;
  }
  return false;
}

function goalBoxJudge(selectedBoxNum) {
  if(selectedBoxNum == 6 || selectedBoxNum == 13){
    return true
  }else {
    return false
  }
}
function areaJudge(selectedBoxNum){
  if((selectedBoxNum <=5 && turn == true) || (selectedBoxNum >=7 && turn == false)){
    return true
  }else {
    return false
  }
}

function moveStones(selectedBoxNum){
  // 選択したポケットに入っている石の数を取得
  let stoneNum = pokets[selectedBoxNum];
  // 持った石を一つずつポケットに置いていく
  pokets[selectedBoxNum] = 0;
  let putPlace = selectedBoxNum + 1
  for(var i = 1; i <= stoneNum; i++){
    pokets[putPlace] += 1
    putPlace++
    if(putPlace > 13){
      putPlace = 0
    }
  }
  lastPoket = selectedBoxNum + stoneNum
  if (lastPoket > 13){
    lastPoket -= 14;
  }
  // 最後に置いたポケットが6か13の場合ターンは変わらない
  if((lastPoket == 6 && turn == true) || (lastPoket == 13 && turn == false)){
    return true
  }
  // 最後に置いたポケットが自分の陣地であり、空だった場合、その向かい側のポケットの石を総取りする
  // 相手のポケットが空の場合総取りすることができない
  if(turnJudge(lastPoket) && (pokets[lastPoket] == 1) && pokets[12-lastPoket] != 0){
    oppositeStoneNum = pokets[12-lastPoket];
    pokets[12-lastPoket] = 0;
    pokets[lastPoket] = 0;
    if(turn){
      pokets[6] += oppositeStoneNum + 1;
    }else {
      pokets[13] += oppositeStoneNum + 1;
    }
  }
  // ターンを変更する
  turn = !turn
}
function endJudge(){
  // 0~5または7~12のポケットがすべて0になったら試合終了
  flag = true
    for(i = 0; i < 6; i++){
      if(pokets[i] > 0){
        flag = false
        break
      }
    }
    flag2=true
    for(i = 7; i < 13; i++){
      if(pokets[i] > 0){
        flag2 = false
        break
      }
    }
  return (flag || flag2)
}
function end(){
  console.log('end');
  // 相手の側のポケットに入っていた石はすべて相手のものとなる
  let i;
  let max;
  for (l = 0; l < 2; l++ ){
    if(l){
      i = 0
      max = 6
    }else{
      i = 7
      max = 13
    }
    let sumStone = 0;
    for(i; i < max; i++){
      sumStone += pokets[i];
      pokets[i] = 0
    }
    pokets[max] += sumStone;
  }
}