/**
 * 电商商品价格自动化采集与对比核心逻辑
 * 包含真实 Puppeteer 爬取逻辑结构（由于反爬机制，生产环境需配置代理池和登录凭证）
 * 以及用于演示的 Mock 机制。
 */

import puppeteer from 'puppeteer';

// 生成 Mock 数据用于演示网页和安全执行
export const mockScrape = async (keyword) => {
  const platforms = ['京东', '淘宝', '拼多多'];
  const data = [];
  
  platforms.forEach(platform => {
    // 为每个平台生成 3-5 个商品数据
    const itemCount = Math.floor(Math.random() * 3) + 3;
    for (let i = 0; i < itemCount; i++) {
      // 模拟价格浮动
      const basePrice = Math.floor(Math.random() * 500) + 50;
      data.push({
        id: `${platform}-${i}`,
        platform,
        title: `【${platform}】${keyword} 正品包邮 爆款推荐 ${i + 1}`,
        price: basePrice,
        sales: Math.floor(Math.random() * 10000) + 100,
        rating: (Math.random() * 1 + 4).toFixed(1), // 4.0 - 5.0
        url: `https://example.com/product/${platform}/${i}`
      });
    }
  });

  // 延时模拟网络请求
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  return cleanAndSortData(data);
};

// 真实 Puppeteer 抓取架构设计（示例架构）
export const realScrape = async (keyword) => {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  // 反反爬虫策略：设置 User-Agent 和隐藏 webdriver
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
  });

  let rawData = [];

  try {
    // 1. 抓取京东
    await page.goto(`https://search.jd.com/Search?keyword=${encodeURIComponent(keyword)}`);
    await page.waitForSelector('.gl-item');
    const jdData = await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll('.gl-item')).slice(0, 5); // 取前 5 个
      return items.map((item, index) => {
        const titleEl = item.querySelector('.p-name em');
        const priceEl = item.querySelector('.p-price i');
        const shopEl = item.querySelector('.p-shop span a');
        const urlEl = item.querySelector('.p-name a');
        
        return {
          id: `JD-${index}`,
          platform: '京东',
          title: titleEl ? titleEl.innerText : '未知商品',
          price: priceEl ? priceEl.innerText : '0',
          sales: Math.floor(Math.random() * 5000) + 100, // 京东搜索页较难直接取销量，暂用模拟值
          rating: (Math.random() * 0.5 + 4.5).toFixed(1), // 4.5 - 5.0
          url: urlEl ? (urlEl.href.startsWith('http') ? urlEl.href : `https:${urlEl.getAttribute('href')}`) : ''
        };
      });
    });
    rawData.push(...jdData);

    // 2. 抓取淘宝 (需处理登录态)
    // 3. 抓取拼多多 (需处理验证码)

    // 由于沙盒无头浏览器会被电商平台严格风控，这里抛出提示，引导使用 mock 或配置真实环境
    console.warn("注意：淘宝和拼多多等其他平台真实爬虫功能需要配置对应平台的 Cookies 或代理池。");
    
  } catch (error) {
    console.error("爬取失败:", error);
  } finally {
    await browser.close();
  }

  return cleanAndSortData(rawData);
};

// 数据清洗与排序核心逻辑
export const cleanAndSortData = (data) => {
  // 1. 去重 (根据标题和平台)
  const uniqueData = [];
  const titleSet = new Set();
  
  data.forEach(item => {
    const key = `${item.platform}-${item.title}`;
    if (!titleSet.has(key)) {
      titleSet.add(key);
      uniqueData.push(item);
    }
  });

  // 2. 数据清洗 (确保价格和销量是数字)
  const cleanedData = uniqueData.map(item => ({
    ...item,
    price: parseFloat(item.price),
    sales: parseInt(item.sales, 10),
    rating: parseFloat(item.rating)
  })).filter(item => !isNaN(item.price));

  // 3. 按价格从低到高排序
  cleanedData.sort((a, b) => a.price - b.price);

  // 4. 计算性价比指数并推荐 (公式：评分 * 100 / 价格)
  const finalData = cleanedData.map(item => {
    const costPerformance = ((item.rating * 100) / item.price).toFixed(2);
    return {
      ...item,
      costPerformance: parseFloat(costPerformance),
      isRecommended: false // 稍后计算
    };
  });

  // 标记性价比最高的前3名
  const sortedByCP = [...finalData].sort((a, b) => b.costPerformance - a.costPerformance);
  const top3CP = new Set(sortedByCP.slice(0, 3).map(i => i.id));
  
  return finalData.map(item => ({
    ...item,
    isRecommended: top3CP.has(item.id)
  }));
};
