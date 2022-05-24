import { useState } from "react"
import { useRef } from "react"
import { useContext } from "react"
import { useHistory } from "react-router-dom"
import AuthContext from "../../store/auth-context"

import classes from "./AuthForm.module.css"

const AuthForm = () => {
  const history = useHistory()
  const authCtx = useContext(AuthContext)

  const emailInputRef = useRef()
  const passwordInputRef = useRef()
  const [isLogin, setIsLogin] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState)
  }

  const submitFormHandler = async (e) => {
    e.preventDefault()

    const enteredEmail = emailInputRef.current.value
    const enteredPassword = passwordInputRef.current.value

    // optional: validate imput value here
    setIsLoading(true)
    let url
    if (isLogin) {
      url =
        "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBn-yWgo81750_pw23yY9-J2TLcRd5c4fI"
    } else {
      url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBn-yWgo81750_pw23yY9-J2TLcRd5c4fI`
    }
    try {
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify({
          email: enteredEmail,
          password: enteredPassword,
          returnSecureToken: true,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      })
      setIsLoading(false)
      if (response.ok) {
        const data = await response.json()
        authCtx.login(data.idToken)
        history.replace("/")
      } else {
        const data = await response.json()
        // Show error message
        let errorMessage = "Authentication Failed"
        if (data && data.error && data.error.message) {
          errorMessage = data.error.message
        }

        throw new Error(errorMessage)
      }
    } catch (error) {
      alert(error.message)
    }
  }

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? "Login" : "Sign Up"}</h1>
      <form onSubmit={submitFormHandler}>
        <div className={classes.control}>
          <label htmlFor="email">Your Email</label>
          <input type="email" id="email" required ref={emailInputRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor="password">Your Password</label>
          <input
            type="password"
            id="password"
            required
            ref={passwordInputRef}
          />
        </div>
        <div className={classes.actions}>
          {!isLoading && (
            <button>{isLogin ? "Login" : "Create Account"}</button>
          )}
          {isLoading && <p>Sending Request...</p>}
          <button
            type="button"
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? "Create new account" : "Login with existing account"}
          </button>
        </div>
      </form>
    </section>
  )
}

export default AuthForm
