import { useRef } from "react"
import { useContext } from "react"
import { useHistory } from "react-router-dom"
import AuthContext from "../../store/auth-context"
import classes from "./ProfileForm.module.css"

const ProfileForm = () => {
  const history = useHistory()
  const authCtx = useContext(AuthContext)
  const newPasswordInputRef = useRef()

  const submitHandler = async (e) => {
    e.preventDefault()

    const enteredNewPassword = newPasswordInputRef.current.value

    try {
      const response = await fetch(
        "https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyBn-yWgo81750_pw23yY9-J2TLcRd5c4fI",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            idToken: authCtx.token,
            password: enteredNewPassword,
            returnSecureToken: false,
          }),
        }
      )
      if (!response.ok) throw new Error("password change failed")
      const data = await response.json()
      console.log(data)
      history.replace("/")
    } catch (error) {}
  }

  return (
    <form className={classes.form} onSubmit={submitHandler}>
      <div className={classes.control}>
        <label htmlFor="new-password">New Password</label>
        <input
          type="password"
          minLength={7}
          id="new-password"
          ref={newPasswordInputRef}
        />
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  )
}

export default ProfileForm
