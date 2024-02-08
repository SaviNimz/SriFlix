import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useDispatch } from "react-redux";
import { getGenres } from "../store";

export const Sriflix = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  window.onscroll = () => {
    setIsScrolled(window.pageYOffset === 0 ? false : true);
    return () => (window.onscroll = null);
  };

  const dispatch = useDispatch();

  useEffect(()=> {

    dispatch(getGenres())
  },[])

  return(
    <div>
    <Navbar isScrolled={isScrolled} />
    </div>
  );
}

export default Sriflix;