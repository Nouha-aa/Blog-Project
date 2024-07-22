import { Button, Modal } from 'flowbite-react';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { getPost, patchPost, updatePost } from '../services/api';

export default function EditPost({postId, onClose, onUpdate}) {
  const [openModal, setOpenModal] = useState(true);
  const navigate = useNavigate()
  const { id } = useParams();
  const [message, setMessage] = useState('');
  const [editCoverFile, setEditCoverFile] = useState(null)
  const [post, setPost] = useState({
    title: "",
    category: "",
    content: "",
    readTime: { value: 1, unit: "minutes" },
    author: "",
  })
    //creo stati per modificare i post
  const [editPost, setEditPost] = useState({
    title: "",
    category: "",
    content: "",
    readTime: { value: 1, unit: "minutes" },
    author: "",
  })
  
  //funzione per il recupero del post
  useEffect(() => {
    const fetchPost = async () => {
      if(!postId) {
        console.log('id del post non trovato');
        return;
      }
      try {
        const response = await getPost(postId);
        setPost(response.data);
        setEditPost(response.data);
      } catch (error) {
        console.error('Errore nel recupero del post:', error);
      }
    }
    fetchPost();
  }, [postId]);

  //funzione per la modifica del post
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    if (name === "readTimeValue") {
      setEditPost(prev => ({
        ...prev,
        readTime: { ...prev.readTime, value: parseInt(value) },
      }));
    } else {
      setEditPost(prev => ({ ...prev, [name]: value }));
    }
  };

  //funzione per la modifica del file
  const handleEditFileChange = (e) => {
    setEditCoverFile(e.target.files[0]);
  };

  //funzione per l'invio del post
  const handleSubmit = async (e) => {
    e.preventDefault();
    //console.log("stato del post prima dell'invio", post);
    try {
      const formData = new FormData();
      
      formData.append('category', editPost.category);
      formData.append('title', editPost.title);
      formData.append('author', editPost.author);
      formData.append('content', editPost.content);
      formData.append('readTime.value', editPost.readTime.value.toString());
      formData.append('readTime.unit', editPost.readTime.unit);
  
      if (editCoverFile) {
        formData.append('cover', editCoverFile);
      }

      //invio i dati del post al backend
      const updatedPost = await patchPost(postId, formData);
      setMessage('Post aggiornato con successo');

      onUpdate(updatedPost);
      // Invia i dati del post al backend
      setTimeout(() => {
        onClose();
        navigate('/');
      }, 1000);
      // Naviga alla rotta della home dopo la creazione del post
      // navigate("/");
    } catch (error) {
      console.error('Errore nell\'aggiornamento del post:', error);
      setMessage('Errore nell\'aggiornamento del post');
    }
  };


  return (
  
      <Modal show={true} onClose={onClose}>
        <Modal.Header>Modifica Post</Modal.Header>
        <Modal.Body>
        <div className="container">
          <form className="create-post-form" onSubmit={handleSubmit}>
            {/* Campo per il titolo */}
            <div className="form-group">
              <label>Titolo</label>
              <input
                type="text"
                id="title"
                name="title"
                value={editPost.title}
                onChange={handleEditChange}
                //onChange={handleChange}
                required
              />
            </div>
            {/* Campo per la categoria */}
            <div className="form-group">
              <label>Categoria</label>
              <input
                type="text"
                id="category"
                name="category"
                value={editPost.category}
                onChange={handleEditChange}
                required
              />
            </div>
            {/* Campo per il contenuto HTML */}
            <div className="form-group">
              <label>Contenuto</label>
              <textarea
                id="content"
                name="content"
                value={editPost.content}
                onChange={handleEditChange}
                required
              />
            </div>
            {/* Campo per l'upload del file di copertina */}
            <div className="form-group">
              <label>Immagine di copertina</label>
              <input
                type="file"
                id="cover"
                name="cover"
                onChange={handleEditFileChange}
              />
            </div>
            {/* Campo per il tempo di lettura */}
            <div className="form-group">
              <label>Tempo di lettura (minuti)</label>
              <input
                type="number"
                min="1"
                id="readTimeValue"
                name="readTimeValue"
                value={editPost.readTime.value}
                onChange={handleEditChange}
                required
              />
            </div>
            {/* Campo per l'email dell'autore */}
            <div className="form-group">
              <label>Email autore</label>
              <input
                type="email"
                id="author"
                name="author"
                value={editPost.author}
                onChange={handleEditChange}
                required
              />
            </div>
            {/* Pulsante di invio */}
          </form>
          { message && <p className="message">{message}</p> }
        </div>
        </Modal.Body>
        <Modal.Footer>
        <Button color="blue" onClick={handleSubmit}>Save Changes</Button>
          <Button onClick={onClose}>Close</Button>
        </Modal.Footer>
      </Modal>
  )
}
