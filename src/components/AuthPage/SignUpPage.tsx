import React, { useState } from "react";
import { Link } from 'react-router-dom'

const SignUpPage = () => {

  //React hooks
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState(null);

  //Creating User
  const createUserHandler = (event: any, email: any, password: any) => {
    event.preventDefault();
    setEmail("");
    setPassword("");
    setUsername("");
  };

  const onChangeHandler = (event: any) => {
    const { name, value } = event.currentTarget;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    } else if (name === "username") {
      setUsername(value);
    }
  };
  
  return (
    <div>
      <h1>Sign Up</h1>
      <div>{error !== null && ({error})}</div>
        <form>
          <label htmlFor="username">
            Username:
          </label>
          <input
            type="text"
            name="username"
            value={username}
            placeholder="Username"
            id="username"
            onChange={event => onChangeHandler(event)}
          />
          <label htmlFor="email">
            Email:
          </label>
          <input
            type="email"
            name="email"
            value={email}
            placeholder="Foobar@gmail.com"
            id="email"
            onChange={event => onChangeHandler(event)}
          />
          <label htmlFor="password">
            Password:
          </label>
          <input
            type="password"
            name="password"
            value={password}
            placeholder="Password"
            id="password"
            onChange={event => onChangeHandler(event)}
          />
          <button
            onClick={event => {
              createUserHandler(event, email, password);
            }}
          >
            Sign up
          </button>
        </form>
        <button>Sign In with Google</button>
        <p>
          Already have an account?{" "}
          <Link to="/signin">
            Sign in here
          </Link>
        </p>
      </div>
  );
};
export { SignUpPage };