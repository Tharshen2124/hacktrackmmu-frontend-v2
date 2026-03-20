// make text prop optional
export function NullTextIndicator({ text }: { text?: string }) {
  return <span className="text-red-400">{text || "Not Provided"}</span>;
}