let dic_config = {};    //分析用辞書
//href要素を押された時に新しいタブを生成する
function onAnchorClick(event) {
  chrome.tabs.create({ url: event.srcElement.href });
  return false;
}
//辞書のアップロード
function dicClickEvent(e){
  let result = e.target.files[0];
  //FileReaderのインスタンスを作成する
  let reader = new FileReader();
  //読み込んだファイルの中身を取得する
  reader.readAsText( result );

  //ファイルの中身を取得後に処理を行う
  reader.addEventListener( 'load', function() {
    dic_config = JSON.parse(reader.result);
    const popupLab = document.getElementById('dic_file');
    popupLab.innerHTML = "";
    let input_tag = document.createElement("input");
    input_tag.setAttribute("id", "dic_upload");
    input_tag.setAttribute("name", "file");
    input_tag.setAttribute("style", "display:none");
    input_tag.setAttribute("accept", "application/json");
    popupLab.appendChild(input_tag);
    popupLab.innerHTML = popupLab.innerHTML + e.target.files[0].name.split(".")[0];
  });
  titleClickEvent();
}

//各ボタンのクリックリベントの設定
document.addEventListener('DOMContentLoaded', function () {
  let divs = document.querySelectorAll('#searchBotton')
  divs[0] = divs[0].addEventListener('click', searchClickEvent)
  let divh = document.querySelectorAll('#historyBotton')
  divh[0] = divh[0].addEventListener('click', historyClickEvent)
  let divd = document.querySelectorAll('#domainBotton')
  divd[0] = divd[0].addEventListener('click', domainClickEvent)
  let divt = document.querySelectorAll('#titleBotton')
  divt[0] = divt[0].addEventListener('click', titleClickEvent)
  let labelb = document.querySelectorAll('#dic_upload')
  labelb[0] = labelb[0].addEventListener('change', dicClickEvent)
})

//日付ボックスの値を取得　
function getSearchDate(){
  let microsecondsPerDay = 1000 * 60 * 60 * 24;
  const serchdate = document.querySelector('#dateTel');
  // 何日前まで検索をさかのぼるか決定する
  let searchStartDate = (new Date).getTime() - microsecondsPerDay * 1
  if (serchdate.value != '')
  {
    searchStartDate = (new Date).getTime() - microsecondsPerDay * serchdate.value//* 365 * 20 
  }
  return searchStartDate;
}
//履歴の検索クエリを作成
function getSeachQuery(){
  const searchText = document.querySelector('#searchText');
  let serchdate = getSearchDate();

  // テキストボックスから検索を指定
  let searchQuery = {
    text: searchText.value,
    startTime: serchdate,
    maxResults: 1000
  }
  console.log(searchQuery);
  return searchQuery;
}

// SEARCHクリックイベント　回数順にURL履歴をソートして表示する
function searchClickEvent(e) { 
  const popupDiv = document.getElementById('mostVisited_div');
  popupDiv.innerHTML = '';
  let ol = popupDiv.appendChild(document.createElement('ol'));

  // テキストボックスから検索を指定
  let searchQuery = getSeachQuery();
  // 履歴取得
  chrome.history.search(searchQuery, function (mostVisitedURLs) {
    //降順ソート
    mostVisitedURLs.sort(function(a,b){
      if(a.visitCount >b.visitCount) return -1;
      if(a.visitCount < b.visitCount) return 1;
      return 0;
  });
    // 履歴の数だけループし、検索結果を表示する
    mostVisitedURLs.forEach(function (mostVisitedURL) {
      let li = ol.appendChild(document.createElement('li'));
      let a = li.appendChild(document.createElement('a'));
      a.href = mostVisitedURL.url;
      a.appendChild(document.createTextNode(mostVisitedURL.title+':'+mostVisitedURL.visitCount));
      a.addEventListener('click', onAnchorClick);
    })
  })
}

// historyクリックイベント アクセス順にURL履歴をソートして表示する
function historyClickEvent(e) {
  const popupDiv = document.getElementById('mostVisited_div');
  popupDiv.innerHTML = '';
  let ol = popupDiv.appendChild(document.createElement('ol'));

  // テキストボックスから検索を指定
  let searchQuery = getSeachQuery();

  // 履歴取得
  chrome.history.search(searchQuery, function (lastVisitURLs) {
    //降順ソート
    lastVisitURLs.sort(function(a,b){
      if(a.lastVisitTime >b.lastVisitTime) return -1;
      if(a.lastVisitTime < b.lastVisitTime) return 1;
      return 0;
  });
    // 履歴の数だけループし、検索結果を表示する
    lastVisitURLs.forEach(function (lastVisitURL) {
      let li = ol.appendChild(document.createElement('li'));
      let a = li.appendChild(document.createElement('a'));
      a.href = lastVisitURL.url;
      a.appendChild(document.createTextNode(lastVisitURL.title+':'+lastVisitURL.visitCount));
      a.addEventListener('click', onAnchorClick);
    })
  })
}
// domainクリックイベント　URL履歴をドメインに分類して回数順ソートして表示する
function domainClickEvent(e) {
  const popupDiv = document.getElementById('mostVisited_div');
  popupDiv.innerHTML = '';
  let ol = popupDiv.appendChild(document.createElement('ol'));

  // テキストボックスから検索を指定
  let searchQuery = getSeachQuery();

  // 履歴取得
  chrome.history.search(searchQuery, function (URLs) {
    var domains = []
    // 履歴の数だけループし、domainを作る
    URLs.forEach(function (URL) {
      let domain = URL.url.split('//')[1].split('/')[0]
      //重複確認
      if (domains.length == 0){
        domains.push({'url':domain,'visitCount':URL.visitCount});
      } else {
        for(var key=0;key < domains.length;) {
          if(domains[key].url == domain) {
            domains[key].visitCount = domains[key].visitCount + URL.visitCount;
            break;
          }
          key++;
          if (key == domains.length){
            domains.push({'url':domain,'visitCount':URL.visitCount})
            break;
          }
        }
      }
    });
    //降順ソート
    domains.sort(function(a,b){
      if(a.visitCount >b.visitCount) return -1;
      if(a.visitCount < b.visitCount) return 1;
      return 0;
    });
    // 履歴の数だけループし、検索結果を表示する
    domains.forEach(function (domainurl) {
      let li = ol.appendChild(document.createElement('li'));
      let a = li.appendChild(document.createElement('a'));
      a.href = domainurl.url;
      a.appendChild(document.createTextNode(domainurl.url+':'+domainurl.visitCount));
      a.addEventListener('click', onAnchorClick);
    })
  })
}

// titleクリックイベント 単語で分類してURL履歴をソートして表示する
function titleClickEvent(e) {
  const popupDiv = document.getElementById('analysis_div');
  popupDiv.innerHTML = "<div class=\"faceicon\"><img src=\"img/たぬきち.png\"> <div id = \"say_word\" class=\"says\"> </div></div>";
  let popupSay = document.getElementById('say_word');
  let sayp = popupSay.appendChild(document.createElement('p'));

  //詳細表示
  let popupDel = popupDiv.appendChild(document.createElement('details'));
  let summary = popupDel.appendChild(document.createElement('summary'));
  summary.innerHTML = "detail";
  let ol = popupDel.appendChild(document.createElement('ol'));
  // テキストボックスから検索を指定
  let searchQuery = getSeachQuery();

  // 履歴取得
  chrome.history.search(searchQuery, function (URLs) {
    let words = []

    // 履歴の数だけループし、domainを作る
    URLs.forEach(function (URL) {
      urlTitle = URL.title.split(" - ")[0];
      let title = [urlTitle];
      //URLで辞書をSPLITする
      Object.keys(dic_config).forEach(function(key){
        if (dic_config[key] == "read"){
          let title_tmp = urlTitle.split(key);
          //分割できたなら検索対象のキーがある
          if (2 <= title_tmp.length ) {
            title.push(key);
          }
        }
      });
      //元のTITLEを削除
      title.shift();
      //単語区切りとして特定文字でタイトルを区切る
      title = title.concat(urlTitle.split(/[ 　]/));
      //重複確認
      if (words.length == 0){
        for(let split_key=0;split_key < title.length;split_key++) {
          if(dic_config[title[split_key]] != "no_read" ){
            if (1 < title[split_key].length){
              words.push({'title':title[split_key],'visitCount':URL.visitCount});
            }
          }
        }
      } else {
        for(let split_key=0;split_key < title.length;split_key++) {
          if(dic_config[title[split_key]] != "no_read"){
            for(let key=0;key < words.length;) {
              if(words[key].title == title[split_key]) {
                words[key].visitCount = words[key].visitCount + URL.visitCount;
                break;
              }
              key++;
              if (key == words.length && 1 < title[split_key].length){
                words.push({'title':title[split_key],'visitCount':URL.visitCount})
                break;
              }
            }
          }
        }
      }
    });
    //降順ソート
    words.sort(function(a,b){
      if(a.visitCount >b.visitCount) return -1;
      if(a.visitCount < b.visitCount) return 1;
      return 0;
    });
    // 履歴の数だけループし、検索結果を表示する
    let firstflag = true;
    words.forEach(function (domainurl) {
      //最初の一回目のアクセスをセリフにする
      if(firstflag && searchQuery.text != domainurl.title){
        sayp.innerHTML = domainurl.title + "をよく調べてるだなも";
        searchQuery.text = domainurl.title;
        // よく検索するワードのタイトルを取得
        chrome.history.search(searchQuery, function (mostVisitedURLs) {
          //降順ソート
          mostVisitedURLs.sort(function(a,b){
            if(a.visitCount >b.visitCount) return -1;
            if(a.visitCount < b.visitCount) return 1;
            return 0;
          });
          // 検索ワードで関連URLを表示
          let search_num = 1;
          let pre_word = [];
          for(let url_num = 0; url_num < mostVisitedURLs.length;url_num++){
            let pre_match = false;
            //すでに登録されている文字列ならTRUE
            for (let pre_num = 0; pre_num < pre_word.length;pre_num++){
                if ( pre_word[pre_num] == mostVisitedURLs[url_num].title) {
                  pre_match = true;
                }
            }
            //すでに登録されておらず、検索キーワードが含まれているものを順位表示する
            if(-1 < mostVisitedURLs[url_num].title.indexOf(domainurl.title) && !pre_match){
              pre_word.push(mostVisitedURLs[url_num].title);
              sayp.innerHTML = sayp.innerHTML + "<br>" +(search_num)+ "位："+mostVisitedURLs[url_num].title;
              if(search_num == 3){
                break;
              }
              search_num++;
            }            
          }
        })
        firstflag = false;
      }
      //1回しかアクセスしていないサイトは表示しない
      if( domainurl.visitCount != 1) {
        let li = ol.appendChild(document.createElement('li'));
        li.appendChild(document.createTextNode(domainurl.title+':'+ domainurl.visitCount));
        }
    })
  })
}

//最初に動く関数を設定
chrome.topSites.get(searchClickEvent);
