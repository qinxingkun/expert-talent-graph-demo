const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// 1. 请求日志中间件 (必须最先运行)
app.use((req, res, next) => {
    console.log(`[LOG] ${req.method} ${req.url}`);
    next();
});

// 2. 核心 API 路由 (必须在静态文件服务之前)

// 健康检查接口
app.get('/api/v1/health', (req, res) => {
    res.json({ status: 'ok', message: '专家图谱后端服务运行正常' });
});

// --- 科技专家/人才直接关系 (子功能接口) ---
app.post('/api/v1/expert/collect', (req, res) => {
    res.json({
        code: 200,
        message: "【多源采集】自动化调度任务已触发 (硬编码响应)",
        data: {
            task_id: "TASK_EXT_" + Date.now(),
            status: "running",
            source: req.body.source_config || "Combined",
            engine: "DolphinScheduler-v3.0"
        }
    });
});

app.post('/api/v1/expert/align', (req, res) => {
    res.json({
        code: 200,
        message: "【实体消歧】对齐成功 (硬编码响应)",
        data: {
            scholar_id: "SCH_ZHANG_8872",
            standard_name: req.body.scholar_name || "张三",
            institution: req.body.raw_inst || "清华大学",
            confidence: 0.998,
            model: req.body.align_model || "BERT-Dual-Tower-v2"
        }
    });
});

app.post('/api/v1/expert/map', (req, res) => {
    res.json({
        code: 200,
        message: "【关系映射】完成并入库 (硬编码响应)",
        data: {
            nodes_written: 8,
            edges_written: 15,
            target_db: req.body.target_db || "Neo4j-Cluster-Main",
            status: "success"
        }
    });
});

app.post('/api/v1/expert/vectorize', (req, res) => {
    res.json({
        code: 200,
        message: "【文本向量化】入库成功 (硬编码响应)",
        data: {
            dimensions: req.body.vec_dim || 768,
            vector_db: req.body.vector_db || "Milvus",
            processing_ms: 45
        }
    });
});

app.post('/api/v1/expert/profile', (req, res) => {
    res.json({
        code: 200,
        message: "【专家画像】数据报文生成成功 (硬编码响应)",
        data: {
            scholar_id: req.body.scholar_id || "SCH_001",
            basic_info: { name: "张三", title: "教授" },
            metrics: { academic_contribution: 0.92, coop_degree: 0.78 }
        }
    });
});

app.post('/api/v1/expert/hover', (req, res) => {
    res.json({
        code: 200,
        message: "【成果元数据】异步请求成功 (硬编码响应)",
        data: {
            id: req.body.result_id || "RES_001",
            title: "基于Transformer的图谱构建方法",
            year: 2023,
            abstract: "本文提出一种分布式的图谱构建方案..."
        }
    });
});

app.post('/api/v1/expert/drilldown', (req, res) => {
    res.json({
        code: 200,
        message: "【成果关联下钻】查询成功 (硬编码响应)",
        data: {
            result_id: req.body.result_id || "RES_001",
            authors: ["张三", "李四", "王五"],
            contribution: { "张三": "45%", "李四": "30%", "王五": "25%" }
        }
    });
});

app.post('/api/v1/expert/graph-drilldown', (req, res) => {
    res.json({
        code: 200,
        message: "【图谱层级钻取】成功 (硬编码响应)",
        data: {
            center: req.body.center_node || "SCH_001",
            depth: req.body.drill_depth || 2,
            added_nodes: 25,
            added_edges: 42
        }
    });
});

app.post('/api/v1/expert/filter', (req, res) => {
    res.json({
        code: 200,
        message: "【关系过滤】结果已更新 (硬编码响应)",
        data: {
            filters: req.body,
            nodes_count: 15,
            edges_count: 28
        }
    });
});

app.post('/api/v1/expert/style', (req, res) => {
    res.json({
        code: 200,
        message: "【样式自定义】配置已保存 (硬编码响应)",
        data: {
            template: req.body.style_template || "Default",
            status: "Persistent"
        }
    });
});

// --- 科技单节点间接关系 (子功能接口) ---
app.post('/api/v1/indirect/node-position', (req, res) => {
    res.json({
        code: 200,
        message: "【节点定位】成功",
        data: {
            node_id: "NODE_IND_442",
            standard_name: req.body.scholar_name || "李四",
            matched_institution: req.body.institution || "北京大学计算机学院",
            matched_research: req.body.research_dir || "深度学习",
            confidence: 0.985,
            disambiguation_used: "BERT-Multi-Task-v2"
        }
    });
});

app.post('/api/v1/indirect/path-breakdown', (req, res) => {
    res.json({
        code: 200,
        message: "【路径拆解】完成",
        data: {
            total_paths: 2,
            max_depth: req.body.max_hops || 3,
            paths: [
                { hops: 2, nodes: [req.body.source_id, "NODE_MID_050", req.body.target_id], relations: ["CO_AUTHOR", "PROJECT_COOP"] }
            ],
            engine: "Neo4j-Cypher-Optimized"
        }
    });
});

app.post('/api/v1/indirect/strength-model', (req, res) => {
    res.json({
        code: 200,
        message: "【强度计算】成功",
        data: {
            overall_strength: 0.824,
            breakdown: {
                path_decay: -0.15 * (req.body.decay_factor || 0.8),
                node_contribution: 0.45,
                coop_frequency: 0.38,
                inst_overlap: 0.14
            },
            normalization: req.body.norm_type || "Min-Max-Standard"
        }
    });
});

// --- 科技两点合作成果 (子功能接口) ---
app.post('/api/v1/coop/expert-pos', (req, res) => {
    res.json({
        code: 200,
        message: "【双专家定位】成功 (硬编码响应)",
        data: {
            expert_a: req.body.专家A标识 || "张三",
            expert_b: req.body.专家B标识 || "李四",
            confidence: 0.998,
            status: "locked"
        }
    });
});

app.post('/api/v1/coop/multi-search', (req, res) => {
    res.json({
        code: 200,
        message: "【多源成果关联检索】完成 (硬编码响应)",
        data: {
            graph_results: 12,
            vector_results: 5,
            total: 17
        }
    });
});

app.post('/api/v1/coop/batch-summary', (req, res) => {
    res.json({
        code: 200,
        message: "【合作成果汇总】成功 (硬编码响应)",
        data: {
            deduplicated: 3,
            list_count: 14
        }
    });
});

app.post('/api/v1/coop/multi-stats', (req, res) => {
    res.json({
        code: 200,
        message: "【多维分类统计】完成 (硬编码响应)",
        data: {
            stats: { paper: 8, patent: 4, grant: 2 },
            trends: [3, 5, 6]
        }
    });
});

app.post('/api/v1/coop/info-extract', (req, res) => {
    res.json({
        code: 200,
        message: "【关键信息提取】完成 (硬编码响应)",
        data: {
            fields_extracted: ["Journal", "PatentNo", "Period"],
            llm_supplement: "Awards added"
        }
    });
});

app.post('/api/v1/coop/attr-tagging', (req, res) => {
    res.json({
        code: 200,
        message: "【成果属性标注】成功 (硬编码响应)",
        data: {
            archive_id: "ARC_COOP_2024_001",
            status: "tagged"
        }
    });
});

app.post('/api/v1/coop/contrib-analysis', (req, res) => {
    res.json({
        code: 200,
        message: "【合作贡献分析】完成 (硬编码响应)",
        data: {
            contrib_a: 0.55,
            contrib_b: 0.45,
            conclusion: "Balanced contribution"
        }
    });
});

app.post('/api/v1/coop/mode-id', (req, res) => {
    res.json({
        code: 200,
        message: "【合作模式识别】完成 (硬编码响应)",
        data: {
            mode: "Long-term Stable",
            confidence: 0.96
        }
    });
});

app.post('/api/v1/coop/value-eval', (req, res) => {
    res.json({
        code: 200,
        message: "【合作价值评估】成功 (硬编码响应)",
        data: {
            score: 92.5,
            grade: "S",
            report_url: "/reports/coop_eval_001.pdf"
        }
    });
});

// --- 综合功能接口 (其他子系统) ---

// --- 科技专家同事关系 (9个子功能接口) ---
app.post('/api/v1/colleague/data-integration', (req, res) => {
    res.json({
        code: 200,
        message: "【工作经历数据整合】成功",
        data: {
            "任务ID": "TASK_COL_INT_20240401_001",
            "数据源状态": {
                "中外论文库": "连接正常",
                "专利数据库": "分片同步中",
                "公开简历源": "增量更新完成"
            },
            "采集记录总数": "2,580,000+",
            "清洗引擎状态": req.body.清洗引擎 || "已开启",
            "自动修复统计": {
                "时间格式修正": 12500,
                "缺失字段补全": 8200,
                "重复记录剔除": 3500
            },
            "调度引擎": "Apache DolphinScheduler v3.0",
            "存储位置": "MySQL: scholar_work_experience"
        }
    });
});

app.post('/api/v1/colleague/standardization', (req, res) => {
    res.json({
        code: 200,
        message: "【任职信息标准化处理】完成",
        data: {
            "原始机构文本": req.body.机构名称 || "清华计算机系",
            "标准机构名称": "清华大学计算机科学与技术系",
            "机构唯一标识": "INST_THU_CS_001",
            "地理编码结果": {
                "省份": "北京市",
                "城市": "北京市",
                "区县": "海淀区",
                "经纬度": "116.3264, 40.0035"
            },
            "对齐置信度": 0.997,
            "模糊匹配算法": "Levenshtein + Jaro-Winkler",
            "高德地图API调用状态": req.body.地域补全 || "成功"
        }
    });
});

app.post('/api/v1/colleague/smart-reasoning', (req, res) => {
    res.json({
        code: 200,
        message: "【同事关系智能推理构建】成功",
        data: {
            "推理算法": req.body.匹配算法 || "时间重叠匹配",
            "分析机构": "清华大学计算机科学与技术系",
            "候选学者对总数": 12500,
            "推理成功关系数": 8750,
            "推理示例": [
                {
                    "学者A": "张三 (SCH_001)",
                    "学者B": "李四 (SCH_002)",
                    "重叠时段": "2015-06 至 2018-12",
                    "重叠月数": 42,
                    "推理置信度": 0.98
                }
            ],
            "分布式并发数": req.body.并行规模 || 16,
            "图数据库写入状态": "Neo4j-Cluster-Main: Success"
        }
    });
});

app.post('/api/v1/colleague/period-calc', (req, res) => {
    res.json({
        code: 200,
        message: "【同事关系时段核算】完成",
        data: {
            "学者A": {
                "姓名": "张三",
                "ID": "SCH_001",
                "任职区间": req.body.学者A时段 || "2010-01 至 2018-12",
                "任职机构": "清华大学计算机系"
            },
            "学者B": {
                "姓名": "李四",
                "ID": "SCH_002",
                "任职区间": req.body.学者B时段 || "2015-06 至 2022-05",
                "任职机构": "清华大学计算机系"
            },
            "同事关系生效时间": "2015-06",
            "同事关系截止时间": "2018-12",
            "共同在职时长": "42个月 (3年6个月)",
            "时段重叠算法": "Interval-Intersection",
            "核算精度": "月份级别"
        }
    });
});

app.post('/api/v1/colleague/bg-mining', (req, res) => {
    res.json({
        code: 200,
        message: "【任职背景挖掘】成功",
        data: {
            "挖掘对象": "张三 (SCH_001) 与 李四 (SCH_002)",
            "挖掘深度": req.body.挖掘深度 || "部门+团队+地域",
            "NER模型版本": "BERT-NER-v3",
            "挖掘结果": {
                "共同部门": "计算机科学与技术系",
                "共同团队": "智能计算实验室",
                "地域背景": "北京市海淀区",
                "研究方向交集": ["人工智能", "大数据", "分布式计算"]
            },
            "背景描述生成": "两位学者在2015-2018年间同属清华大学计算机系智能计算实验室，研究方向高度重合。",
            "抽取实体数": 12,
            "置信度": 0.94
        }
    });
});

app.post('/api/v1/colleague/archive', (req, res) => {
    res.json({
        code: 200,
        message: "【关系背景标注归档】已入库",
        data: {
            "档案编号": "ARC_COL_2024_001",
            "档案版本": req.body.档案版本 === "开启" ? "V_20240401_SNAPSHOT" : "无快照",
            "归档内容": {
                "关系ID": "REL_COL_THU_001",
                "学者对": "张三 <-> 李四",
                "同事时段": "2015-06 至 2018-12",
                "共同部门": "计算机科学与技术系",
                "共同团队": "智能计算实验室"
            },
            "存储位置": "MySQL: colleague_relation_archive",
            "快照生成状态": req.body.档案版本 || "已开启",
            "可追溯性": "支持历史版本回溯查询"
        }
    });
});

app.post('/api/v1/colleague/result-search', (req, res) => {
    res.json({
        code: 200,
        message: "【协作成果精准检索】完成",
        data: {
            "检索对象": "张三 (SCH_001) 与 李四 (SCH_002)",
            "同事时段": "2015-06 至 2018-12",
            "成果类型": req.body.成果类型 || "论文+专利",
            "检索引擎": req.body.检索引擎 || "Elasticsearch-Cluster",
            "检索结果": {
                "共同论文数": 5,
                "共同专利数": 3,
                "成果总数": 8
            },
            "成果清单": [
                { "ID": "DOI_10.1145_331", "类型": "论文", "标题": "大规模图数据处理优化方法", "发表时间": "2017-05" },
                { "ID": "DOI_10.1109_KDD", "类型": "论文", "标题": "基于深度学习的实体对齐研究", "发表时间": "2016-08" },
                { "ID": "PAT_CN2018_001", "类型": "专利", "标题": "一种分布式索引构建装置", "授权时间": "2018-11" }
            ],
            "检索耗时": "45ms",
            "全文索引命中数": 125
        }
    });
});

app.post('/api/v1/colleague/match-verify', (req, res) => {
    res.json({
        code: 200,
        message: "【成果关联匹配校验】完成",
        data: {
            "校验成果数": 8,
            "校验通过数": 8,
            "校验失败数": 0,
            "消歧模型": req.body.消歧模型 || "BERT-Base",
            "校验详情": [
                {
                    "成果ID": "DOI_10.1145_331",
                    "作者列表": ["张三", "李四", "王五"],
                    "身份校验": {
                        "张三": { "匹配状态": "确认", "学者ID": "SCH_001", "置信度": 0.99 },
                        "李四": { "匹配状态": "确认", "学者ID": "SCH_002", "置信度": 0.98 }
                    }
                }
            ],
            "同名歧义排除": {
                "排除数": 2,
                "排除详情": "已排除同名(张三, 某高校行政人员)的关联"
            },
            "校验结论": "所有成果关联均通过身份校验，无歧义干扰"
        }
    });
});

app.post('/api/v1/colleague/visual-adapt', (req, res) => {
    res.json({
        code: 200,
        message: "【协作成果联动展示适配】成功",
        data: {
            "适配模式": req.body.适配模式 || "图谱联动+时间轴",
            "输出格式": "标准化JSON",
            "图谱数据": {
                "节点数": 15,
                "关系边数": 22,
                "节点类型": ["学者", "机构", "成果"],
                "布局算法": "Force-Directed"
            },
            "时间轴数据": {
                "起始时间": "2015-06",
                "截止时间": "2018-12",
                "事件节点数": 8,
                "时间粒度": "月份"
            },
            "可视化组件": "AntV-G6 + AntV-Timeline",
            "前端适配状态": "Ready"
        }
    });
});

// --- 科技专家校友关系 (子功能接口) ---
// 1. 教育经历数据整合
app.post('/api/v1/alumni/data-integration', (req, res) => {
    res.json({
        code: 200,
        message: "【教育经历数据整合】成功",
        data: {
            任务ID: "TASK_EDU_INT_20240401_001",
            数据源状态: { "中外论文库": "已同步", "专利数据库": "已同步", "公开简历源": "增量更新中" },
            整合记录数: "15,823,456",
            清洗去重数: "1,245,892",
            地域补全数: "12,500,000+",
            调度引擎: "Apache DolphinScheduler v3.0",
            处理耗时: "2小时35分钟"
        }
    });
});

// 2. 校友关系智能识别构建
app.post('/api/v1/alumni/smart-build', (req, res) => {
    res.json({
        code: 200,
        message: "【校友关系智能识别构建】完成",
        data: {
            识别任务ID: "BUILD_ALUM_20240401_001",
            目标院校: req.body.院校范围 ? req.body.院校范围.split(',') : ["清华大学", "北京大学", "浙江大学"],
            时间跨度: req.body.时间跨度 || "2000-2024",
            匹配粒度: req.body.匹配粒度 || "院系级",
            识别校友关系数: "8,562,341",
            院校级关系: "5,234,567",
            院系级关系: "3,327,774",
            匹配算法: "院校名称标准化 + 教育时段交集判定",
            状态: "Success"
        }
    });
});

// 3. 校友关系精准细分
app.post('/api/v1/alumni/precise-classify', (req, res) => {
    res.json({
        code: 200,
        message: "【校友关系精准细分】完成",
        data: {
            关系ID: "REL_ALUM_20240401_001",
            学者A: { 姓名: "张三", 学历: "博士", 院系: "计算机科学技术系", 院校: "清华大学", 入学年份: 2010 },
            学者B: { 姓名: "李四", 学历: "硕士", 院系: "计算机科学技术系", 院校: "清华大学", 入学年份: 2011 },
            细分类型: "院友 (同系不同级)",
            教育阶段细分: "博士-硕士传承关系",
            Apollo匹配规则: req.body.分类规则 || "ALUMNI_TYPE_DECISION_TREE",
            置信等级: "极高",
            判定依据: "同一院系、教育时段存在交集"
        }
    });
});

// 4. 细分规则配置优化
app.post('/api/v1/alumni/rule-config', (req, res) => {
    res.json({
        code: 200,
        message: "【细分规则配置优化】成功",
        data: {
            规则名称: req.body.规则名称 || "院校匹配粒度规则_v2",
            规则ID: "RULE_MATCH_V2_20240401",
            匹配粒度: req.body.匹配粒度 || "层级匹配",
            教育阶段分类: ["本科", "硕士", "博士"],
            生效院校数: 985,
            配置来源: "Apollo配置中心",
            更新时间: new Date().toISOString(),
            状态: "已生效"
        }
    });
});

// 5. 核心维度信息记录
app.post('/api/v1/alumni/dimension-record', (req, res) => {
    res.json({
        code: 200,
        message: "【核心维度信息记录】成功",
        data: {
            档案ID: "ARCH_ALUM_20240401_001",
            校友关系ID: req.body.校友关系ID || "REL_ALUM_20240401_001",
            核心维度: {
                学者A_ID: "SCH_ZHANG_8872",
                学者B_ID: "SCH_LI_8821",
                院校: "清华大学",
                院系: "计算机科学技术系",
                学者A入学年份: 2010,
                学者B入学年份: 2011,
                细分类型: "院友 (同系不同级)"
            },
            存储格式: req.body.存储格式 || "MySQL",
            写入状态: "Success",
            记录时间: new Date().toISOString()
        }
    });
});

// 6. 学术互动信息检索
app.post('/api/v1/alumni/academic-interact', (req, res) => {
    res.json({
        code: 200,
        message: "【学术互动信息检索】成功",
        data: {
            校友关系ID: req.body.校友关系标识 || "REL_ALUM_5521",
            检索时段: req.body.检索时段 || "2010-09 至 2014-07",
            互动成果总数: 8,
            互动详情: [
                { 名称: "基于BERT的实体对齐研究", 类型: "论文", 发表时间: "2012-05", 关联性: "教育时段共同产出" },
                { 名称: "国家自然科学基金重点项目", 类型: "基金项目", 立项时间: "2013-01", 角色: "共同成员" },
                { 名称: "一种基于图神经网络的知识推理方法", 类型: "专利", 申请时间: "2013-08", 发明人排序: "第2、第3" }
            ],
            ES聚合耗时: "32ms",
            索引分片: "es_shard_alumni_03"
        }
    });
});

// 7. 职业互动信息挖掘
app.post('/api/v1/alumni/career-interact', (req, res) => {
    res.json({
        code: 200,
        message: "【职业互动信息挖掘】完成",
        data: {
            校友关系ID: req.body.校友关系标识 || "REL_ALUM_5521",
            职业互动类型: req.body.互动类型 || "全部",
            互动记录数: 3,
            互动详情: [
                { 类型: "共同任职", 机构: "北京智源人工智能研究院", 时段: "2018-2020", 角色: "均任研究员" },
                { 类型: "共同创业", 公司: "北京图智科技有限公司", 成立时间: "2020-05", 股权占比: "张三15%、李四10%" }
            ],
            地域背景补全: { 省份: "北京市", 城市: "北京市", 经纬度: "116.31, 39.99" },
            数据来源: "公开工商信息、LinkedIn等"
        }
    });
});

// 8. 互动与合作信息联动展示适配
app.post('/api/v1/alumni/visual-adapt', (req, res) => {
    res.json({
        code: 200,
        message: "【互动与合作信息联动展示适配】成功",
        data: {
            校友关系ID: req.body.校友关系标识 || "REL_ALUM_5521",
            展示维度: req.body.展示维度 || "全部",
            可视化引擎: req.body.可视化引擎 || "AntV G6",
            节点数据: {
                关系档案: { 学者A: "张三", 学者B: "李四", 关系类型: "院友", 院校: "清华大学计算机系" },
                学术互动: { 论文: 5, 专利: 2, 基金项目: 1 },
                职业互动: { 共同任职: 1, 共同创业: 1 }
            },
            边数据: [
                { source: "张三", target: "李四", type: "校友关系", weight: 0.92 },
                { source: "张三", target: "论文_001", type: "产出", weight: 1.0 }
            ],
            JSON结构预览: '{ "nodes": [...], "edges": [...], "metadata": {...} }',
            适配状态: "Ready"
        }
    });
});

// --- 科技专家论文合作关系 (子功能接口) ---
app.post('/api/v1/paper/data-integration', (req, res) => {
    res.json({
        code: 200,
        message: "【亿级论文数据整合】完成 (硬编码响应)",
        data: {
            task_id: "DS_JOB_PAPER_INT_001",
            source: req.body.采集源 || "WOS",
            scale: req.body.采集规模 || 100000000,
            scheduler: req.body.调度引擎 || "Apache DolphinScheduler",
            integrated_records: 98756432,
            status: "success"
        }
    });
});

app.post('/api/v1/paper/author-disambiguation', (req, res) => {
    res.json({
        code: 200,
        message: "【作者消歧精准校验】完成 (硬编码响应)",
        data: {
            original_name: req.body.原始姓名 || "Li Wei",
            scholar_id: "SCH_THU_092",
            standard_name: "李维",
            institution: req.body.标准单位 || "清华大学计算机科学与技术系",
            confidence: 0.994,
            model_version: "BERT-Large-Author-v2"
        }
    });
});

app.post('/api/v1/paper/network-build', (req, res) => {
    res.json({
        code: 200,
        message: "【论文合作关系网络搭建】完成 (硬编码响应)",
        data: {
            network_id: "NET_COOP_2024_Q1",
            node_count: 8567234,
            edge_count: 45678901,
            graph_db: "Neo4j 5.x 集群",
            status: "success"
        }
    });
});

app.post('/api/v1/paper/coop-count', (req, res) => {
    res.json({
        code: 200,
        message: "【合作论文数量统计】完成 (硬编码响应)",
        data: {
            scholar_id: req.body.学者ID || "SCH_THU_092",
            total_papers: 156,
            collaborators: 42,
            top_collaborators: [
                { name: "王明", institution: "北京大学", papers: 28 },
                { name: "张华", institution: "清华大学", papers: 22 },
                { name: "刘洋", institution: "中科院", papers: 18 }
            ]
        }
    });
});

app.post('/api/v1/paper/journal-distribution', (req, res) => {
    res.json({
        code: 200,
        message: "【期刊/会议级别分布统计】完成 (硬编码响应)",
        data: {
            scholar_id: req.body.学者ID || "SCH_THU_092",
            total_papers: 156,
            distribution: {
                "SCI一区": 45,
                "SCI二区": 38,
                "SCI三区": 22,
                "SCI四区": 15,
                "EI": 28,
                "中文核心": 8
            },
            avg_impact_factor: 8.76
        }
    });
});

app.post('/api/v1/paper/citation-stats', (req, res) => {
    res.json({
        code: 200,
        message: "【论文被引情况统计】完成 (硬编码响应)",
        data: {
            scholar_id: req.body.学者ID || "SCH_THU_092",
            total_citations: 8567,
            h_index: 32,
            i10_index: 58,
            highly_cited: [
                { title: "Deep Learning for Image Recognition", citations: 856, year: 2020 },
                { title: "Transformer-based Object Detection", citations: 623, year: 2021 }
            ]
        }
    });
});

app.post('/api/v1/paper/research-direction', (req, res) => {
    res.json({
        code: 200,
        message: "【合作研究方向分析】完成 (硬编码响应)",
        data: {
            scholar_id: req.body.学者ID || "SCH_THU_092",
            directions: [
                { name: "计算机视觉", ratio: "45%", collaborators: 28 },
                { name: "深度学习", ratio: "32%", collaborators: 22 },
                { name: "自然语言处理", ratio: "15%", collaborators: 12 }
            ],
            top_keywords: ["目标检测", "图像分割", "特征提取", "神经网络", "注意力机制"]
        }
    });
});

app.post('/api/v1/paper/team-identify', (req, res) => {
    res.json({
        code: 200,
        message: "【核心合作团队识别】完成 (硬编码响应)",
        data: {
            scholar_id: req.body.学者ID || "SCH_THU_092",
            algorithm: "Louvain社区发现",
            team_count: 5,
            core_teams: [
                { id: "TEAM_001", size: 12, core_members: ["李维", "王明", "张华", "刘洋"], tightness: 0.89 },
                { id: "TEAM_002", size: 8, core_members: ["李维", "陈强", "赵敏"], tightness: 0.76 }
            ]
        }
    });
});

app.post('/api/v1/paper/influence-eval', (req, res) => {
    res.json({
        code: 200,
        message: "【合作网络影响力评估】完成 (硬编码响应)",
        data: {
            scholar_id: req.body.学者ID || "SCH_THU_092",
            model: "XGBoost影响力模型",
            overall_score: 87.6,
            dimensions: {
                academic_output: 92,
                collaboration_breadth: 85,
                collaboration_depth: 88,
                network_centrality: 82
            },
            ranking: { global: "Top 5%", domestic: "Top 2%", field: "Top 3%" }
        }
    });
});

// --- 重点关注科技企业关系 (子功能接口) ---
app.post('/api/v1/enterprise/data-integration', (req, res) => {
    res.json({
        code: 200,
        message: "【多源数据整合】成功 (硬编码响应)",
        data: {
            integrated_records: 12500,
            sources: req.body.数据源 || "全量",
            status: "success"
        }
    });
});

app.post('/api/v1/enterprise/standardization', (req, res) => {
    res.json({
        code: 200,
        message: "【企业信息标准化】完成 (硬编码响应)",
        data: {
            original_name: req.body.企业名称 || "阿里",
            standard_name: "阿里巴巴(中国)有限公司",
            credit_code: "91330100712560555A",
            industry: "互联网服务",
            confidence: 0.997
        }
    });
});

app.post('/api/v1/enterprise/match-verify', (req, res) => {
    res.json({
        code: 200,
        message: "【匹配校验】通过 (硬编码响应)",
        data: {
            scholar_id: req.body.学者标识 || "SCH_001",
            enterprise_id: req.body.企业标识 || "ENT_001",
            match_status: "verified",
            evidence: "Patent/Grant overlap detected"
        }
    });
});

app.post('/api/v1/enterprise/relation-build', (req, res) => {
    res.json({
        code: 200,
        message: "【多元关系构建】成功 (硬编码响应)",
        data: {
            relations_created: 3,
            types: ["Position", "Consultant", "R&D Coop"],
            graph_db: "Neo4j-Main"
        }
    });
});

app.post('/api/v1/enterprise/role-id', (req, res) => {
    res.json({
        code: 200,
        message: "【专家角色识别】成功 (硬编码响应)",
        data: {
            detected_role: "Core Expert (In-service)",
            confidence: 0.92,
            model: "RoBERTa-Role-v2"
        }
    });
});

app.post('/api/v1/enterprise/coop-extract', (req, res) => {
    res.json({
        code: 200,
        message: "【合作详情提取】完成 (硬编码响应)",
        data: {
            tech_fields: ["AI", "Knowledge Graph"],
            period: "2019-2023",
            mode: "Joint Lab"
        }
    });
});

app.post('/api/v1/enterprise/archive', (req, res) => {
    res.json({
        code: 200,
        message: "【标注归档】已入库 (硬编码响应)",
        data: {
            archive_id: "ARC_88291",
            path: "/mnt/storage/archives/ent_rel_001"
        }
    });
});

app.post('/api/v1/enterprise/bg-integration', (req, res) => {
    res.json({
        code: 200,
        message: "【企业背景整合】成功 (硬编码响应)",
        data: {
            patent_count: 45200,
            grant_support: "High",
            last_update: "2024-04-01"
        }
    });
});

app.post('/api/v1/enterprise/core-analysis', (req, res) => {
    res.json({
        code: 200,
        message: "【核心维度分析】结论已生成 (硬编码响应)",
        data: {
            industry_rank: "Top 1%",
            tech_competitiveness: 0.96,
            report_summary: "Dominant player in AI patents and expert collaborations."
        }
    });
});

// --- 科技产业链点TOP-N事件 (子功能接口) ---
app.post('/api/v1/event/position', (req, res) => {
    res.json({
        code: 200,
        message: "【环节定位】成功 (硬编码响应)",
        data: {
            text: req.body.文本内容 || "默认文本",
            matched_node: "GPU加速器",
            confidence: 0.945
        }
    });
});

app.post('/api/v1/event/integration', (req, res) => {
    res.json({
        code: 200,
        message: "【事件整合】完成 (硬编码响应)",
        data: {
            event_id: "EVT_GPU_2024_001",
            records: 5,
            status: "success"
        }
    });
});

app.post('/api/v1/event/impact-model', (req, res) => {
    res.json({
        code: 200,
        message: "【影响力评估】成功 (硬编码响应)",
        data: {
            score: 92.5,
            rank: "Top 0.5%",
            model: "XGBoost-Regressor-v3"
        }
    });
});

app.post('/api/v1/event/screening', (req, res) => {
    res.json({
        code: 200,
        message: "【TOP-N筛选】完成 (硬编码响应)",
        data: {
            n: req.body.N值 || 10,
            results: [{ id: "EVT_001", title: "GPU突破", score: 92.5 }]
        }
    });
});

app.post('/api/v1/event/subject-mining', (req, res) => {
    res.json({
        code: 200,
        message: "【主体挖掘】成功 (硬编码响应)",
        data: {
            experts: ["张三", "李四"],
            team: "并行计算实验室"
        }
    });
});

app.post('/api/v1/event/relation-verify', (req, res) => {
    res.json({
        code: 200,
        message: "【关系校验】完成 (硬编码响应)",
        data: {
            status: "verified",
            evidence: "Institutional match"
        }
    });
});

app.post('/api/v1/event/team-completion', (req, res) => {
    res.json({
        code: 200,
        message: "【团队补充】成功 (硬编码响应)",
        data: {
            community: "Parallel-Group-A",
            new_edges: 5
        }
    });
});

app.post('/api/v1/event/impact-analysis', (req, res) => {
    res.json({
        code: 200,
        message: "【影响分析】结论已生成 (硬编码响应)",
        data: {
            tech_impact: "Evolution to specialized hardware",
            comp_impact: "Improved domestic autonomy"
        }
    });
});

app.post('/api/v1/event/trend-judgment', (req, res) => {
    res.json({
        code: 200,
        message: "【趋势研判】完成 (硬编码响应)",
        data: {
            evolution: "Framework -> Hardware optimization",
            milestones: { "2025": "Prototype" }
        }
    });
});

app.post('/api/v1/event/risk-opportunity', (req, res) => {
    res.json({
        code: 200,
        message: "【风险机遇挖掘】成功 (硬编码响应)",
        data: {
            opportunity: "High performance scheduling gap",
            risk: "Patent litigation risk",
            summary: "Opportunity outweighs risk."
        }
    });
});

// --- 科技产业链全景图 (子功能接口) ---
app.post('/api/v1/panorama/integration', (req, res) => {
    res.json({
        code: 200,
        message: "【多源数据整合】成功 (硬编码响应)",
        data: {
            scale: "10M+ Entities",
            sources: req.body.数据源范围 || "All",
            alignment_status: "98.5%"
        }
    });
});

app.post('/api/v1/panorama/segmentation', (req, res) => {
    res.json({
        code: 200,
        message: "【环节分层划分】完成 (硬编码响应)",
        data: {
            layers: ["Upstream", "Midstream", "Downstream"],
            model: "RoBERTa-Industry-v2.1"
        }
    });
});

app.post('/api/v1/panorama/modeling', (req, res) => {
    res.json({
        code: 200,
        message: "【图谱建模落地】成功 (硬编码响应)",
        data: {
            nodes: 125400,
            edges: 458200,
            db: "Neo4j-Cluster"
        }
    });
});

app.post('/api/v1/panorama/link-completion', (req, res) => {
    res.json({
        code: 200,
        message: "【关联体系完善】完成 (硬编码响应)",
        data: {
            added_links: 2100,
            status: "success"
        }
    });
});

app.post('/api/v1/panorama/render', (req, res) => {
    res.json({
        code: 200,
        message: "【全景呈现】渲染成功 (硬编码响应)",
        data: {
            engine: "AntV G6",
            layout: req.body.布局模式 || "Full-Chain"
        }
    });
});

app.post('/api/v1/panorama/annotation', (req, res) => {
    res.json({
        code: 200,
        message: "【关键信息标注】完成 (硬编码响应)",
        data: {
            annotations: ["Tech: GPU", "Ent: Leader-Corp"],
            index: "Elasticsearch"
        }
    });
});

app.post('/api/v1/panorama/flow', (req, res) => {
    res.json({
        code: 200,
        message: "【价值流向展示】成功 (硬编码响应)",
        data: {
            flows: ["Capital", "Talent", "Tech"],
            highlighted: "Core-Value-Chain"
        }
    });
});

app.post('/api/v1/panorama/interaction', (req, res) => {
    res.json({
        code: 200,
        message: "【交互操作】已适配 (硬编码响应)",
        data: {
            features: ["Drill-down", "Filter", "Focus"]
        }
    });
});

app.post('/api/v1/panorama/sync', (req, res) => {
    res.json({
        code: 200,
        message: "【同步更新】任务运行中 (硬编码响应)",
        data: {
            engine: "Flink-Stream",
            last_sync: new Date().toISOString()
        }
    });
});

app.post('/api/v1/panorama/log', (req, res) => {
    res.json({
        code: 200,
        message: "【日志查询】成功 (硬编码响应)",
        data: {
            version: req.body.回溯版本 || "VER_LATEST",
            log: "Bulk update from Patent DB"
        }
    });
});

app.post('/api/v1/panorama/config', (req, res) => {
    res.json({
        code: 200,
        message: "【自定义配置】已保存 (硬编码响应)",
        data: {
            config_id: "USER_001_PREF",
            status: "Persisted in Apollo"
        }
    });
});

// --- 科技单节点间接关系 (子功能接口) ---
app.post('/api/v1/indirect/node-position', (req, res) => {
    res.json({
        code: 200,
        message: "【核心节点定位】成功 (硬编码响应)",
        data: {
            scholar_id: "SCH_LI_8821",
            name: req.body.学者标识 || "李四",
            institution: req.body.机构校验 || "北京大学",
            confidence: 0.998
        }
    });
});

app.post('/api/v1/indirect/path-config', (req, res) => {
    res.json({
        code: 200,
        message: "【检索配置】已生效 (硬编码响应)",
        data: {
            depth: req.body.层级深度 || "2度",
            fields: req.body.权重依据 || "All",
            status: "synced"
        }
    });
});

app.post('/api/v1/indirect/potential-mine', (req, res) => {
    res.json({
        code: 200,
        message: "【潜在关联挖掘】完成 (硬编码响应)",
        data: {
            mined_total: 156,
            high_potential: 12,
            community: "AI-NLP-Group-B"
        }
    });
});

app.post('/api/v1/indirect/path-comb', (req, res) => {
    res.json({
        code: 200,
        message: "【传递路径梳理】成功 (硬编码响应)",
        data: {
            paths: 24,
            trajectory: "Li Si -> Zhou Qi -> Wang Wu",
            evidence: "PAT_2022_001"
        }
    });
});

app.post('/api/v1/indirect/reasoning-verify', (req, res) => {
    res.json({
        code: 200,
        message: "【推理校验】完成 (硬编码响应)",
        data: {
            valid_paths: 18,
            rejected_paths: 6,
            avg_score: 0.75
        }
    });
});

app.post('/api/v1/indirect/visual-adapt', (req, res) => {
    res.json({
        code: 200,
        message: "【可视化适配】成功 (硬编码响应)",
        data: {
            nodes: 35,
            edges: 52,
            version: "V_20240401_ADAPT"
        }
    });
});

app.post('/api/v1/indirect/strength-calc', (req, res) => {
    res.json({
        code: 200,
        message: "【强度计算】结论已生成 (硬编码响应)",
        data: {
            avg_strength: 0.72,
            model: "XGBoost-Regressor-v2"
        }
    });
});

app.post('/api/v1/indirect/type-tagging', (req, res) => {
    res.json({
        code: 200,
        message: "【类型标注】完成 (硬编码响应)",
        data: {
            tags: { "Paper": 12, "Project": 4 },
            confidence: 0.94
        }
    });
});

app.post('/api/v1/indirect/archive', (req, res) => {
    res.json({
        code: 200,
        message: "【结构化归档】已入库 (硬编码响应)",
        data: {
            archive_no: "ARC_IND_2024_0991",
            location: "MySQL: expert_indirect_archives"
        }
    });
});

// 3. 静态文件服务
app.use(express.static(__dirname));

// 4. 404 处理 (兜底)
app.use((req, res) => {
    console.log(`[404] ${req.method} ${req.url}`);
    res.status(404).json({
        code: 404,
        error: "Route Not Found",
        message: `您请求的 ${req.method} ${req.url} 不存在。`,
        hint: "请确保前端发送的路径与后端定义的完全一致。"
    });
});

app.listen(port, () => {
    console.log(`------------------------------------------------`);
    console.log(`亿级图谱后端服务启动成功: http://localhost:${port}`);
    console.log(`请确保使用 npm start 启动，并在浏览器打开该地址。`);
    console.log(`------------------------------------------------`);
});