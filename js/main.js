<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="utf-8">
  <title>404 | おいこらしょのノート / oicolatcho's notebook</title>
  <meta http-equiv="refresh" content="5;url=/">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="ページがみつかりません。 / Page not found.">
  <meta name="robots" content="noindex">
  <link rel="stylesheet" href="/css/style.css">

  <style>
    body {
      margin: 0;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 20px;
      background: var(--bg, #f4efe6);
      color: var(--text, #3f372f); 
    }

    .wrap {
      max-width: 480px;
    }

    h1 {
      font-size: 64px;
      margin: 0 0 10px 0;
      font-weight: 300;
      letter-spacing: 0.1em;
    }

    .msg {
      margin-bottom: 32px;
    }

    p {
      margin: 8px 0;
      color: var(--muted, #7a7468);
      line-height: 1.6;
    }

    .timer {
      font-size: 0.85em;
      opacity: 0.8;
      margin-top: 40px;
    }

    #seconds, #seconds-en {
      font-weight: bold;
    }

    a {
      display: inline-block;
      margin-top: 24px;
      text-decoration: underline;
      color: inherit;
      font-size: 0.9em;
    }
    
    a:hover {
      opacity: 0.7;
    }
  </style>
</head>

<body>
  <div class="wrap">
    <h1>404</h1>

    <div class="msg">
      <p>ページがみつかりません。かなしい。</p>
      <p>Page not found. A bit sad.</p>
    </div>

    <div class="timer">
      <p>
        あと <span id="seconds">5</span> 秒でトップページへもどるよ。<br>
        Redirecting in <span id="seconds-en">5</span> seconds...
      </p>
    </div>

    <a href="/">トップへもどる。 / Back to home.</a>
  </div>

  <script>
    let sec = 5;
    const secJa = document.getElementById('seconds');
    const secEn = document.getElementById('seconds-en');

    const countdown = setInterval(() => {
      sec--;
      if (secJa) secJa.textContent = sec;
      if (secEn) secEn.textContent = sec;
      
      if (sec <= 0) {
        clearInterval(countdown);
      }
    }, 1000);
  </script>
<script defer src="https://static.cloudflareinsights.com/beacon.min.js/v8c78df7c7c0f484497ecbca7046644da1771523124516" integrity="sha512-8DS7rgIrAmghBFwoOTujcf6D9rXvH8xm8JQ1Ja01h9QX8EzXldiszufYa4IFfKdLUKTTrnSFXLDkUEOTrZQ8Qg==" data-cf-beacon='{"version":"2024.11.0","token":"2a81d2b1820349cab21788c978ec85c8","r":1,"server_timing":{"name":{"cfCacheStatus":true,"cfEdge":true,"cfExtPri":true,"cfL4":true,"cfOrigin":true,"cfSpeedBrain":true},"location_startswith":null}}' crossorigin="anonymous"></script>
</body>
</html>