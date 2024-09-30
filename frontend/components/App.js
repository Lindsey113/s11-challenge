import React, { useState } from 'react'
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom'
import Articles from './Articles'
import LoginForm from './LoginForm'
import Message from './Message'
import ArticleForm from './ArticleForm'
import Spinner from './Spinner'
import axios from 'axios'



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

  const [message, setMessage] = useState('')
  const [articles, setArticles] = useState([])
  const [currentArticleId, setCurrentArticleId] = useState(null)
  const [spinnerOn, setSpinnerOn] = useState(false)

  const navigate = useNavigate()

  const redirectToLogin = () => {
    navigate('/')
  }
  const redirectToArticles = () => {
    navigate('/articles')
  }

  const logout = () => {

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
        if (error.response && error.response.status == 401) {
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
    setSpinnerOn(true)
    return auth()
      .put(`${articlesUrl}/${article_id}`, article)
      .then((res) => {
        getArticles(success)
        setMessage(res.data.message)
        setCurrentArticleId(null)
        setSpinnerOn(false)
      })
      .catch((err) => {
        console.error('Error: ', err)
        setSpinnerOn(false)
      })
  }

  const deleteArticle = article_id => {
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
                currentArticleId={currentArticleId}
                setCurrentArticleId={setCurrentArticleId}
                updateArticle={updateArticle} />
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
