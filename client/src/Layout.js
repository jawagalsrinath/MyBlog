
import {Outlet} from "react-router-dom"
import Header from "./Header";

export default function Layout(){
    return(
        <main>
            <Header />
            <Outlet />
        </main>
    );
}


/*
import { useContext, useEffect, useState } from "react";
import {Link} from "react-router-dom"
import { UserContext } from "./UserContext";

export default function Header(){
  const {setUserInfo,userInfo} = useContext(UserContext);
  useEffect(() => {
    fetch('http://localhost:4000/profile', {
      credentials:'include',
    }).then(response =>{
      response.json().then(userInfo => {
        setUserInfo(userInfo);
      })
    })
  },[]);

  function logout(){
    fetch('http://localhost:4000/logout', {
      credentials: 'include',
      method: 'POST'
    })
    setUserInfo(null);
  }

  const username = userInfo?.username;

  return(
    <header>
      <Link to="/" className="logo">MyBlog</Link>
      <nav>
        {username &&(
          <>
          <Link to="/create">Create new post</Link>
          <a onClick={logout}>Logout</a>
          </>
        )}
        {!username &&(
          <>
          <Link to="/login">Login</Link>
          <Link to="/register">Registration</Link>
          </>
        )}
      </nav>
    </header>
  );
}



import { createContext, useState } from "react";

export const UserContext = createContext({});

export function UserContextProvider({children}){
    const [userInfo,setUserInfo] = useState({});
    return (
        <UserContext.Provider value={{userInfo,setUserInfo}}>
            {children}
        </UserContext.Provider>
    );
} 

*/