# formatyaya-vscode README

formatyaya-vscode is a VSCode extension of [a formatter for yaya(aya)](https://github.com/apxxxxxxe/formatyaya).

[yaya(aya)のフォーマッタ](https://github.com/apxxxxxxe/formatyaya)をVSCodeで使えるようにしたものです。

### 簡単な使い方
1. 言語モード"yaya(aya)"を選択可能にするため、[ayaya](https://marketplace.visualstudio.com/items?itemName=steve02081504.ayaya)をインストールしてください。
2. yaya/ayaの辞書ファイルを開き、画面右下の言語モードをyaya(aya)に設定します。
3. 現在ファイルが辞書として認識されたので、```Shift+Alt+f```で現在開いているファイルの整形が可能になります。

### その他
- 上記に加え、保存時に自動で整形するなどVSCode言語フォーマッタとしての基本的な機能が使えます(説明は省略)。
- 拡張機能の設定から各種設定が可能です。

---

### 0.1.8

- フォーマット失敗時に通知するように

### 0.1.6, 0.1.7

ヒアドキュメントのインデントがおかしかったのを修正

### 0.1.5 (pre release)

- 設定の初期値がおかしかったのを修正

### 0.1.4 (pre release)

- FlowKeyXXとFlowXXSubの間にBlankLineが残らないように

### 0.1.3 (pre release)

- 実行前にformatyayaの存在を確認するように

### 0.1.2 (pre release)

- ファイルの先頭・末尾の改行を削除するように

### 0.1.1 (pre release)

- 設定が機能していなかったのを修正
- 文字列内の半角スペースが削除されることがあるのを修正

### 0.1.0 (pre release)

Initial release
