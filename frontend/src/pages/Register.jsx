import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Label, TextInput, Card } from "flowbite-react";
import { registerUser } from '../services/api';


export default function Register() {
  
  const [formData, setFormData] = useState({
    nome: "",
    cognome: "",
    email: "",
    password: "",
    dataDiNascita: "",
    avatar: "",
  });

 // stato per inserire file
 const [avatarFile, setAvatarFile] = useState(null);
 const [message, setMessage] = useState(false);

    const navigate = useNavigate(); // Hook per la navigazione
// creo funzione per verificare data di nascita maggiore uguale a 18 anni
// Funzione per verificare se l'utente è maggiorenne
const isAdult = (dateString) => {
  const today = new Date();
  const birthDate = new Date(dateString);
  const minDate = new Date('1900-01-01');

  if (isNaN(birthDate.getTime()) || birthDate < minDate) {
    return false;
  }

  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age >= 18;
};
// Gestore per aggiornare lo stato quando i campi del form cambiano
  // Gestore per aggiornare lo stato quando i campi del form cambiano
  const [errorMessage, setErrorMessage] = useState('');

  // Funzione per formattare la data
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Gestore per l'input
  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
  
    if (name === "dataDiNascita") {
      if (isAdult(value)) {
        setFormData(prev => ({ ...prev, [name]: formatDate(value) }));
        setErrorMessage('');
      } else {
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrorMessage('La data deve essere valida, non anteriore al 1900 e l\'utente deve essere maggiorenne.');
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Gestore per la sottomissione del form
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    console.log("Dati da inviare:", formData);
    // Controlla che tutti i campi siano compilati
    if (!formData.nome || !formData.cognome || !formData.email || !formData.password || !formData.dataDiNascita) {
      alert("Tutti i campi sono obbligatori");
      return;
    }
    try {
      await registerUser(formData);
      alert("Registrazione avvenuta con successo!");
      navigate("/login");
    } catch (error) {
      console.error("Errore durante la registrazione:", error.response?.data);
      alert(error.response?.data?.message || "Errore durante la registrazione. Riprova.");
    }
  };

  //Gestore per il file di copertina
   const handleRegisterFileChange = (e) => {
     setAvatarFile(e.target.files[0]);
   };


  return (
    <>
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-lg p-6 shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">Register here</h2>
        <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-4">
          <div>
            <div className="mb-2 block">
              <Label htmlFor="name" value="Your name" />
            </div>
            <TextInput
              name="nome"
              id="name"
              type="name"
              placeholder="Gigio"
              required
              value={formData.nome}
              onChange={handleRegisterChange}
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="cognome" value="Your last name" />
            </div>
            <TextInput
              name="cognome"
              id="cognome"
              type="cognome"
              placeholder="Gigigni"
              required
              value={formData.cognome}
              onChange={handleRegisterChange}
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="datanascita" value="Birthdate" />
            </div>
            <TextInput
              name="dataDiNascita"
              id="datanascita"
              min="1900-01-01"
              max={new Date().toISOString().split('T')[0]}
              type="date"
              required
              value={formData.dataDiNascita}
              onChange={handleRegisterChange}
            />
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="email" value="Your email" />
            </div>
            <TextInput
              name="email"
              id="email"
              type="email"
              placeholder="name@email.com"
              required
              value={formData.email}
              onChange={handleRegisterChange}
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="password" value="Your password" />
            </div>
            <TextInput
              name="password"
              id="password"
              type="password"
              required
              value={formData.password}
              onChange={handleRegisterChange}
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="file" value="Your cover" />
            </div>
            <TextInput
              name="avatar"
              id="file"
              type="file"
              placeholder="avatar"
              required
              onChange={handleRegisterFileChange}
            />
          </div>
          <div className="flex items-center gap-2 justify-center">
            <Button gradientDuoTone={"greenToBlue"} type="submit">Submit</Button>
            <Button gradientDuoTone={"greenToBlue"} type="reset">Reset</Button>
          </div>
        </form>
      </Card>
    </div>
    </>
  )
    
}

