import React, { useEffect, useState } from 'react'
import PT from 'prop-types'

const initialFormValues = { title: '', text: '', topic: '' }

export default function ArticleForm(props) {
  const [values, setValues] = useState(initialFormValues)
  const {
    articles,
    setCurrentArticleId,
    currentArticleId,
    postArticle,
    updateArticle
  } = props


  useEffect(() => {

    if (currentArticleId && articles.length > 0) {
      const currentArticle = articles.find(
        (item) => item.article_id === currentArticleId
      )
      if (currentArticle) {
        setValues(currentArticle)
      }
    } else {
      setValues(initialFormValues)
    }
  }, [currentArticleId, articles])

  const onChange = (evt) => {
    const { id, value } = evt.target
    setValues({ ...values, [id]: value })
  }

  const onSubmit = (evt) => {
    evt.preventDefault()
    if (currentArticleId) {
      let data = {
        article_id: currentArticleId,
        article: values
      }
      updateArticle(data)
        .then(() => {
          setValues(initialFormValues)
        })
        .catch((err) => {
          console.error('Error: ', err)
        })
    } else {
      postArticle(values)
        .then(() => {
          setValues(initialFormValues)
        })
        .catch((err) => {
          console.error('Error: ', err)
        })
    }
  }

  const isDisabled = () => {

    if (values.text && values.title && values.topic) {
      return false
    } return true
  }

  const cancel = (evt) => {
    evt.preventDefault()
    setCurrentArticleId()
    setValues(values)
  }

  return (

    <form id="form" onSubmit={onSubmit}>
      <h2>{currentArticleId ? 'Edit Article' : 'Create Article'}</h2>
      <input
        maxLength={50}
        onChange={onChange}
        value={values.title}
        placeholder="Enter title"
        id="title"
      />
      <textarea
        maxLength={200}
        onChange={onChange}
        value={values.text}
        placeholder="Enter text"
        id="text"
      />
      <select onChange={onChange} id="topic" value={values.topic}>
        <option value="">-- Select topic --</option>
        <option value="JavaScript">JavaScript</option>
        <option value="React">React</option>
        <option value="Node">Node</option>
      </select>
      <div className="button-group">
        <button disabled={isDisabled()} id="submitArticle">Submit</button>
        <button onClick={(evt) => cancel(evt)}>Cancel edit</button>
      </div>
    </form>
  )
}


ArticleForm.propTypes = {
  postArticle: PT.func.isRequired,
  updateArticle: PT.func.isRequired,
  setCurrentArticleId: PT.func.isRequired,
  currentArticle: PT.shape({ // can be null or undefined, meaning "create" mode (as opposed to "update")
    article_id: PT.number.isRequired,
    title: PT.string.isRequired,
    text: PT.string.isRequired,
    topic: PT.string.isRequired,
  })
}
