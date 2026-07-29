#!/usr/bin/env node

const { Command } = require('commander');
const { mockScrape } = require('./src/lib/scraper.js');

const program = new Command();

program
  .name('ecommerce-scraper')
  .description('电商商品价格自动化采集与对比 CLI 工具')
  .version('1.0.0');

program
  .command('search')
  .description('根据关键词采集主流电商平台数据')
  .argument('<keyword>', '需要搜索的商品关键词')
  .option('-m, --mock', '使用模拟数据（绕过反爬，默认开启用于演示）', true)
  .action(async (keyword, options) => {
    console.log(`\n🔍 开始采集商品: [${keyword}]`);
    console.log(`📡 正在连接各大电商平台 (京东, 淘宝, 拼多多)...`);
    
    try {
      // 真实环境可根据 options.mock 切换 realScrape
      const results = await mockScrape(keyword);
      
      console.log(`\n✅ 采集并清洗完成，共获取 ${results.length} 条有效数据。\n`);
      
      // 终端表格输出
      console.table(
        results.map(r => ({
          '平台': r.platform,
          '商品名称': r.title.substring(0, 15) + '...',
          '价格 (元)': r.price,
          '销量': r.sales,
          '评分': r.rating,
          '性价比推荐': r.isRecommended ? '⭐ 推荐' : ''
        }))
      );

      console.log(`\n💡 提示: 带有 ⭐ 推荐 的商品为基于 (评分/价格) 计算的性价比优选。\n`);
      
    } catch (error) {
      console.error(`❌ 采集失败:`, error);
    }
  });

program.parse();
