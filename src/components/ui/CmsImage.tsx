import Image, { type ImageProps } from "next/image";
import { shouldUnoptimizeImage } from "@/lib/upload-url";

type CmsImageProps = ImageProps;

export function CmsImage({ src, unoptimized, ...props }: CmsImageProps) {
  const srcString = typeof src === "string" ? src : "";
  const bypassOptimizer =
    unoptimized ?? (srcString ? shouldUnoptimizeImage(srcString) : false);

  return <Image src={src} unoptimized={bypassOptimizer} {...props} />;
}
