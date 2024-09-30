import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import PT from 'prop-types'

export default function Articles(props) {

  const {
    getArticles,
    articles,
    setCurrentArticleId,
    deleteArticle } = props

  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/');
    } else if (!articles.length) {
      getArticles();
    }
  }, []);

  function loggedIn() {
    const token = localStorage.getItem('token')
    if (!token) {
      return true
    } else {
      return false
    }
  }

  return (
    <div className="articles">
      <h2>Articles</h2>
      {!articles.length
        ? "No articles yet"
        : articles.map((art) => {
          return (
            <div className="article" key={art.article_id}>
              <div>
                <h3>{art.title}</h3>
                <p>{art.text}</p>
                <p>Topic: {art.topic}</p>
              </div>
              <div>
                <button disabled={loggedIn()} onClick={() => {
                  console.log(`Editing article with ID: ${art.article_id}`)
                  setCurrentArticleId(art.article_id)
                }}>Edit</button>
                <button disabled={loggedIn()} onClick={() => deleteArticle(art.article_id)}>Delete</button>
              </div>
            </div>
          )
        })
      }
    </div>
  )
}

Articles.propTypes = {
  articles: PT.arrayOf(PT.shape({
    article_id: PT.number.isRequired,
    title: PT.string.isRequired,
    text: PT.string.isRequired,
    topic: PT.string.isRequired,
  })).isRequired,
  getArticles: PT.func.isRequired,
  deleteArticle: PT.func.isRequired,
  setCurrentArticleId: PT.func.isRequired,
  currentArticleId: PT.number,
}
