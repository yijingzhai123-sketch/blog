/**
 * 文章元数据与数据管理
 * ZYJ 个人AI知识归纳
 */

const ARTICLES = [
  {
    id: 'ai-intro',
    title: '人工智能入门：从零开始的AI探索之旅',
    date: '2025-12-15',
    tags: ['AI基础', '入门', '科普'],
    emoji: '🤖',
    desc: '什么是人工智能？它为什么如此重要？这篇文章带你从零开始了解AI的核心概念、发展历史和未来趋势。',
    file: 'articles/ai-intro.md',
    readingTime: '8 分钟'
  },
  {
    id: 'llm-guide',
    title: '大语言模型（LLM）完全指南：原理、应用与实践',
    date: '2026-01-20',
    tags: ['LLM', '深度学习', 'NLP'],
    emoji: '🧠',
    desc: '深入解析大语言模型的工作原理，从Transformer架构到Prompt工程，全面理解ChatGPT背后的技术。',
    file: 'articles/llm-guide.md',
    readingTime: '12 分钟'
  },
  {
    id: 'ml-basics',
    title: '机器学习核心概念：监督学习、无监督学习与强化学习',
    date: '2026-02-28',
    tags: ['AI基础', '机器学习', '算法'],
    emoji: '📊',
    desc: '系统梳理机器学习的三大范式，通过生活化案例帮你理解分类、回归、聚类和强化学习的本质。',
    file: 'articles/ml-basics.md',
    readingTime: '10 分钟'
  },
  {
    id: 'dl-intro',
    title: '深度学习入门：神经网络、CNN与RNN',
    date: '2026-03-10',
    tags: ['深度学习', '神经网络', '计算机视觉'],
    emoji: '🔮',
    desc: '从感知机到卷积神经网络，可视化理解深度学习的核心组件，掌握CNN和RNN的应用场景。',
    file: 'articles/dl-intro.md',
    readingTime: '11 分钟'
  },
  {
    id: 'agi',
    title: '通向AGI之路：通用人工智能的现状与展望',
    date: '2026-04-05',
    tags: ['AGI', '前沿', 'AI基础'],
    emoji: '🌌',
    desc: '探讨通用人工智能的定义、当前进展和技术瓶颈，理性分析AGI距离我们还有多远。',
    file: 'articles/agi.md',
    readingTime: '9 分钟'
  },
  {
    id: 'ai-tools',
    title: 'AI效率工具大全：2026年必备的AI助手推荐',
    date: '2026-05-01',
    tags: ['AI应用', '工具', '效率'],
    emoji: '🛠️',
    desc: '盘点2026年最值得使用的AI效率工具，涵盖写作、编程、设计、数据分析等场景，提升你的工作效率。',
    file: 'articles/ai-tools.md',
    readingTime: '7 分钟'
  }
];

function getAllTags() {
  const tags = new Set();
  ARTICLES.forEach(a => a.tags.forEach(t => tags.add(t)));
  return Array.from(tags).sort();
}

function filterByTag(tag) {
  if (!tag || tag === 'all') return ARTICLES;
  return ARTICLES.filter(a => a.tags.includes(tag));
}

function searchArticles(query) {
  if (!query) return ARTICLES;
  const q = query.toLowerCase();
  return ARTICLES.filter(a =>
    a.title.toLowerCase().includes(q) ||
    a.desc.toLowerCase().includes(q) ||
    a.tags.some(t => t.toLowerCase().includes(q))
  );
}

function getArticleById(id) {
  return ARTICLES.find(a => a.id === id);
}

async function loadMarkdown(filePath) {
  try {
    const response = await fetch(filePath);
    if (!response.ok) throw new Error('文件加载失败');
    return await response.text();
  } catch (error) {
    console.error('加载文章失败:', error);
    return null;
  }
}
