import React from 'react';
import { HiMail, HiLockClosed } from "react-icons/hi";
import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Button, Label, TextInput } from "flowbite-react";
import { loginUser } from '../services/api';
import { FcGoogle } from "react-icons/fc";

export default function Login() {
  // Stato per memorizzare i dati del login
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token"); // cerco il valore del parametro 'token'

    if (token) {
      localStorage.setItem("token", token); // memorizzo il token nel localStorage
      window.dispatchEvent(new Event("storage")); // trigger l'evento di storage
      navigate('/');
    }

  }, [location, navigate]); //eseguito dopo il rendering del componente e quando location e navigate cambiano

// Funzione per gestire i cambiamenti nei campi del form
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Funzione per inviare i dati del login
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser(formData);
      console.log(response.formData);
      localStorage.setItem("token", response.token); // Memorizza il token di autenticazione nel localStorage
      // Trigger l'evento storage per aggiornare la Navbar
      window.dispatchEvent(new Event("storage")); // Scatena un evento di storage per aggiornare componenti come la Navbar
      alert("Login effettuato con successo!");
      navigate('/');
    } catch (error) {
      console.error("Errore durante il login:", error);
      alert("Credenziali non valide. Riprova.");
    }};

    // reinderizza l'utente all'endpoint che abbiamo definito nel backend
    const handleGoogleLogin = () => {
      window.location.href = "http://localhost:5001/api/auth/google";
    };


  return (
    <>
    <form onSubmit={handleLoginSubmit} className="flex max-w-md flex-col justify-center gap-4 mx-auto my-auto"> 
    <h2 className="text-2xl font-bold mb-4 mx-auto">Login</h2>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="email" value="Your email" />
        </div>
        <TextInput 
            name="email"
            id="email" 
            type="email"
            rightIcon={HiMail}
            placeholder="name@flowbite.com" 
            required
            value={formData.email}
            onChange={handleLoginChange}
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
            rightIcon={HiLockClosed}
            required
            value={formData.password}
            onChange={handleLoginChange}
        />
      </div>
      <div className="flex items-center gap-2">
        {/* <Checkbox id="remember" />
        <Label htmlFor="remember">Remember me</Label> */}
      </div>
      <Button pill size="sm" className="mt-2 w-1/2 px-1 mx-auto" outline gradientDuoTone="greenToBlue" type="submit">Login</Button>
    </form>
    <Button pill size="md" className="mt-2 w-1/4 px-1 mx-auto" outline gradientDuoTone="greenToBlue" onClick={handleGoogleLogin}> <div className='flex items-center gap-2'> <FcGoogle /> Login with Google </div></Button>
    <Button as={Link} to="/register" pill size="md" className="mt-2 w-1/4 px-1 mx-auto text-white"  gradientDuoTone="greenToBlue"> <div className='flex items-center gap-2'> Sign up </div></Button>
    </>
  )
}
