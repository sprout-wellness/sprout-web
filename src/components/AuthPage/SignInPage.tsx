import React, {useState} from 'react'
import { Link } from 'react-router-dom'

const SignInPage = () => {
    // React hooks
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)

    //Handles Sign in clicks
    const signInHandler = (event: any, email: any, password: any) => {
        event.preventDefault();
    }

    const onChangeHandler = (event: any) => {
        const {name, value} = event.currentTarget;

          if(name === 'userEmail') {
              setEmail(value);
          }
          else if(name === 'userPassword'){
            setPassword(value);
          }
      };

  return (
    <div>
      <h1>Sign In</h1>
      <div>
        {error !== null && {error}}
        <form>
          <label htmlFor="userEmail">
            Email:
          </label>
          <input
            type="email"
            name="userEmail"
            value = {email}
            placeholder="Foobar@gmail.com"
            id="userEmail"
            onChange = {(event) => onChangeHandler(event)}
          />
          <label htmlFor="userPassword">
            Password:
          </label>
          <input
            type="password"
            name="userPassword"
            value = {password}
            placeholder="Password"
            id="userPassword"
            onChange = {(event) => onChangeHandler(event)}
          />
          <button onClick = {(event) => {signInHandler(event, email, password)}}>
            Sign in
          </button>
        </form>
        <button>
          Sign in with Google
        </button>
        <p>
          Don't have an account? <Link to="/signup">Sign up here</Link>
        </p>
        <p>
          <Link to = "/reset">
            Forgot Password?
          </Link>
        </p>
      </div>
    </div>
  );
};

export { SignInPage }
