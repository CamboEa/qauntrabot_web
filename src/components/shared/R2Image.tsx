"use client";

import { useState } from "react";
import { ImageIcon } from "lucide-react";
import { publicAssetUrl } from "@/lib/bot-display";

type R2ImageProps = {
  objectKey?: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  aspectClassName?: string;
  /** Use signed media proxy when bucket is private (default true). */
  useSignedProxy?: boolean;
  priority?: boolean;
};

export function mediaUrlForKey(objectKey: string, useSignedProxy = true): string {
  const publicUrl = publicAssetUrl(objectKey);
  if (publicUrl) return publicUrl;
  if (useSignedProxy) return `/api/media?key=${encodeURIComponent(objectKey)}`;
  return "";
}

export default function R2Image({
  objectKey,
  alt,
  className = "",
  imgClassName = "w-full h-full object-cover",
  aspectClassName = "aspect-[16/10]",
  useSignedProxy = true,
}: R2ImageProps) {
  const [failed, setFailed] = useState(false);

  if (!objectKey?.trim()) {
    return (
      <div
        className={`flex items-center justify-center bg-secondary/80 border border-border rounded-xl ${aspectClassName} ${className}`}
        aria-hidden
      >
        <ImageIcon size={28} className="text-muted-foreground/40" />
      </div>
    );
  }

  const src = mediaUrlForKey(objectKey, useSignedProxy);
  if (!src || failed) {
    return (
      <div
        className={`flex items-center justify-center bg-secondary rounded-xl ${aspectClassName} text-xs text-muted-foreground font-data ${className}`}
      >
        Image unavailable
      </div>
    );
  }

  return (
    <div className={`overflow-hidden rounded-xl border border-border bg-card ${aspectClassName} ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className={imgClassName}
        loading="lazy"
        onError={() => setFailed(true)}
      />
    </div>
  );
}
