# Change Log

### 0.2.33

fix: フィードバック演算子&が論理演算子&&と干渉して構文解析に失敗していたのを修正

### 0.2.32

- フィードバック演算子&に対応
- 
### 0.2.3, 0.2.31

- 文字列とコメントが複数行にまたがるときインデントがおかしかったのを修正
- 不要なファイルを削除

### 0.2.2

- 行末のコメントと行ごと独立したコメントの区別がついていなかったのを修正

### 0.2.1

- 整形時にコメントが消える場合があったのを修正

### 0.2.0

![formatyaya_transitoion_slash](https://user-images.githubusercontent.com/39634779/221236137-c34f5143-0f04-4fab-8ee6-2251d1d8122f.gif)

- 文末の/\nを整形時に全削除していたのを変更; 演算式中の改行などは残すように

### 0.1.9, 0.1.91

- 変数展開のないダブルクォート文字列はシングルクォート文字列に変換するように

### 0.1.8

- フォーマット失敗時に通知するように

### 0.1.6, 0.1.7

- ヒアドキュメントのインデントがおかしかったのを修正

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

- Initial release
