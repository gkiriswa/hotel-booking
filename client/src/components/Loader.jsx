import React, { useEffect } from 'react'
import { useAppContext } from '../context/AppContext'
import { useParams } from 'react-router-dom'

const Loader = () => {
    const {navigate} = useAppContext()
    const {nextUrl} = useParams()

    useEffect(() => {
        let timer;
        if (nextUrl) {
            timer = setTimeout(() => {
                navigate(`/${nextUrl}`)
            }, 8000)
        }
        
        return () => clearTimeout(timer)
    }, [nextUrl, navigate])

  return (
    <div className="flex items-center justify-center h-screen">
        <div className='animate-spin rounded-full h-24 w-24 border-4
         border-gray-300 border-t-primary'>

        </div>
        
    </div>
  )
}

export default Loader