import React, { createContext, useContext, useState } from 'react';

const StreamContext = createContext();

export const StreamProvider = ({ children }) => {
  const [screenStream, setScreenStream] = useState(null);
  
  return (
    <StreamContext.Provider value={{ screenStream, setScreenStream }}>
      {children}
    </StreamContext.Provider>
  );
};

export const useStream = () => useContext(StreamContext);
