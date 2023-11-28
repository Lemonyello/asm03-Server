const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const path = require("path");

const getMailView = (savedOrder) => {
  let list = "";
  const { products, name, phone, address, bill } = savedOrder;

  for (const prod of products) {
    const { name, img1, price } = prod._id;
    list += `
            <tr>
              <td class="product-name">${name}</td>
              <td class="image"><img
                  src="${img1.includes("funix") ? img1 : "cid:" + img1}"
                  alt="${name}"
                /></td>
              <td class="price">${price
                .toLocaleString()
                .split(",")
                .join(".")} VND</td>
              <td class="quantity">${prod.quantity}</td>
              <td class="price">${(price * prod.quantity)
                .toLocaleString()
                .split(",")
                .join(".")} VND</td>
            </tr>
          `;
    list += "\n";
  }

  const html = `
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Document</title>
    <style>
    .page {
      margin-left: 32px;
    }
    
    .page p {
      font-weight: bold;
    }
    
    table {
      width: 100%;
    }
    
    td {
      border: 1px solid black;
      text-align: center;
      padding: 8px;
    }
    
    tr td {
      font-size: 18px;
    }
    
    thead td {
      font-size: 14px;
    }
    
    .product-name {
      width: 35%;
    }
    
    .image {
      width: 12%;
    }
    
    .image img {
      width: 100%;
    }
    
    .quantity {
      width: 8%;
    }
    
    .price {
      width: 10%;
    }
    </style>
  </head>
  <body>
    <div class="page">
      <h1>Xin Chào ${name}</h1>
      <p>Phone: ${phone}</p>
      <p>Address: ${address}</p>
      <table>
        <thead>
          <td>Tên Sản Phẩm</td>
          <td>Hình Ảnh</td>
          <td>Giá</td>
          <td>Số Lượng</td>
          <td>Thành Tiền</td>
        </thead>
        <tbody>
          ${list}
        </tbody>
      </table>

      <h2>Tổng Thanh Toán:</h2>
      <h2>${bill.toLocaleString().split(",").join(".")} VND</h2>

      <h1>Cảm ơn bạn!</h1>
    </div>

  </body>
</html>
  `;

  return html;
};

exports.sendMail = async (savedOrder) => {
  const CLIENT_ID =
    "850796454600-n9mk1d3g5s5c78cb5v8cb1oprb3otit6.apps.googleusercontent.com";
  const CLIENT_SECRET = "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";
  const REDIRECT_URI = "https://developers.google.com/oauthplayground";
  // const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

  const REFRESH_TOKEN =
    "1//04yAUnKdIEr_gCgYIARAAGAQSNwF-L9IrxDV4oqXmvlJgkMLU86QgAY2rYLib7Fj6M1XREC1LAa19FrieUTfCKgSVxiB2J0DTYBs";
  const oAuth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
  );

  oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
  let accessToken;
  try {
    accessToken = await oAuth2Client.getAccessToken();
  } catch (error) {}

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "hangpham.ptit18@gmail.com",
      type: "OAuth2",
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      refreshToken: REFRESH_TOKEN,
      accessToken: accessToken,
    },
  });

  const mailOptions = {
    from: "hangpham.ptit18@gmail.com",
    to: savedOrder.userId.email,
    subject: "Order Successfully!",
    html: getMailView(savedOrder),
    attachments: savedOrder.products.map((prod) => {
      return {
        filename: prod._id.img1,
        path: prod._id.img1.includes("funix")
          ? prod._id.img1
          : path.join(
              path.dirname(require.main.filename),
              "images",
              prod._id.img1
            ),
        cid: prod._id.img1, //same cid value as in the html img src
      };
    }),
  };

  transporter.sendMail(mailOptions, (error, info) => {});
};
