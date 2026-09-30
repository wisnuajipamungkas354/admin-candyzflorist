export default function Footer() {
  return (
    <footer className="border-t bg-slate-50 mt-12">
      <div className="container mx-auto px-4 py-8 text-center text-sm text-slate-500">
        <p>&copy; {new Date().getFullYear()} CandyzFlorist. All rights reserved.</p>
      </div>
    </footer>
  )
}
