import { useState, useEffect } from 'react'
import { getFragrances } from '../services/fragrances'

export const useFragrances = () => {
  const [fragrances, setFragrances] = useState([])

  useEffect(() => {
    getFragrances().then(data => {
      setFragrances(data.map(fragrance => ({
        value: fragrance.name,
        label: fragrance.name
      })))
    })
  }, [])
  
  return { fragrances }
}