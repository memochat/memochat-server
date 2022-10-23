export const redirectHtml = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Memochat</title>
  </head>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    html,
    body {
      height: 100%;
    }

    .main {
      padding: 36px 18px;
      height: 100%;
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 36px;
    }

    .title {
      font-family: 'SF Pro';
      font-style: normal;
      font-weight: 700;
      font-size: 18px;
      line-height: 150%;
      color: #000000;
      text-align: center;
    }

    img {
      width: 100%;
      margin: 0 auto;
      max-width: 500px;
      max-height: 300px;
      padding: 0 26px;
    }

    .button {
      all: unset;
      height: 52px;
      text-align: center;
      width: 100%;

      background: #686df2;
      border-radius: 16px;
      font-family: 'SF Pro';
      font-style: normal;
      font-weight: 510;
      font-size: 14px;
      line-height: 17px;
      color: #ffffff;
    }
  </style>

  <body>
    <main class="main">
      <h1 class="title">
        이메일 인증이 완료되었습니다.<br />
        앱으로 다시 돌아가주세요!
      </h1>
      <img src="https://memochat-public.s3.ap-northeast-2.amazonaws.com/email_verify_image.png" />
      <button class="button">닫기</button>
    </main>
  </body>
</html>`;
