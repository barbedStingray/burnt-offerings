import { useState, useEffect } from 'react'
import axios from 'axios'

export default function useAllCategory(apiPath) {
    const [allOfCategory, setAllOfCategory] = useState([])
    const [categoryStatus, setCategoryStatus] = useState('unloaded')

    useEffect(() => {
      requestAllOfCategory()
    }, [apiPath])

    async function requestAllOfCategory() {
      setAllOfCategory([])
      setCategoryStatus('loading')
      try {
        const categoryResults = await axios.get(apiPath)
        setAllOfCategory(categoryResults.data)
        setCategoryStatus('loaded')
      } catch (error) {
        console.log('error in loading api recipes')
        alert('check your connection!')
      }
    }
    return [allOfCategory, categoryStatus]
  }

