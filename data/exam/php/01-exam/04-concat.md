---
id: exam-php-04
number: 4
type: 単一選択
title: 次のPHPを実行したときの出力はどれですか？
required: true
choices:
  - こんにちは、太郎
  - こんにちは、$name
  - こんにちは、.太郎
  - エラーになる
answers:
  - こんにちは、太郎
feedback: PHP ではピリオド（.）が文字列の連結です。$name の値「太郎」がつながります。
---

```php
<?php
$name = "太郎";
echo "こんにちは、" . $name;
?>
```
