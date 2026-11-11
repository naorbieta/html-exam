---
id: exam-php-02
number: 2
type: 単一選択
title: 次のPHPを実行したときの出力はどれですか？
required: true
choices:
  - "5"
  - "32"
  - "$n + 2"
  - エラーになる
answers:
  - "5"
feedback: $n には 3 が入っており、+ は足し算なので 5 が出力されます。
---

```php
<?php
$n = 3;
echo $n + 2;
?>
```
