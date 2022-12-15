import React, { useState, useEffect, useRef } from 'react'
import { FaSearch } from 'react-icons/fa'
import Photo from './Photo'
//defined in .env file
const clientID = `?client_id=${process.env.REACT_APP_ACCESS_KEY}`

const mainUrl = `https://api.unsplash.com/photos/`
const searchUrl = `https://api.unsplash.com/search/photos/`

function App() {

  const [loading, setLoading] = useState(false)
  const [photos, setPhotos] = useState([]);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');

  const mounted = useRef(false)
  const [newImages, setNewImages] = useState(false)
  const fetchImages = async () => {
    try {
      setLoading(true)
      let url;

      const urlPage = `&page=${page}`
      const urlQuery = `&query=${query}`
      if (query) {
        url = `${searchUrl}${clientID}${urlPage}${urlQuery}`;
      } else {
        url = `${mainUrl}${clientID}${urlPage}`
      }

      const response = await fetch(url);
      const data = await response.json();
      setPhotos((oldPhotos) => {
        if (query && page === 1) {
          return data.results
        } else if (query) {
          return [...oldPhotos, ...data.results]
        } else {
          return [...oldPhotos, ...data]
        }

      });
      setNewImages(false)
      setLoading(false)
      //console.log(data)
    } catch (error) {
      setNewImages(false)
      console.log(error)
      setLoading(false)
    }
  }
  useEffect(() => { //renders if page changes
    fetchImages()
    //eslink-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  useEffect(() => {
    if (!mounted.current) { //doesnot render initially
      mounted.current = true
      return
    }
    if (!newImages) return; //is false stop
    if (loading) return; // true stop

    setPage((oldPage) => oldPage + 1); // newimages true . update page
    
  }, [newImages])

  const event = () => {
    if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 2) {
      setNewImages(true)
    }
  }
  useEffect(() => {
    window.addEventListener('scroll', event);
    return () => window.removeEventListener('scroll', event);

  }, [])

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query) return;

    if (page === 1) {
      fetchImages()
      return;
    }
    setPage(1)

  }
  return (
    <>
      <section className='search'>
        <form className='search-form'>
          <input type="text" placeholder="search" className='form-input' value={query} onChange={(e) => setQuery(e.target.value)} />
          <button type='submit' className='submit-btn' onClick={handleSubmit}>< FaSearch /></button>
        </form>
      </section>
      <section className='photos'>
        <div className="photos-center">
          {photos.map((photo, index) => {

            return (
              <Photo key={photo.id}  {...photo} />)
          })}

        </div>
        {loading && <h2 className='loading'>Loading...</h2>}
      </section>
    </>
  )
}

export default App
