export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-5">

        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-600 font-bold">
            P
          </div>

          <div>
            <h1 className="text-2xl font-bold text-white">
              PoliticalPulse
            </h1>

            <p className="text-xs text-gray-400">
              AI Intelligence
            </p>
          </div>
        </div>

        <div className="hidden gap-8 text-gray-300 md:flex">
          <a className="hover:text-red-500 transition" href="#">
            Home
          </a>

          <a className="hover:text-red-500 transition" href="#">
            News
          </a>

          <a className="hover:text-red-500 transition" href="#">
            Analysis
          </a>

          <a className="hover:text-red-500 transition" href="#">
            Trending
          </a>

          <a className="hover:text-red-500 transition" href="#">
            AI Assistant
          </a>
        </div>

        <button className="rounded-lg bg-red-600 px-5 py-2 font-semibold hover:bg-red-700 transition">
          Sign In
        </button>

      </div>
    </nav>
  );
}