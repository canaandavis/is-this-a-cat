import React from 'react';

const resultIsCat = ({ results }) => {
  const labels = results.responses.filter(resp => resp.labelAnnotations);
  const cat = labels[0].labelAnnotations.filter(
    label => label.description === 'cat'
  );

  if (cat.length === 0) {
    return "Pretty sure that this isn't a cat.";
  }

  let { score } = cat[0];
  score = score * 100;

  if (score > 95) {
    return 'Yes, this is a cat.';
  } else if (score > 80) {
    return 'This is probably a cat.';
  } else if (score > 60) {
    return 'There is a chance this is a cat.';
  } else if (score > 40) {
    return 'Maybe, maybe this is a cat.';
  } else {
    return "Honestly, this probably isn't a cat";
  }
};

const Results = results => {
  return <h1>{resultIsCat(results)}</h1>;
};

export default Results;
