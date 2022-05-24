import React from "react"
import { useState } from "react"

const AuthContext = React.createContext({
  token: "",
  isloggedIn: false,
  login: (token) => {},
  logout: () => {},
})
export const AuthContextProvider = (props) => {
  const initialToken = localStorage.getItem("token")
  const [token, setToken] = useState(initialToken)

  const isloggedIn = !!token

  const loginHandler = (token) => {
    setToken(token)
    localStorage.setItem("token", token)
  }

  const logoutHandler = () => {
    setToken(null)
    localStorage.removeItem("token")
  }

  const AuthContextValue = {
    token: token,
    isloggedIn: isloggedIn,
    login: loginHandler,
    logout: logoutHandler,
  }

  return (
    <AuthContext.Provider value={AuthContextValue}>
      {props.children}
    </AuthContext.Provider>
  )
}

export default AuthContext