export default function NavigationBar() {
  return (
    <nav className="border-b border-[#333] w-full h-[70px]">
      <div className="container w-[95%] mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <img src="/hackerspaceLogo.svg" alt="logo" className="w-16 h-16" />
          <h1 className="ml-2 text-xl font-bold">Hackerspace MMU</h1>
        </div>
        <div className="flex items-center">
          <a href="#" className="t hover:text-blue-400">Dashboard</a>
          <a href="#" className="ml-4 hover:text-blue-400">Members</a>
          <a href="#" className="ml-4  hover:text-blue-400">Meetups</a>
        </div>
        <div className="flex items-center">
          <p className="mr-6">Admin Mode</p>
          <button className="flex items-center gap-2 bg-white text-black font-semibold  px-8 py-2 rounded-md">Logout</button>
        </div>
      </div>
    </nav>
  )
}
