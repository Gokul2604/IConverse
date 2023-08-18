import React, { useEffect, useRef } from 'react';

function ClickOutsideDiv({ children, onClickOutside }) {
  const divRef = useRef(null);

  const handleClickOutside = (event) => {
    if (divRef.current && !divRef.current.contains(event.target)) {
      if(localStorage.getItem("firstClick") === "1") {
        // console.log("out");
        onClickOutside();
      } else {
        // console.log("First click");
        localStorage.setItem("firstClick", "1");
      }
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div ref={divRef}>
      {children}
    </div>
  );
}

export default ClickOutsideDiv;