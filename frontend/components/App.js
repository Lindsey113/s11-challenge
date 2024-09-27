import React, { useState, useEffect } from 'react'
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom'
import Articles from './Articles'
import LoginForm from './LoginForm'
import Message from './Message'
import ArticleForm from './ArticleForm'
import Spinner from './Spinner'
import axios from 'axios'
import e from 'cors'


const articlesUrl = 'http://localhost:9000/api/articles'
const loginUrl = 'http://localhost:9000/api/login'
const success = true
const auth = () => {
  const token = localStorage.getItem('token');
  return axios.create({
    headers: {
      authorization: token,
    }
  })
}

export default function App() {
  // ✨ MVP can be achieved with these states
  const [message, setMessage] = useState('')
  const [articles, setArticles] = useState([])
  const [currentArticleId, setCurrentArticleId] = useState()
  const [spinnerOn, setSpinnerOn] = useState(false)

  // ✨ Research `useNavigate` in React Router v.6
  const navigate = useNavigate()

  const redirectToLogin = () => {
    navigate('/')
  }
  const redirectToArticles = () => {
    navigate('/articles')
  }

  const logout = () => {

    // ✨ implement
    // If a token is in local storage it should be removed
    // and a message saying "Goodbye!" should be set in its proper state.
    // In any case, we should redirect the browser back to the login screen,
    // using the helper above.

    const token = localStorage.getItem('token')
    if (!token) {
      redirectToLogin()
    } else {
      localStorage.removeItem('token')
      setMessage('Goodbye!')
      redirectToLogin()
      setArticles([])
    }
  }

  const login = async ({ username, password }) => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch a request to the proper endpoint.
    // On success, we should set the token to local storage in a 'token' key,
    // put the server success message in its proper state, and redirect
    // to the Articles screen. Don't forget to turn off the spinner!


    setMessage('')
    setSpinnerOn(true)
    try {
      const response = await fetch(loginUrl, {
        method: 'POST',
        headers: new Headers({
          'Content-Type': 'application/json'
        }),
        body: JSON.stringify({ username, password })
      })
      const data = await response.json()
      if (response.ok) {
        localStorage.setItem('token', data.token)
        setMessage(data.message || 'Login successful')
        redirectToArticles()
      } else {
        setMessage(data.message || "Login failed")
      }

    } catch (err) {
      setMessage(err)
    } finally {
      setSpinnerOn(false)
    }
  }


  const getArticles = (success) => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch an authenticated request to the proper endpoint.
    // On success, we should set the articles in their proper state and
    // put the server success message in its proper state.
    // If something goes wrong, check the status of the response:
    // if it's a 401 the token might have gone bad, and we should redirect to login.
    // Don't forget to turn off the spinner!



    setMessage('')
    setSpinnerOn(true)

    auth()
      .get(articlesUrl)
      .then((res) => {
        if (!success) {
          setMessage(res.data.message)
        } 
        setArticles(res.data.articles)
      })
      .catch((error) => {
        if(error.response && error.response.status == 401){
          redirectToLogin()
        } else {
          setMessage('An error occured')
        }
      })
      .finally(() => {
        setSpinnerOn(false)
      })


  }







  const postArticle = (article) => {
    // ✨ implement
    // The flow is very similar to the `getArticles` function.
    // You'll know what to do! Use log statements or breakpoints
    // to inspect the response from the server.
    setSpinnerOn(true)
    return auth()
      .post(articlesUrl, article)
      .then((res) => {
        getArticles(success)
        setMessage(res.data.message)
        setSpinnerOn(false)

      })
      .catch((err) => {
        setSpinnerOn(false)
        console.log(err)
      })
  }

  const updateArticle = ({ article_id, article }) => {
    // ✨ implement
    // You got this!
    setSpinnerOn(true)
    return auth()
    .put(`${articlesUrl}/${article_id}`, article)
    .then((res) => {
      getArticles(success)
      setMessage(res.data.message)
      setCurrentArticleId()
      setSpinnerOn(false)
    })
    .catch((err) => {
      console.error('Error: ', err)
      setSpinnerOn(false)
    })
  }

  const deleteArticle = article_id => {
    // ✨ implement
    setSpinnerOn(true)
    return auth()
    .delete(`${articlesUrl}/${article_id}`)
    .then((res) => {
      getArticles(success)
      setMessage(res.data.message)
      setSpinnerOn(false)
    })
    .catch((err) => {
      console.error('Error: ', err)
      setSpinnerOn(false)
    })
  }

  return (
    // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
    <>
      <Spinner on={spinnerOn} />
      <Message message={message} />
      <button id="logout" onClick={logout}>Logout from app</button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}> {/* <-- do not change this line */}
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">Login</NavLink>
          <NavLink id="articlesScreen" to="/articles">Articles</NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm login={login} />} />
          <Route path="articles" element={
            <>
              <ArticleForm 
              articles={articles}
              postArticle={postArticle}
              currentArticle={currentArticleId}
              setCurrentArticleId={setCurrentArticleId}
              updateArticle={updateArticle}/>
              <Articles 
              articles={articles}
              getArticles={getArticles}
              deleteArticle={deleteArticle}
              setCurrentArticleId={setCurrentArticleId} />
            </>
          } />
        </Routes>
        <footer>Bloom Institute of Technology 2024</footer>
      </div>
    </>
  )
}
