import React from 'react';

const formatText = (text) => {
  const withHyperlinks = text.replace(/(https?:\/\/[^\s]+)/g, (url) => (
    <a key={url} href={url} target="_blank" rel="noopener noreferrer">
      {url}
    </a>
  ));

  const withNewlines = withHyperlinks.split('\n').map((line, index, array) => (
    // Add <br /> after each line, except for the last line
    <React.Fragment key={index}>
      {line}
      {index !== array.length - 1 && <br />}
    </React.Fragment>
  ));

  return withNewlines;
};

export default formatText;
