const { DynamoDBClient, PutItemCommand } = require("@aws-sdk/client-dynamodb");
const { marshall } = require("@aws-sdk/util-dynamodb");
const client = new DynamoDBClient({ region: "ap-northeast-1" });
const crypto = require('crypto');
const TableName = "team2_user";

/*** 通常版の解答例(発展課題を含む最終版は下にあります。) ***/
// exports.handler = async (event, context) => {
//   const response = {
//     statusCode: 200,
//     headers: {
//       "Access-Control-Allow-Origin": "*",
//     },
//     body: JSON.stringify({ message: "" }),
//   };

//   // { varName }のような形式を分割代入と呼び、右側のオブジェクトの中からvarNameプロパティを変数varNameとして切り出すことができる
//   // (https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)
//   const { userId, password ,age } = JSON.parse(event.body);
//   console.log(event.body);
//   const param = {
//     // ↓プロパティ名と変数名が同一の場合は、値の指定を省略できる。
//     TableName, // TableName: TableNameと同じ意味
//     Item: marshall({
//       userId, // userId: userIdと同じ意味
//       age, // age: ageと同じ意味
//       password, // password: passwordと同じ意味
//       "exp":0
//     }),
//   };

//   const command = new PutItemCommand(param);

//   try {
//     await client.send(command);
//     response.statusCode = 201;
//     response.body = JSON.stringify({ userId, age });
//   } catch (e) {
//     response.statusCode = 500;
//     response.body = JSON.stringify({
//       message: "予期せぬエラーが発生しました。",
//       errorDetail: e.toString(),
//     });
//   }

//   return response;
// };


exports.handler = async (event, context) => {
  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({ message: "" }),
  };

  const body = event.body ? JSON.parse(event.body) : null;
  if (!body || !body.name || !body.age || !body.password) {
    response.statusCode = 400;
    response.body = JSON.stringify({
      message:
        "無効なリクエストです。request bodyに必須パラメータがセットされていません。",
    });

    return response;
  }
  
  // UUID生成
  const userId = crypto.randomUUID();
  const { name, age, password } = body;
  const param = {
    TableName,
    Item: marshall({
      userId, 
      name,
      age,
      password, 
      "exp":0, 
      "level":0,
    }),
  };

  const command = new PutItemCommand(param);

  try {
    await client.send(command);
    response.statusCode = 201;
    response.body = JSON.stringify({
      userId,
      age,
      token: "",
    });
  } catch (e) {
    response.statusCode = 500;
    response.body = JSON.stringify({
      message: "予期せぬエラーが発生しました。",
      errorDetail: e.toString(),
    });
  }

  return response;
};
