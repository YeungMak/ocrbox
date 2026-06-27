"use client";

import { useState, useEffect } from 'react';
import { Search, ShoppingCart, TrendingUp, Star, ExternalLink, Loader2 } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, ScatterChart, Scatter, ZAxis
} from 'recharts';

export default function Home() {
  const [keyword, setKeyword] = useState('机械键盘');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 初始化时加载一个示例
  useEffect(() => {
    handleSearch('机械键盘');
  }, []);

  const handleSearch = async (searchKeyword = keyword) => {
    if (!searchKeyword) return;
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword: searchKeyword })
      });
      const result = await res.json();
      
      if (result.success) {
        setData(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('网络请求失败，请稍后再试。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-8">
      <main className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col items-center justify-center space-y-4 py-8">
          <div className="p-3 bg-blue-600 rounded-full text-white shadow-lg">
            <ShoppingCart size={32} />
          </div>
          <h1 className="text-4xl font-bold tracking-tight">电商商品价格自动化采集与对比</h1>
          <p className="text-gray-500">一键跨平台比价，智能计算性价比优选 (演示版)</p>
          
          <div className="flex w-full max-w-md mt-6 shadow-sm rounded-lg overflow-hidden border border-gray-300 bg-white focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all">
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="输入商品关键词，例如：机械键盘"
              className="flex-1 px-4 py-3 outline-none text-gray-700"
            />
            <button
              onClick={() => handleSearch()}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 font-medium transition-colors flex items-center justify-center"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} />}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200 text-center">
            {error}
          </div>
        )}

        {/* Results Section */}
        {!loading && data.length > 0 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* Visualizations */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* 价格对比柱状图 */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center space-x-2 mb-6">
                  <TrendingUp className="text-blue-500" />
                  <h2 className="text-lg font-semibold">各平台价格分布对比</h2>
                </div>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis dataKey="platform" axisLine={false} tickLine={false} />
                      <YAxis axisLine={false} tickLine={false} />
                      <RechartsTooltip 
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        formatter={(value) => [`¥${value}`, '价格']}
                      />
                      <Legend />
                      <Bar dataKey="price" name="商品价格" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* 销量与价格散点图 */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center space-x-2 mb-6">
                  <Star className="text-yellow-500" />
                  <h2 className="text-lg font-semibold">价格-销量性价比矩阵</h2>
                </div>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis type="number" dataKey="price" name="价格" unit="元" axisLine={false} tickLine={false} />
                      <YAxis type="number" dataKey="sales" name="销量" axisLine={false} tickLine={false} />
                      <ZAxis type="number" dataKey="rating" range={[50, 400]} name="评分" />
                      <RechartsTooltip 
                        cursor={{ strokeDasharray: '3 3' }}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      />
                      <Legend />
                      <Scatter name="商品分布" data={data} fill="#8b5cf6" opacity={0.7} />
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Data Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-semibold">商品横向对比明细 (按价格排序)</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 text-sm">
                      <th className="p-4 font-medium">平台</th>
                      <th className="p-4 font-medium">商品名称</th>
                      <th className="p-4 font-medium">价格</th>
                      <th className="p-4 font-medium">销量</th>
                      <th className="p-4 font-medium">评分</th>
                      <th className="p-4 font-medium">推荐</th>
                      <th className="p-4 font-medium">直达</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-sm">
                    {data.map((item) => (
                      <tr key={item.id} className="hover:bg-blue-50/50 transition-colors">
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            item.platform === '京东' ? 'bg-red-100 text-red-700' :
                            item.platform === '淘宝' ? 'bg-orange-100 text-orange-700' :
                            'bg-pink-100 text-pink-700'
                          }`}>
                            {item.platform}
                          </span>
                        </td>
                        <td className="p-4 font-medium text-gray-800 max-w-xs truncate" title={item.title}>
                          {item.title}
                        </td>
                        <td className="p-4 font-bold text-blue-600">¥{item.price}</td>
                        <td className="p-4 text-gray-600">{item.sales.toLocaleString()}</td>
                        <td className="p-4 text-yellow-600 font-medium">{item.rating}</td>
                        <td className="p-4">
                          {item.isRecommended ? (
                            <span className="flex items-center space-x-1 text-green-600 font-medium">
                              <Star size={14} className="fill-green-600" />
                              <span>高性价比</span>
                            </span>
                          ) : '-'}
                        </td>
                        <td className="p-4">
                          <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600 transition-colors">
                            <ExternalLink size={18} />
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

      </main>
    </div>
  );
}
