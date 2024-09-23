import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PT from 'prop-types'

export default function Articles(props) {
  // ✨ where are my props? Destructure them here
  const {
    getArticles,
    articles,
    setCurrentArticleId,
    deleteArticle } = props

  const token = localStorage.getItem('token')
  // ✨ implement conditional logic: if no token exists
  // we should render a Navigate to login screen (React Router v.6)
  const navigate = useNavigate()

  useEffect(() => {
    // ✨ grab the articles here, on first render only

    if(!token) {
      return navigate('/')
    }
    if(!articles.length) {
      return getArticles()
    }

    // function fetchArticles() {
    //   fetch('http://localhost:9000/api/articles')
    // .then (res => {
    //   if(!token) {
    //     navigate('/')
    //   }

    //   if(!res.ok) {
    //     throw new Error ('Error!!!')
    //   } 
    // }) 
    // .catch(err => {
    //   console.error(err)
    // })
    // }
    // fetchArticles()
  }, [])

  function loggedIn() {
    if(!token) {
      return true
    } else {
      return false
    }
  }

  return (
    // ✨ fix the JSX: replace `Function.prototype` with actual functions
    // and use the articles prop to generate articles
    <div className="articles">
      <h2>Articles</h2>
      {
        ![].length
          ? 'No articles yet'
          : [].map(art => {
            return (
              <div className="article" key={art.article_id}>
                <div>
                  <h3>{art.title}</h3>
                  <p>{art.text}</p>
                  <p>Topic: {art.topic}</p>
                </div>
                <div>
                  <button disabled={loggedIn()} onClick={Function.prototype}>Edit</button>
                  <button disabled={loggedIn()} onClick={() => deleteArticle(art.article_id)}>Delete</button>
                </div>
              </div>
            )
          })
      }
    </div>
  )
}

// 🔥 No touchy: Articles expects the following props exactly:
Articles.propTypes = {
  articles: PT.arrayOf(PT.shape({ // the array can be empty
    article_id: PT.number.isRequired,
    title: PT.string.isRequired,
    text: PT.string.isRequired,
    topic: PT.string.isRequired,
  })).isRequired,
  getArticles: PT.func.isRequired,
  deleteArticle: PT.func.isRequired,
  setCurrentArticleId: PT.func.isRequired,
  currentArticleId: PT.number, // can be undefined or null
}
