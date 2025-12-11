import React from 'react';

const TextHeading = ({text,newStyle}) => {
  return (
    <h2 style={{color:'black',textAlign:'center',...newStyle}}>
        {text}
    </h2>
  );
};

export default TextHeading;