import React, { useEffect, useState } from 'react';
import { Image } from 'react-native';

function ImageFallback({ style, source, resizeMode, fallback }) {
  const [image, setImage] = useState();

  function loadFallback() {
    setImage(fallback);
  }

  useEffect(() => {
    if (!source) {
      loadFallback();
      return;
    }

    if (source.uri === null) {
      loadFallback();
      return;
    }

    setImage(source);
  }, []);

  return (
    <Image
      style={style}
      source={image}
      resizeMode={resizeMode}
      onError={loadFallback}
    />
  );
}

export default ImageFallback;
