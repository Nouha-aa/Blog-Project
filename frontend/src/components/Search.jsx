import { Label, TextInput } from 'flowbite-react';
import React from 'react';
import { HiMiniMagnifyingGlass } from "react-icons/hi2";

export default function Search({search, setSearch}) {
  // Funzione per gestire la ricerca
    const handleInputChange = (e) => {
        setSearch(e.target.value)
        //console.log(e.target.value)
    }

  return (
    <div className="max-w-md">
      <TextInput
        id="search"
        type="text"
        placeholder="Search Post..."
        onChange={handleInputChange}
        value={search}
        icon={HiMiniMagnifyingGlass}
      />
    </div>
  )
}
