const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// CORS配置 (开发环境允许所有来源，方便测试)
app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());

// AI对话端点
app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid request format' });
    }

    // 初始化Gemini API
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: '你是一个名为"文子双汐"的数字艺术工作室的AI客服助理。你负责解答访客的问题，介绍工作室的艺术风格（结合了传统书法、水墨与现代3D数字艺术），并提供联系方式。你的语气应该专业、优雅、富有艺术气息。'
    });
    
    // 把所有的消息映射为 Gemini 允许的 contents 格式
    const contents = messages.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    const result = await model.generateContent({
      contents: contents,
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.7,
        topP: 0.8,
        topK: 40
      }
    });

    const text = result.response.text();

    res.json({ text });
  } catch (error) {
    console.error('AI API Error:', error);
    res.status(500).json({ 
      error: 'AI服务暂时不可用，请稍后重试',
      details: error.message 
    });
  }
});

// 健康检查端点
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'AI代理服务器运行正常' });
});

app.listen(PORT, () => {
  console.log(`AI代理服务器运行在 http://localhost:${PORT}`);
  console.log(`Gemini API Key 配置状态: ${process.env.GEMINI_API_KEY ? '已配置' : '未配置'}`);
});

module.exports = app;