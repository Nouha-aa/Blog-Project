import React from 'react';
import { useState, useEffect } from "react";
import { getComments, deleteComment, updateComment, createComment, getMe} from "../services/api";
import * as Flowbite from 'flowbite-react';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaComment } from "react-icons/fa";
import { FaCog } from "react-icons/fa";

export default function Comments({postId, loggedIn, setLoggedIn, author, setAuthor}) {
    const [openModal, setOpenModal] = useState(false); // stato per aprire e chiudere il modal
    console.log(author);
    //  creo stato per aprire e chiudere il modale
    const [openEditModal, setOpenEditModal] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    // creo gli stati per memorizzare i dati dei comment e del nuovo commento
    const [comments, setComments] = useState([]); // commenti
    const [newComment, setNewComment] = useState({
      name: author.nome,
      email: author.email,
      comment: ""
    }); // nuovo commento
    // creo uno stato per memorizzare i dati del commento modificato
    const [editingComment, setEditingComment] = useState(null);
    // creo uno stato per memorizzare i commenti modificati
    const [editedComments, setEditedComments] = useState({
        name: author.nome,
        email: author.email,
        comment: ""
    });

// creo un UseEffect che carica i commenti quando il componente viene montato
  useEffect(() => {
    const fetchComments = async () => {
        try {
            const commentsData = await getComments(postId);
            //console.log(comments.data);
            setComments(commentsData.data);
        } catch (error) {
            console.error("Errore durante il recupero dei commenti:", error);
        }
    }

    fetchComments();
  }, [postId, openModal, openEditModal]);


// funzione per aggiungere un nuovo commento
const addNewComment = async () => {
  if (!loggedIn) {
    alert("Devi effettuare il login per commentare.");
    return;
  }

  if (!newComment.comment.trim()) {
    alert("Il commento non può essere vuoto.");
    return;
  }

  try {
    const commentData = {
      name: author.nome,
      email: author.email,
      comment: newComment.comment.trim()
    };

    const response = await createComment(postId, commentData);
    setComments([...comments, response.data]);
    setNewComment({
      name: author.nome,
      email: author.email,
      comment: ""
    });
  } catch (error) {
    console.error("Errore durante l'aggiunta del commento", error);
    if (error.response) {
      alert(`Errore: ${error.response.data.message || 'Si è verificato un errore durante aggiunta del commento.'}`);
    } else {
      alert("Si è verificato un errore durante l'aggiunta del commento. Riprova più tardi.");
    }
  } finally {
    setOpenModal(false);
  }
}
// funzione per modificare un commento
const editComment = async ()=> {
    if (!loggedIn || !author || author.email !== editingComment.email) {
      alert("Non sei autorizzato a modificare questo commento.");
      return;
    }
    try {
        const response = await updateComment(postId, editingComment._id, editedComments);
        //console.log(editingComment._id, response.data);
        setComments(comments.map(comment => comment._id === editingComment._id ? response.data : comment));
        setEditingComment(null);
        setEditedComments({
            name: "",
            email: "",
            comment: ""
        });
        setOpenEditModal(false)
    } catch (error) {
        console.error("Errore durante la modifica del commento", error);
    }
}

// funzione per eliminare un commento
const deleteComments = async (commentId) => {
    const commentToDelite = comments.find(comment => comment._id === commentId)
    if (!loggedIn || !author || author.email !== commentToDelite.email) {
        alert("Non sei autorizzato a eliminare questo commento.");
        return;
    }
    try {
       const response = await deleteComment(postId, commentId);
        setComments(comments.filter((comment) => comment._id !== commentId));
    } catch (error) {
        console.error("Errore durante l'eliminazione del commento", error);
    }
}
console.log(comments);

return (
  <>
  <Flowbite.Accordion collapseAll>
    <Flowbite.Accordion.Panel>
      <Flowbite.Accordion.Title>Comments</Flowbite.Accordion.Title>
      <Flowbite.Accordion.Content>
        <div className="overflow-x-auto">
          <Flowbite.Table>
            <Flowbite.Table.Head>
              <Flowbite.Table.HeadCell>Name</Flowbite.Table.HeadCell>
              <Flowbite.Table.HeadCell>Email</Flowbite.Table.HeadCell>
              <Flowbite.Table.HeadCell>Comment</Flowbite.Table.HeadCell>
              <Flowbite.Table.HeadCell>
                <span className="sr-only">Edit</span>
              </Flowbite.Table.HeadCell>
            </Flowbite.Table.Head>
            <Flowbite.Table.Body className="divide-y">
              {comments.map((comment) => (
                <Flowbite.Table.Row key={comment._id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Flowbite.Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    <FaUser className="inline mr-2" />{comment.name}
                  </Flowbite.Table.Cell>
                  <Flowbite.Table.Cell>
                    <FaEnvelope className="inline mr-2" />{comment.email}
                  </Flowbite.Table.Cell>
                  <Flowbite.Table.Cell>
                    <FaComment className="inline mr-2" />{comment.comment}
                  </Flowbite.Table.Cell>
                  <Flowbite.Table.Cell>
                    {loggedIn && author && author.email === comment.email && (
                      <Flowbite.Dropdown label={<FaCog className="text-gray-500 hover:text-gray-700" />} placement='bottom'  color="gray">
                        <Flowbite.Dropdown.Item
                          onClick={() => {
                            setEditingComment(comment);
                            setEditedComments({
                              name: author.nome,
                              email: author.email,
                              comment: comment.comment
                            });
                            setOpenEditModal(true);
                          }}
                        >
                          Edit
                        </Flowbite.Dropdown.Item>
                        <Flowbite.Dropdown.Item
                          onClick={() => deleteComments(comment._id)}
                        >
                          Delete
                        </Flowbite.Dropdown.Item>
                      </Flowbite.Dropdown>
                    )}
                  </Flowbite.Table.Cell>
                </Flowbite.Table.Row>
              ))}
            </Flowbite.Table.Body>
          </Flowbite.Table>
        </div>
      </Flowbite.Accordion.Content>
    </Flowbite.Accordion.Panel>
  </Flowbite.Accordion>

  {loggedIn && author && (
    <Flowbite.Button gradientDuoTone="greenToBlue" onClick={() => setOpenModal(true)}>Add Comment</Flowbite.Button>
  )}

  <Flowbite.Modal show={openModal} onClose={() => setOpenModal(false)}>
    <Flowbite.Modal.Header>Add your comment</Flowbite.Modal.Header>
    <Flowbite.Modal.Body>
      <div className="flex max-w-md flex-col gap-4">
        <div>
          <div className="mb-2 block">
            <Flowbite.Label htmlFor="name" value="Your Name" />
          </div>
          <Flowbite.TextInput
            id="name"
            placeholder={author.nome}
            value={author.nome}
            readOnly
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Flowbite.Label htmlFor="email" value="Email" />
          </div>
          <Flowbite.TextInput
            id="email"
            placeholder={author.email}
            value={author.email}
            readOnly
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Flowbite.Label htmlFor="comment" value="Comment" />
          </div>
          <Flowbite.TextInput
            id="comment"
            placeholder="Your comment"
            value={newComment.comment}
            onChange={(e) => setNewComment({ ...newComment, comment: e.target.value })}
            required
          />
        </div>
      </div>
    </Flowbite.Modal.Body>
    <Flowbite.Modal.Footer>
      <Flowbite.Button gradientDuoTone="greenToBlue" onClick={addNewComment}>Add Comment</Flowbite.Button>
      <Flowbite.Button color="gray" onClick={() => setOpenModal(false)}>Cancel</Flowbite.Button>
    </Flowbite.Modal.Footer>
  </Flowbite.Modal>

  {editingComment && (
    <Flowbite.Modal show={openEditModal} onClose={() => setOpenEditModal(false)}>
      <Flowbite.Modal.Header>Edit your comment</Flowbite.Modal.Header>
      <Flowbite.Modal.Body>
        <div className="flex max-w-md flex-col gap-4">
          <div>
            <div className="mb-2 block">
              <Flowbite.Label htmlFor="nameEdit" value="Your Name" />
            </div>
            <Flowbite.TextInput
              id="nameEdit"
              placeholder="John Doe"
              value={editedComments.name}
              onChange={(e) => setEditedComments({ ...editedComments, nome: e.target.value })}
              required
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Flowbite.Label htmlFor="emailEdit" value="Email" />
            </div>
            <Flowbite.TextInput
              id="emailEdit"
              placeholder="name@ciaociao.com"
              value={editedComments.email}
              onChange={(e) => setEditedComments({ ...editedComments, email: e.target.value })}
              required
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Flowbite.Label htmlFor="commentEdit" value="Comment" />
            </div>
            <Flowbite.TextInput
              id="commentEdit"
              placeholder="Comment"
              value={editedComments.comment}
              onChange={(e) => setEditedComments({ ...editedComments, comment: e.target.value })}
              required
            />
          </div>
        </div>
      </Flowbite.Modal.Body>
      <Flowbite.Modal.Footer>
        <Flowbite.Button gradientDuoTone="greenToBlue" onClick={editComment}>Save changes</Flowbite.Button>
        <Flowbite.Button color="gray" onClick={() => setOpenEditModal(false)}>Cancel</Flowbite.Button>
      </Flowbite.Modal.Footer>
    </Flowbite.Modal>
  )}
</>
  );
}
