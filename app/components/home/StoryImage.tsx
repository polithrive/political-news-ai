"use client";

import { useState } from "react";
import Image from "next/image";

type StoryImageProps = {
  src?: string | null;
  sizes: string;
  priority?: boolean;
  className?: string;
};

export default function StoryImage({
  src,
  sizes,
  priority = false,
  className = "object-cover",
}: StoryImageProps) {
  const [imageFailed, setImageFailed] = useState(false);

  const hasUsableImage = Boolean(src) && !imageFailed;

  if (!hasUsableImage) {
    return null;
  }

  return (
    <Image
      src={src as string}
      alt=""
      fill
      priority={priority}
      unoptimized
      sizes={sizes}
      className={className}
      onError={() => setImageFailed(true)}
    />
  );
}
