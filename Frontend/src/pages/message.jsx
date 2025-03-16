// src/components/IframeComponent.js
import React from 'react';


const IframeComponent = ({ url }) => {
  return (
    <div
      style={{
        width: '90vw', // 90% of the viewport width
        height: '50vw', // Adjust for header height (60px for header)
        margin: 0,
        padding: 0,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <iframe
        src={'https://chattingsystem-client.vercel.app'} // Make the URL dynamic based on the passed prop
        width="100%" // Make iframe take up 100% of the width of the container
        height="100%" // Make iframe take up 100% of the height of the container
        style={{ border: 'none' }}
        title="Embedded Content"
      ></iframe>
    </div>
  );
};

export default IframeComponent;
