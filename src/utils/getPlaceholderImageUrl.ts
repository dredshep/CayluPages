interface getPlaceholderImageProps {
  width: number;
  height: number;
  textColor?: string;
  bgColor?: string;
}

export default function getPlaceholderImageUrl({
  width,
  height,
  textColor,
  bgColor,
}: getPlaceholderImageProps) {
  const baseURL = "https://placehold.co";
  const url = `${baseURL}/${width}x${height}/${bgColor ?? "bbb"}/${
    textColor ?? "252525"
  }/png`;
  return url;
}
