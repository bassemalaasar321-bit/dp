'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-red-600 mb-4">خطأ!</h1>
        <h2 className="text-2xl font-semibold text-gray-600 mb-4">حدث خطأ غير متوقع</h2>
        <p className="text-gray-500 mb-8">عذراً، حدث خطأ أثناء تحميل الصفحة.</p>
        <button
          onClick={reset}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors mr-4"
        >
          إعادة المحاولة
        </button>
        <a 
          href="/"
          className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
        >
          العودة للرئيسية
        </a>
      </div>
    </div>
  )
}