interface MessageProps {
  type: "error" | "success";
  message: string | null;
}

export default function Message({ type, message }: MessageProps) {
  if (!message) return null;

  const color = type === "error" ? "text-red-500" : "text-green-500";

  return <div className={`${color} text-center mb-4`}>{message}</div>;
}
