import React from "react";

function AuthorizationButton() {
  // This is a button shown to the end user to authenticate with
  // Strava OAuth
  // https://developers.strava.com/docs/getting-started/#:~:text=How%20to%20Make%20a%20cURL%20request%20%F0%9F%8F%82&text=Access%20tokens%20are%20required%20for,tokens%20expire%20every%20six%20hours.
  const clientID = process.env.REACT_APP_CLIENT_ID;
  const portNum = process.env.REACT_APP_FRONTEND_PORT;
  const redirectUrl = `http://localhost:${portNum}/redirect`;
  console.log(redirectUrl);
  const handleAuth = () => {
    window.location = `http://www.strava.com/oauth/authorize?client_id=${clientID}&response_type=code&redirect_uri=${redirectUrl}&approval_prompt=force&scope=read,activity:read_all`;
  };

  return (
    <div>
      <button onClick={handleAuth}>Authorize with Strava</button>
    </div>
  );
}

export default AuthorizationButton;
