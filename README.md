# BookMarcker


## 何のツール？

Chrome拡張機能です。
Chromeの履歴を様々な方法で表示、管理します。

## 使い方

タブが３種類（標準、分析、あき）あります。<br>
それぞれで異なる方法で履歴を表示します。履歴の検索として以下の共通設定が可能です。<br>
検索キーワード：文字列（ページタイトル）<br>
　　　　　　　　履歴に含まれるページタイトルを限定します。<br>
検索範囲：数字（日付）<br>
　　　　　履歴を何日前まで遡って表示するか決定します。設定がない場合は１日です。<br>
![sample](https://github.com/fuku-mitsu/URLManager/blob/master/img/normal_access.png)!

- 標準タグ<br>
回数順ボタン：アクセス回数順で履歴を表示します。<br>
日付順ボタン：日付順で履歴を表示します。<br>
ドメインボタン：ドメインのアクセス回数順で履歴を表示します。<br>

- 分析タグ<br>
タイトルボタン；どんな単語（スペース区切り）のページにアクセスしているかを表示します。<br>
辞書選択ボタン：タイトルボタンで表単語を判断するためのユーザー辞書を登録します。（dic\dic.json）<br>

- あきタグ<br>
URLを削除できます。（未）<br>

## How To Install This

1. Download this repository and extract them into a folder.
2. Go to <chrome://extensions>
3. Turn `Developer mode` on.
4. Click `Load unpacked`.
5. Choose the folder which you extracted.
6. After loading the folder, now you can use this extension!

## How To Uninstall This

1. On the page <chrome://extensions>, delete this extension.
2. Remove the folder you extracted.

## References(Memo)
- Introduction to Chrome Extension Development
https://qiita.com/Ancient_Scapes/items/822409167ae3a0b76dbe
- how to develop by TypeScript<br>
https://qiita.com/markey/items/ea9ed18a1a243b39e06e
- about TypeScript<br>
Update edition of JavaScript<br>
https://www.sejuku.net/blog/93230
- event_action (detactive web page actions)<br>
beta edition but it is usefull for Web request interception <br>
https://developer.chrome.com/extensions/declarativeWebRequest<br>
chrome web request api<br>
https://developer.chrome.com/extensions/webRequest<br>
https://developer.chrome.com/extensions/samples#search:webrequest
- mostVisitedURLs
https://developer.chrome.com/extensions/samples#search:topsites
- declare_permissions
https://developer.chrome.com/extensions/declare_permissions
- chrome history
https://developer.chrome.com/extensions/history

