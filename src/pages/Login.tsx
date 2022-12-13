import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PublicLayout from "../layout/PublicLayout";
import "./login.css";

async function loginUser(credentials: { username: string; password: string }) {
  return fetch("http://localhost:3010/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  }).then((data) => data.json());
}

export default function Login(props: { setToken: any }) {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const token = await loginUser({
      username,
      password,
    });
    console.log(token);

    props.setToken(token);
    navigate("/libraries");
  };

  return (
    <PublicLayout activeLink='login'>
      <div className='login'>
        <h2>Please Log In</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor='login-username'>Username</label>
          <input
            id='login-username'
            type='text'
            onChange={(e) => setUserName(e.target.value)}
          />
          <label htmlFor='login-password'>Password</label>
          <input
            id='login-password'
            type='password'
            onChange={(e) => setPassword(e.target.value)}
          />
          <div>
            <button type='submit'>Submit</button>
          </div>
        </form>
      </div>
    </PublicLayout>
  );
}
