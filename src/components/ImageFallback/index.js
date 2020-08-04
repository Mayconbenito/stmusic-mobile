import React, { useEffect, useState } from 'react';
import { Image } from 'react-native';
import FastImage from 'react-native-fast-image';

function ImageFallback({
  style,
  source,
  resizeMode = 'contain',
  fallback,
  local = false,
}) {
  const [image, setImage] = useState();
  const [resize, setResize] = useState();
  const [showFallback, setShowFallback] = useState(false);

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
      setShowFallback(true);
      return;
    }

    switch (resizeMode) {
      case 'contain':
        setResize(FastImage.resizeMode.contain);
        break;
      case 'cover':
        setResize(FastImage.resizeMode.cover);
        break;
      case 'stretch':
        setResize(FastImage.resizeMode.stretch);
        break;
      case 'center':
        setResize(FastImage.resizeMode.center);
        break;
      default:
        setResize(FastImage.resizeMode.contain);
    }

    setImage(source);
  }, []);

  if (local || showFallback) {
    return (
      <Image
        style={style}
        source={image}
        resizeMode={resizeMode}
        onError={loadFallback}
      />
    );
  }

  return (
    <FastImage
      style={style}
      source={{
        ...image,
        priority: FastImage.priority.high,
      }}
      resizeMode={resize}
      onError={loadFallback}
    />
  );
}

export default ImageFallback;
