# ETOLEGKO — Download speed test / Замер скорости скачивания

## English

Requires **Node.js 22+**. Uses built-in APIs only; no npm dependencies.

Run from this directory:

```sh
node speed-test.mjs https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf
```

Provide exactly one valid HTTP or HTTPS URL. The script makes 10 requests
sequentially. Each request starts after the previous attempt has finished reading
the entire body or failed. The body is processed in chunks without storing it all
in memory. `fetch` follows redirects automatically; the final HTTP status is shown.

Each attempt has a **30-second timeout**, including waiting for the response and
reading the body. Only a 2xx response with a fully read body counts as successful.
HTTP errors, connection interruptions and timeouts are reported; subsequent
attempts still run. HTTP error bodies are also read, but excluded from the totals.
The exit code is 1 for invalid input or no successful attempts, otherwise 0.

Example output (middle lines omitted):

```text
URL: https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf
1/10 | HTTP 200 | 200.00 ms | 1000000 bytes | 5.000 MB/s
2/10 | HTTP 200 | 200.00 ms | 1000000 bytes | 5.000 MB/s
...
10/10 | HTTP 200 | 200.00 ms | 1000000 bytes | 5.000 MB/s

Successful attempts: 10/10
Average time: 200.00 ms
Total downloaded: 10000000 bytes (10.000 MB)
Overall speed: 5.000 MB/s
```

The summary shows successful attempts, average duration, total downloaded bytes
and overall speed.

Time is measured with `performance.now()` from immediately before `fetch` until
the body has been read completely. It includes waiting for the server response.
Speed is expressed in **MB/s**, where **1 MB = 1,000,000 bytes**:

```text
Attempt speed = (bytes / 1,000,000) / (duration in ms / 1000)
Average duration = sum of successful durations / successful attempt count
Total bytes = sum of bytes from successful attempts
Overall speed = (total bytes / 1,000,000) / (sum of successful durations / 1000)
```

Only successful attempts contribute to the summary. Overall speed uses total
bytes and total duration, rather than averaging individual speeds. Values are
rounded only for display.

The size comes from the body returned by `fetch`. With HTTP compression, the body
may already be decompressed, so its size can differ from the bytes transferred
over the network. This measures downloading from a particular URL, including
server response time.

## Русский

Нужен **Node.js 22+**. Используются только встроенные API, npm-зависимостей нет.

Запуск из текущей папки:

```sh
node speed-test.mjs https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf
```

Передайте ровно один валидный HTTP или HTTPS URL. Скрипт делает 10 запросов
строго последовательно: следующий начинается после полного чтения тела
предыдущего или завершения попытки с ошибкой. Тело обрабатывается порциями и
целиком в памяти не хранится. `fetch` автоматически следует перенаправлениям;
выводится конечный HTTP-статус.

Таймаут одной попытки — **30 секунд**, включая ожидание ответа и чтение всего
тела. Успешной считается только попытка с ответом 2xx и полностью прочитанным
телом. HTTP-ошибки, обрывы и таймауты выводятся, после чего скрипт продолжает
работу. Тело HTTP-ошибки также читается, но эта попытка не входит в итоги.
При неверном вводе или отсутствии успешных замеров код завершения — 1, иначе — 0.

Пример вывода (средние строки сокращены):

```text
URL: https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf
1/10 | HTTP 200 | 200.00 ms | 1000000 bytes | 5.000 MB/s
2/10 | HTTP 200 | 200.00 ms | 1000000 bytes | 5.000 MB/s
...
10/10 | HTTP 200 | 200.00 ms | 1000000 bytes | 5.000 MB/s

Successful attempts: 10/10
Average time: 200.00 ms
Total downloaded: 10000000 bytes (10.000 MB)
Overall speed: 5.000 MB/s
```

Время измеряется через `performance.now()` от момента перед `fetch` до полного
чтения тела, поэтому включает ожидание ответа сервера.
Скорость выражена в **MB/s**, где **1 MB = 1 000 000 байт**:

```text
Скорость попытки = (байты / 1 000 000) / (время в мс / 1000)
Среднее время = сумма времени успешных попыток / число успешных попыток
Общий объём = сумма байтов успешных попыток
Итоговая скорость = (общий объём / 1 000 000) / (сумма времени успешных попыток / 1000)
```

Итоги учитывают только успешные замеры; итоговая скорость вычисляется по суммам,
а не как среднее отдельных скоростей. Округление применяется только при выводе.

Размер берётся из тела, которое отдаёт `fetch`. При HTTP-сжатии оно может быть
уже распаковано, поэтому этот размер может отличаться от числа байтов,
переданных по сети. Это замер скачивания с конкретного URL, включающий ожидание
ответа сервера.
