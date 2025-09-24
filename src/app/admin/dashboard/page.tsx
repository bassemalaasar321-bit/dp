'use client';
import { useState, useEffect } from 'react';

interface Game {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  downloadLink: string;
  category: string;
  platforms?: string;
  systemReqs?: string;
  gameSpecs?: string;
}

export default function AdminDashboard() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingGame, setEditingGame] = useState<Game | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState<{type: 'success' | 'error' | 'warning' | 'info', message: string} | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{show: boolean, message: string, onConfirm: () => void} | null>(null);
  
  const showNotification = (type: 'success' | 'error' | 'warning' | 'info', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };
  
  const categoryNames: { [key: string]: string } = {
    ACTION: 'ألعاب أكشن',
    WAR: 'ألعاب حرب',
    FOOTBALL: 'ألعاب كرة قدم',
    OPEN_WORLD: 'ألعاب عالم مفتوح',
    CARS: 'ألعاب سيارات',
    LIGHT: 'ألعاب خفيفة',
    HORROR: 'ألعاب رعب',
    STRATEGY: 'ألعاب استراتيجية',
    CLASSIC: 'ألعاب قديمة'
  };
  const [newGame, setNewGame] = useState<Partial<Game>>({
    title: '',
    description: '',
    imageUrl: '',
    downloadLink: '',
    category: 'ACTION',
    platforms: '',
    systemReqs: '',
    gameSpecs: ''
  });

  const fetchGames = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedCategory) params.append('category', selectedCategory);
      if (searchQuery) params.append('search', searchQuery);
      params.append('limit', '1000'); // جلب جميع الألعاب للداش بورد
      
      const url = `/api/games${params.toString() ? '?' + params.toString() : ''}`;
      const response = await fetch(url);
      const data = await response.json();
      setGames(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching games:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // تحقق من وجود token عند تحميل الصفحة
    const checkAuth = () => {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('admin-token='))
        ?.split('=')[1];

      if (!token) {
        window.location.href = '/admin/login';
        return;
      }
      
      setIsAuthenticated(true);
      fetchGames();
    };

    checkAuth();
    
    // تحقق دوري من صلاحية الجلسة كل 5 ثواني
    const checkSession = setInterval(async () => {
      try {
        const token = document.cookie
          .split('; ')
          .find(row => row.startsWith('admin-token='))
          ?.split('=')[1];
          
        if (!token) {
          clearInterval(checkSession);
          handleLogout();
          return;
        }
        
        const response = await fetch('/api/admin/check-session', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          clearInterval(checkSession);
          showNotification('warning', 'انتهت صلاحية الجلسة. سيتم تسجيل الخروج تلقائياً.');
          setTimeout(() => handleLogout(), 2000);
        }
      } catch (error) {
        clearInterval(checkSession);
        handleLogout();
      }
    }, 5000);
    
    return () => clearInterval(checkSession);
  }, [selectedCategory, searchQuery]);

  const handleLogout = () => {
    document.cookie = 'admin-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    window.location.href = '/admin/login';
  };

  const handleDelete = (id: number, title: string) => {
    setConfirmDialog({
      show: true,
      message: `هل أنت متأكد من حذف لعبة "${title}"؟`,
      onConfirm: async () => {
        try {
          const response = await fetch(`/api/games/${id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${document.cookie.split('admin-token=')[1]?.split(';')[0]}`
            }
          });
          if (response.ok) {
            fetchGames();
            showNotification('success', 'تم حذف اللعبة بنجاح!');
          } else {
            showNotification('error', 'فشل في حذف اللعبة');
          }
        } catch (error) {
          console.error('Error deleting game:', error);
          showNotification('error', 'حدث خطأ أثناء حذف اللعبة');
        }
        setConfirmDialog(null);
      }
    });
  };

  const handleEdit = (game: Game) => {
    setEditingGame(game);
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (!editingGame) return;
    
    try {
      const response = await fetch(`/api/games/${editingGame.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${document.cookie.split('admin-token=')[1]?.split(';')[0]}`
        },
        body: JSON.stringify(editingGame)
      });
      
      if (response.ok) {
        fetchGames();
        setShowEditModal(false);
        setEditingGame(null);
        showNotification('success', 'تم تحديث اللعبة بنجاح!');
      } else {
        showNotification('error', 'فشل في تحديث اللعبة');
      }
    } catch (error) {
      console.error('Error updating game:', error);
      showNotification('error', 'حدث خطأ أثناء تحديث اللعبة');
    }
  };

  const handleAddGame = async () => {
    try {
      // تحقق من الأسماء المشابهة أولاً
      const checkResponse = await fetch(`/api/games?search=${encodeURIComponent(newGame.title || '')}`);
      const existingGames = await checkResponse.json();
      
      if (Array.isArray(existingGames) && existingGames.length > 0) {
        const similarGames = existingGames.filter(game => 
          game.title.toLowerCase().includes((newGame.title || '').toLowerCase()) ||
          (newGame.title || '').toLowerCase().includes(game.title.toLowerCase())
        );
        
        if (similarGames.length > 0) {
          showNotification('warning', `تم العثور على ${similarGames.length} لعبة مشابهة. يرجى التحقق قبل المتابعة.`);
          
          setConfirmDialog({
            show: true,
            message: `تم العثور على ${similarGames.length} لعبة مشابهة. هل تريد المتابعة بإضافة اللعبة؟`,
            onConfirm: () => {
              setConfirmDialog(null);
              continueAddGame();
            }
          });
          return;
        }
      }
      
      continueAddGame();
    } catch (error) {
      console.error('Error adding game:', error);
      showNotification('error', 'حدث خطأ أثناء إضافة اللعبة');
    }
  };
  
  const continueAddGame = async () => {
    try {
      const response = await fetch('/api/games', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${document.cookie.split('admin-token=')[1]?.split(';')[0]}`
        },
        body: JSON.stringify(newGame)
      });
      
      if (response.ok) {
        fetchGames();
        setShowAddModal(false);
        setNewGame({
          title: '',
          description: '',
          imageUrl: '',
          downloadLink: '',
          category: 'ACTION',
          platforms: '',
          systemReqs: '',
          gameSpecs: ''
        });
        showNotification('success', 'تم إضافة اللعبة بنجاح!');
      } else {
        showNotification('error', 'فشل في إضافة اللعبة');
      }
    } catch (error) {
      console.error('Error adding game:', error);
      showNotification('error', 'حدث خطأ أثناء إضافة اللعبة');
    }
  };

  const handleBackup = async () => {
    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('admin-token='))
        ?.split('=')[1];
        
      const response = await fetch('/api/admin/backup', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const backup = await response.json();
        const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showNotification('success', 'تم تحميل النسخة الاحتياطية بنجاح!');
      } else {
        showNotification('error', 'فشل في إنشاء النسخة الاحتياطية');
      }
    } catch (error) {
      showNotification('error', 'حدث خطأ أثناء إنشاء النسخة الاحتياطية');
    }
  };

  const handleRestore = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setConfirmDialog({
      show: true,
      message: 'هل أنت متأكد من استعادة النسخة الاحتياطية؟ سيتم حذف جميع البيانات الحالية!',
      onConfirm: async () => {
        setConfirmDialog(null);
        await processRestore(file);
      }
    });
  };
  
  const processRestore = async (file: File) => {
    try {
      const text = await file.text();
      const backupData = JSON.parse(text);
      
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('admin-token='))
        ?.split('=')[1];
        
      const response = await fetch('/api/admin/backup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(backupData)
      });
      
      const result = await response.json();
      
      if (response.ok) {
        showNotification('success', result.message);
        fetchGames();
      } else {
        showNotification('error', result.error || 'فشل في استعادة النسخة الاحتياطية');
      }
    } catch (error) {
      showNotification('error', 'ملف غير صالح أو حدث خطأ');
    }

  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-xl text-gray-700">🔐 جاري التحقق من الصلاحيات...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-blue-900 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img src="/icon.jpg" alt="Logo" className="w-8 h-8 rounded-lg" />
            <h1 className="text-2xl font-bold">لوحة تحكم الأدمن</h1>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-600 px-4 py-2 rounded hover:bg-red-700 cursor-pointer"
          >
            خروج
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">📊 إحصائيات الموقع</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-600">{games.length}</div>
              <div className="text-gray-600">إجمالي الألعاب</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-600">✅</div>
              <div className="text-gray-600">النظام يعمل</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-purple-600">🔐</div>
              <div className="text-gray-600">محمي بالكامل</div>
            </div>
          </div>
          
          <div className="mt-6 flex gap-4 justify-center">
            <button
              onClick={handleBackup}
              className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 cursor-pointer flex items-center gap-2"
            >
              💾 تحميل نسخة احتياطية
            </button>
            <label className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer flex items-center gap-2">
              📁 استعادة نسخة احتياطية
              <input
                type="file"
                accept=".json"
                onChange={handleRestore}
                className="hidden"
              />
            </label>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">🎮 إدارة الألعاب ({games.length})</h2>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 cursor-pointer flex items-center gap-2"
            >
              ➕ إضافة لعبة جديدة
            </button>
          </div>
          
          {/* بحث وفلترة */}
          <div className="mb-6 space-y-4">
            {/* شريط البحث */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="🔍 بحث عن لعبة..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="bg-gray-500 text-white px-3 py-2 rounded hover:bg-gray-600 cursor-pointer"
                >
                  ✖️
                </button>
              )}
            </div>
            
            {/* أزرار الفئات */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory('')}
                className={`px-3 py-1 rounded text-sm cursor-pointer ${
                  selectedCategory === '' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                🎮 جميع الألعاب
              </button>
              {Object.entries(categoryNames).map(([key, value]) => (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(key)}
                  className={`px-3 py-1 rounded text-sm cursor-pointer ${
                    selectedCategory === key 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
              <div>جاري التحميل...</div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              {/* جدول للموبايل والتابلت */}
              <table className="w-full min-w-[350px] block md:hidden">
                <thead>
                  <tr className="border-b">
                    <th className="text-right py-2 w-10 text-xs">ID</th>
                    <th className="text-right py-2 text-xs">اسم اللعبة</th>
                    <th className="text-right py-2 w-16 text-xs">فئة</th>
                    <th className="text-right py-2 w-16 text-xs">عمل</th>
                  </tr>
                </thead>
                <tbody>
                  {games.map((game) => (
                    <tr key={game.id} className="border-b hover:bg-gray-50">
                      <td className="py-2 text-xs">{game.id}</td>
                      <td className="py-2">
                        <div className="break-words text-xs leading-tight">
                          {game.title.length > 25 ? `${game.title.substring(0, 25)}...` : game.title}
                        </div>
                      </td>
                      <td className="py-2 text-xs">
                        {game.category === 'ACTION' ? 'أكشن' :
                         game.category === 'WAR' ? 'حرب' :
                         game.category === 'FOOTBALL' ? 'كرة' :
                         game.category === 'CARS' ? 'سيارات' :
                         game.category === 'LIGHT' ? 'خفيف' :
                         game.category === 'HORROR' ? 'رعب' : 'أخرى'}
                      </td>
                      <td className="py-2">
                        <div className="flex flex-col gap-1">
                          <button 
                            onClick={() => handleEdit(game)}
                            className="bg-blue-600 text-white px-1 py-0.5 rounded text-xs hover:bg-blue-700 cursor-pointer"
                          >
                            ✏️
                          </button>
                          <button 
                            onClick={() => handleDelete(game.id, game.title)}
                            className="bg-red-600 text-white px-1 py-0.5 rounded text-xs hover:bg-red-700 cursor-pointer"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {/* جدول لللاب والكمبيوتر */}
              <table className="w-full min-w-[600px] hidden md:table">
                <thead>
                  <tr className="border-b">
                    <th className="text-right py-2 w-16">ID</th>
                    <th className="text-right py-2">اسم اللعبة</th>
                    <th className="text-right py-2 w-32">الفئة</th>
                    <th className="text-right py-2 w-32">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {games.map((game) => (
                    <tr key={game.id} className="border-b hover:bg-gray-50">
                      <td className="py-2 text-sm">{game.id}</td>
                      <td className="py-2">
                        <div className="break-words text-sm leading-tight">
                          {game.title}
                        </div>
                      </td>
                      <td className="py-2 text-sm">{categoryNames[game.category] || game.category}</td>
                      <td className="py-2">
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleEdit(game)}
                            className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 cursor-pointer"
                          >
                            تعديل
                          </button>
                          <button 
                            onClick={() => handleDelete(game.id, game.title)}
                            className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 cursor-pointer"
                          >
                            حذف
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal التعديل */}
      {showEditModal && editingGame && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">تعديل اللعبة: {editingGame.title}</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">اسم اللعبة</label>
                <input
                  type="text"
                  value={editingGame.title}
                  onChange={(e) => setEditingGame({...editingGame, title: e.target.value})}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2">الوصف</label>
                <textarea
                  value={editingGame.description}
                  onChange={(e) => setEditingGame({...editingGame, description: e.target.value})}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
                  rows={3}
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2">رابط الصورة</label>
                <input
                  type="url"
                  value={editingGame.imageUrl}
                  onChange={(e) => setEditingGame({...editingGame, imageUrl: e.target.value})}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2">رابط التحميل</label>
                <input
                  type="url"
                  value={editingGame.downloadLink}
                  onChange={(e) => setEditingGame({...editingGame, downloadLink: e.target.value})}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2">الفئة</label>
                <select
                  value={editingGame.category}
                  onChange={(e) => setEditingGame({...editingGame, category: e.target.value})}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
                >
                  <option value="ACTION">ألعاب أكشن</option>
                  <option value="WAR">ألعاب حرب</option>
                  <option value="FOOTBALL">ألعاب كرة قدم</option>
                  <option value="OPEN_WORLD">ألعاب عالم مفتوح</option>
                  <option value="CARS">ألعاب سيارات</option>
                  <option value="LIGHT">ألعاب خفيفة</option>
                  <option value="HORROR">ألعاب رعب</option>
                  <option value="STRATEGY">ألعاب استراتيجية</option>
                  <option value="CLASSIC">ألعاب قديمة</option>
                </select>
              </div>
            </div>
            
            <div className="flex gap-4 mt-6">
              <button
                onClick={handleSaveEdit}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 cursor-pointer"
              >
                حفظ التغييرات
              </button>
              <button
                onClick={() => {setShowEditModal(false); setEditingGame(null);}}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 cursor-pointer"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal الإضافة */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">➕ إضافة لعبة جديدة</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">اسم اللعبة *</label>
                <input
                  type="text"
                  value={newGame.title || ''}
                  onChange={(e) => setNewGame({...newGame, title: e.target.value})}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2">الوصف *</label>
                <textarea
                  value={newGame.description || ''}
                  onChange={(e) => setNewGame({...newGame, description: e.target.value})}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
                  rows={3}
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2">رابط الصورة *</label>
                <input
                  type="url"
                  value={newGame.imageUrl || ''}
                  onChange={(e) => setNewGame({...newGame, imageUrl: e.target.value})}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2">رابط التحميل *</label>
                <input
                  type="url"
                  value={newGame.downloadLink || ''}
                  onChange={(e) => setNewGame({...newGame, downloadLink: e.target.value})}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2">الفئة *</label>
                <select
                  value={newGame.category || 'ACTION'}
                  onChange={(e) => setNewGame({...newGame, category: e.target.value})}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
                >
                  <option value="ACTION">ألعاب أكشن</option>
                  <option value="WAR">ألعاب حرب</option>
                  <option value="FOOTBALL">ألعاب كرة قدم</option>
                  <option value="OPEN_WORLD">ألعاب عالم مفتوح</option>
                  <option value="CARS">ألعاب سيارات</option>
                  <option value="LIGHT">ألعاب خفيفة</option>
                  <option value="HORROR">ألعاب رعب</option>
                  <option value="STRATEGY">ألعاب استراتيجية</option>
                  <option value="CLASSIC">ألعاب قديمة</option>
                </select>
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2">المنصات المدعومة</label>
                <input
                  type="text"
                  value={newGame.platforms || ''}
                  onChange={(e) => setNewGame({...newGame, platforms: e.target.value})}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
                  placeholder="Windows, Mac, Linux"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2">متطلبات التشغيل</label>
                <textarea
                  value={newGame.systemReqs || ''}
                  onChange={(e) => setNewGame({...newGame, systemReqs: e.target.value})}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
                  rows={2}
                  placeholder="متطلبات النظام..."
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2">مواصفات إضافية</label>
                <textarea
                  value={newGame.gameSpecs || ''}
                  onChange={(e) => setNewGame({...newGame, gameSpecs: e.target.value})}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
                  rows={2}
                  placeholder="معلومات إضافية..."
                />
              </div>
            </div>
            
            <div className="flex gap-4 mt-6">
              <button
                onClick={handleAddGame}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 cursor-pointer"
                disabled={!newGame.title || !newGame.description || !newGame.imageUrl || !newGame.downloadLink}
              >
                ➕ إضافة اللعبة
              </button>
              <button
                onClick={() => {setShowAddModal(false); setNewGame({
                  title: '',
                  description: '',
                  imageUrl: '',
                  downloadLink: '',
                  category: 'ACTION',
                  platforms: '',
                  systemReqs: '',
                  gameSpecs: ''
                });}}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 cursor-pointer"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* نظام الإشعارات */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm ${
          notification.type === 'success' ? 'bg-green-500 text-white' :
          notification.type === 'error' ? 'bg-red-500 text-white' :
          notification.type === 'warning' ? 'bg-yellow-500 text-black' :
          'bg-blue-500 text-white'
        }`}>
          <div className="flex items-center gap-2">
            <span className="text-lg">
              {notification.type === 'success' ? '✅' :
               notification.type === 'error' ? '❌' :
               notification.type === 'warning' ? '⚠️' : 'ℹ️'}
            </span>
            <span className="flex-1">{notification.message}</span>
            <button 
              onClick={() => setNotification(null)}
              className="text-lg hover:opacity-70"
            >
              ×
            </button>
          </div>
        </div>
      )}
      
      {/* نافذة التأكيد */}
      {confirmDialog?.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4">
            <h3 className="text-lg font-bold mb-4 text-center">⚠️ تأكيد</h3>
            <p className="text-gray-700 mb-6 text-center">{confirmDialog.message}</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={confirmDialog.onConfirm}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 cursor-pointer"
              >
                نعم
              </button>
              <button
                onClick={() => setConfirmDialog(null)}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 cursor-pointer"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}