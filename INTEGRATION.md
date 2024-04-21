# Integration Documentation

Authentication uses the `server/controllers/session-control.js` module. It depends on the database and User model. 

This is a special controller designed for teams to use in order to verify requests from the front end. *In order to use it*: You **must** have a HTTP request header called `Authorization` with the authentication token (a UUID4 issued when the user signs in, it is stored under `localStorage.getItem("token")`. The backend will verify this token and retrieve the relevant user information.

# Front-end Requests

* Must include `Authorization` header set to the token.
* Token is stored in localStorage. It's accessible under the "token" key. This is a stored object with the token's information including expire time and user ID associated with it, along with the token's ID obviously. We use axios to make the HTTP requests, so there is an axios instance in the front end code which makes it easy to attach the `Authorization` header transparently. 
* You may attach the header directly by accessing the localStorage option, code on an example is provided below.

```jsx

// Check to make sure it won't error out when no token is there.
if (localStorage.getItem("token")) {
  return null;
}
else {
  try {
    const token = JSON.parse(localStorage.getItem("token"));
    // you now can use the token object to get the data you need.
    await fetch(`${APIURL}/example`, 
      headers: {
        "Authorization": token.token,
      }
    );
  }
  catch (e) {
    return null;
  }
}
```

## Accessing the User State for Data

In the case where you want to display something without first querying the backend for user details, such as the user's name, etc., there is a way you can do this.
When you log a user in, the backend supplies the user's "row" in the database in JSON (password hash omitted). You can access this in `localStorage` via the `user` key.

An example of getting this information from the browser:
```js
const user = JSON.parse( // Stored as a serialized JSON string, so we have to parse it
    localStorage.getItem("user")
);
```

And this should return something like:
```js
{
   "_id":"6621c832df60da5c524e0810",
    "email":"email@gmail.com",
    "firstName":"Joe",
    "lastName":"Bobbington",
    "type":"buyer",
    "buyer":{"interests":["no_preference"],"_id":"6621c832df60da5c524e0811"},
    "createdAt":"2024-04-19T01:23:54.541Z",
    "OAuth":false,
    "isAdmin":false,
    "country":"United States",
    "__v":0
}
```


# Back-end Authorization

* Middleware is available to authenticate the requests and get the token's information from the database. This is implemented in the `controllers/session-control.js` file and should be imported as `const sessionControl = require("./path/to/controllers/session-control.js");` and referenced as `sessionControl.verifyRequest(request)`. 

A more full example:
```js
const sessionControl = require("./controllers/session-control");

app.get("/example", async (req, res) => {
  const authResult = await sessionControl.verifyRequest(req); // all you need is to pass in the request object, and YES it's async.
  // IF the token is invalid, then undefined is returned. This is convenient because you can use the authResult in a boolean context for if statements. A Token object is returned. See the Token model to see more.
  if (authResult) {
    res.send(`Your user id is: ${authResult.userId}`);
  }
  else {
    res.send("unauthorized");
  }
});
```