const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static(__dirname));

// 1. 科技专家/人才直接关系
app.post('/api/v1/expert/direct-relation', (req, res) => {
    const { expert_name } = req.body;
    res.json({
        code: 200,
        data: {
            expert: expert_name,
            relations: [
                { name: "李华", type: "论文合作", score: 0.95 },
                { name: "王明", type: "专利共有人", score: 0.88 }
            ],
            meta: { model: "RoBERTa-v1.5", time: "120ms" }
        }
    });
});

// 2. 科技单节点间接关系
app.post('/api/v1/expert/indirect-relation', (req, res) => {
    const { expert_name, depth = 2 } = req.body;
    res.json({
        code: 200,
        data: {
            center: expert_name,
            paths: [
                { target: "张三", hops: 2, path: [expert_name, "李四", "张三"] },
                { target: "赵五", hops: 2, path: [expert_name, "王六", "赵五"] }
            ],
            meta: { engine: "Neo4j-Graph-v2", time: "250ms" }
        }
    });
});

// 3. 科技两点合作成果
app.post('/api/v1/expert/coop-results', (req, res) => {
    const { expert_a, expert_b } = req.body;
    res.json({
        code: 200,
        data: {
            experts: [expert_a, expert_b],
            results: [
                { title: "基于图谱的专家推荐系统", type: "论文", year: 2023 },
                { title: "一种亿级规模的知识抽取方法", type: "专利", year: 2022 }
            ],
            meta: { engine: "Elasticsearch-Hybrid", time: "85ms" }
        }
    });
});

// 4. 科技专家同事关系
app.post('/api/v1/expert/colleague-relation', (req, res) => {
    const { expert_name } = req.body;
    res.json({
        code: 200,
        data: {
            expert: expert_name,
            colleagues: [
                { name: "刘洋", institution: "清华大学", period: "2018-至今" },
                { name: "陈静", institution: "清华大学", period: "2015-2020" }
            ],
            meta: { engine: "Rule-Engine-v2", time: "45ms" }
        }
    });
});

// 5. 科技专家校友关系
app.post('/api/v1/expert/alumni-relation', (req, res) => {
    const { expert_name } = req.body;
    res.json({
        code: 200,
        data: {
            expert: expert_name,
            alumni: [
                { name: "孙权", school: "北京大学", degree: "博士", grad_year: 2010 },
                { name: "周瑜", school: "北京大学", degree: "硕士", grad_year: 2012 }
            ],
            meta: { engine: "BERT-Entity-Alignment", time: "110ms" }
        }
    });
});

// 6. 科技专家论文合作关系
app.post('/api/v1/expert/paper-coop', (req, res) => {
    const { expert_name } = req.body;
    res.json({
        code: 200,
        data: {
            expert: expert_name,
            cooperation_network: [
                { collaborator: "诸葛亮", paper_count: 15, latest_paper: "Transformer in KG" },
                { collaborator: "司马懿", paper_count: 8, latest_paper: "Deep Learning for NLP" }
            ],
            meta: { engine: "Spark-Batch-Compute", time: "300ms" }
        }
    });
});

// 7. 重点关注科技企业关系
app.post('/api/v1/expert/enterprise-relation', (req, res) => {
    const { expert_name } = req.body;
    res.json({
        code: 200,
        data: {
            expert: expert_name,
            enterprises: [
                { name: "阿里巴巴", relation: "技术顾问", projects: 3 },
                { name: "腾讯", relation: "前员工", projects: 1 }
            ],
            meta: { engine: "Multi-Source-Fusion", time: "180ms" }
        }
    });
});

// 8. 科技产业链点TOP-N事件关系
app.post('/api/v1/industry/top-n-events', (req, res) => {
    const { node_name, n = 5 } = req.body;
    res.json({
        code: 200,
        data: {
            industry_node: node_name,
            top_events: [
                { event: "某芯片巨头发布新型AI加速器", impact_score: 0.95, date: "2024-03-15" },
                { event: "开源大模型算力标准发布", impact_score: 0.88, date: "2024-02-20" }
            ],
            meta: { engine: "RoBERTa-Text-Class", time: "210ms" }
        }
    });
});

// 9. 科技产业链全景图
app.post('/api/v1/industry/panorama', (req, res) => {
    const { industry_name } = req.body;
    res.json({
        code: 200,
        data: {
            industry: industry_name,
            layers: [
                { name: "上游: 算力层", entities: ["NVIDIA", "Intel", "AMD"] },
                { name: "中游: 模型层", entities: ["OpenAI", "Google", "Meta"] },
                { name: "下游: 应用层", entities: ["Microsoft", "Adobe", "Notion"] }
            ],
            meta: { engine: "DolphinScheduler-ETL", time: "400ms" }
        }
    });
});

app.listen(port, () => {
    console.log(`亿级知识图谱引擎原型运行在 http://localhost:${port}`);
});
