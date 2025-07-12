import { useDarkMode } from "@/hooks/useDarkMode";
import Image from "next/image";

export function ErrorPage() {
  const { isDarkMode } = useDarkMode();
  return (
    <>
      <div className="flex flex-col justify-center items-center fixed inset-0">
        {isDarkMode ? (
          <Image
            src="/errorWhite.svg"
            alt="error icon"
            width="300"
            height="120"
          />
        ) : (
          <Image
            src="/errorBlack.svg"
            alt="error icon"
            width="300"
            height="120"
          />
        )}
        <h1 className="text-3xl font-bold mt-5">An error occured!</h1>
        <h1 className="text-lg font-bold mt-2">
          Please report this issue to hackerspace developers.
        </h1>
      </div>
    </>
  );
}

export function ErrorImage() {
  const { isDarkMode } = useDarkMode();
  return (
    <>
      <div className="flex flex-col items-center justify-center">
        {isDarkMode ? (
          <Image
            src="/errorWhite.svg"
            alt="error icon"
            width="250"
            height="250"
          />
        ) : (
          <Image
            src="/errorBlack.svg"
            alt="error icon"
            width="250"
            height="120"
          />
        )}
        <h1 className="text-3xl font-bold mt-5">An error occured!</h1>
        <h1 className="font-bold mt-2 text-center">
          Please report this issue to hackerspace developers.
        </h1>
      </div>
    </>
  );
}
