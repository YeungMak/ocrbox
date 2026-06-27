import { NextResponse } from 'next/server';
import { mockScrape } from '@/lib/scraper';

export async function POST(request) {
  try {
    const body = await request.json();
    const { keyword } = body;

    if (!keyword) {
      return NextResponse.json({ error: '请提供搜索关键词' }, { status: 400 });
    }

    // 在服务端执行抓取逻辑（此处调用 mock 演示版）
    const data = await mockScrape(keyword);

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
