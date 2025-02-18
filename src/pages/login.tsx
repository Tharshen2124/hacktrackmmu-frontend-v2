
import Image from "next/image"
import { useState, useEffect } from "react"

const images = [
  "/presentation.jpg",
  "/mamakSession.jpg",
  "/hackerspaceSession.jpg",
  "/weijie.jpg",
  "/willie.jpg"
]

export default function LoginPage() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
    console.log(images.length)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, 5000) // Change image every 5 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Image carousel column */}
      <div className="hidden md:block relative overflow-hidden">
        {images.map((src, index) => (
          <Image
            key={src}
            src={src}
            alt={`Login visual ${index + 1}`}
            width={1080}
            height={1080}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
              index === currentImageIndex ? "opacity-100" : "opacity-0"
            }`}
            priority={index === 0}
          />
        ))}
      </div>

      {/* Login column */}
      <div className="flex flex-col justify-center items-center p-8 bg-white dark:bg-[#111]">
        <div className="w-full max-w-md">
          {/* Logo placeholder */}
          <div className="mx-auto dark:bg-white dark:w-[180px] py-4 rounded-md flex items-center justify-center">
            <Image src="/hackerspaceLogo.svg" alt="Hacktrack MMU" className="flex justify-center" width={150} height={150} />
          </div>
    
          {/* Welcome text */}
          <h2 className="mt-6 text-center text-3xl font-extrabold dark:text-white text-gray-900">Welcome to Hacktrack MMU</h2>
          {/* Login form */}
          <p className="mt-1 text-lg text-center">Please input password to login.</p>

          <form className="mt-8 space-y-6" action="#" method="POST">
            <div>
                <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="mt-2 flex w-full dark:bg-[#333] dark:border-[#555] rounded-full border border-input bg-background px-6 py-[14px]  text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus:ring-blue-400 dark:focus:ring-blue-500"
                    placeholder="Password"
                />
            </div>

            <div>
              <button
                type="submit"
                className="rounded-full duration-200 transition  hover:bg-blue-700 bg-blue-600 group relative w-full flex justify-center py-3 px-4 border border-transparent font-semibold text-white focus:ring-2 focus:ring-blue-300"
              >
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

