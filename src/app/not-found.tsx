export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-600 mb-4">الصفحة غير موجودة</h2>
        <p className="text-gray-500 mb-8">عذراً، الصفحة التي تبحث عنها غير موجودة.</p>
        <a 
          href="/"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          العودة للرئيسية
        </a>
      </div>
    </div>
  )
}