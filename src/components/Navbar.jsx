export default function Navbar() {
  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-800">CandyzFlorist</h1>
        <nav>
          <ul className="flex gap-6">
            <li><a href="/" className="text-sm font-medium hover:text-primary">Home</a></li>
            <li><a href="#" className="text-sm font-medium hover:text-primary">Products</a></li>
            <li><a href="#" className="text-sm font-medium hover:text-primary">About</a></li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
