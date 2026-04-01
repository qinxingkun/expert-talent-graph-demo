const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const port = 3001; // 为了避免与 semantic-tools-demo 冲突，使用 3001 端口

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// 静态文件服务
app.use(express.static(__dirname));

// 专家人才关系子系统 API
app.post('/api/v1/expert/direct-relation', (req, res) => {
    const { expert_name, target_domain = '通用', min_confidence = 0.8 } = req.body;
    
    // 模拟算法引擎处理逻辑
    const mockRelations = [
        { name: "李四", type: "论文合作", score: 0.98, institution: "清华大学", domain: target_domain },
        { name: "王五", type: "专利共有人", score: 0.85, institution: "北京大学", domain: target_domain },
        { name: "赵六", type: "项目组成员", score: 0.92, institution: "中国科学院", domain: target_domain },
        { name: "钱七", type: "师生关系", score: 0.78, institution: "浙江大学", domain: target_domain }
    ].filter(r => r.score >= min_confidence);

    res.json({
        code: 200,
        message: "success",
        data: {
            expert: expert_name || "未知专家",
            relations: mockRelations,
            meta: {
                model: "RoBERTa-MultiClass-v1.5",
                processing_time: `${Math.floor(Math.random() * 100) + 50}ms`,
                timestamp: new Date().toISOString()
            }
        }
    });
});

app.listen(port, () => {
    console.log(`专家人才关系子系统原型运行在 http://localhost:${port}`);
});
