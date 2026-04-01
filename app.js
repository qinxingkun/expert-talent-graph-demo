document.addEventListener('DOMContentLoaded', () => {
    const moduleContent = document.getElementById('module-content');
    const sidebarItems = document.querySelectorAll('.sidebar-nav li');
    const configModal = document.getElementById('config-modal');
    const closeBtns = document.querySelectorAll('.close-btn');

    // 模块通用模板生成器
    const createModule = (id, title, desc, tech, support, apiPath, params) => {
        const payload = Object.fromEntries(params.map(p => [p.name, p.default]));
        const payloadStr = JSON.stringify(payload, null, 4);
        
        return {
            id,
            title,
            desc,
            params,
            docs: `
                <div class="card">
                    <div class="card-title"><i class="fas fa-info-circle"></i> 功能描述</div>
                    <p>${tech}</p>
                </div>
                <div class="card">
                    <div class="card-title"><i class="fas fa-layer-group"></i> 算法支撑板块</div>
                    <ul>${support.map(s => `<li>${s}</li>`).join('')}</ul>
                </div>
                <div class="card">
                    <div class="card-title"><i class="fas fa-user-tie"></i> 服务对象</div>
                    <div style="display: flex; gap: 20px;">
                        <div style="flex: 1; padding: 15px; background: #f0fdf4; border-radius: 8px; border: 1px solid #bcf0da;">
                            <h4 style="color: #166534;"><i class="fas fa-code"></i> 系统开发人员</h4>
                            <p style="font-size: 0.85rem;">集成 API，构建图谱分析应用。</p>
                        </div>
                        <div style="flex: 1; padding: 15px; background: #fffbeb; border-radius: 8px; border: 1px solid #fde68a;">
                            <h4 style="color: #854d0e;"><i class="fas fa-tools"></i> 系统运维人员</h4>
                            <p style="font-size: 0.85rem;">监控调度任务，管理消歧模型参数。</p>
                        </div>
                    </div>
                </div>
            `,
            test: `
                <div class="card">
                    <div class="card-title"><i class="fas fa-flask"></i> 在线测试</div>
                    <div class="test-container">
                        <div class="input-panel">
                            <div style="margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center;">
                                <span style="font-weight: bold; color: #475569;">算法输入参数:</span>
                                <button class="btn-secondary btn-sm" id="open-config-btn"><i class="fas fa-cog"></i> 权重设置</button>
                            </div>
                            <div id="test-form-container" class="test-form">
                                <!-- 动态生成表单字段 -->
                            </div>
                            <button class="btn-accent" style="margin-top: 20px; width: 100%; font-weight: bold; height: 45px;" id="run-test" data-path="${apiPath}">
                                <i class="fas fa-play-circle"></i> 执行算法调用
                            </button>
                        </div>
                        <div class="output-panel">
                            <div style="margin-bottom: 10px; display: flex; justify-content: space-between;">
                                <span style="font-weight: bold; color: #475569;">引擎响应结果:</span>
                                <span id="test-status" class="status-badge ready">就绪</span>
                            </div>
                            <div class="result-panel" id="test-result" style="height: 480px;">// 等待调用...</div>
                        </div>
                    </div>
                </div>
            `,
            api: {
                python: `import requests\n\nurl = "http://localhost:3001${apiPath}"\npayload = ${payloadStr}\nheaders = {"Content-Type": "application/json"}\n\nresponse = requests.post(url, json=payload, headers=headers)\nprint(response.json())`,
                nodejs: `const axios = require('axios');\n\nconst url = "http://localhost:3001${apiPath}";\nconst payload = ${payloadStr};\n\naxios.post(url, payload)\n  .then(res => console.log(res.data))\n  .catch(err => console.error(err));`,
                curl: `curl -X POST "http://localhost:3001${apiPath}" \\\n     -H "Content-Type: application/json" \\\n     -d '${JSON.stringify(payload)}'`
            }
        };
    };

    const modules = {
        'expert-relation': {
            id: 'expert-relation',
            title: '科技专家/人才直接关系',
            desc: '基于文献、专利、项目等多元数据的专家合作关系识别、特征画像与可视化交互系统。',
            docs: `
                <div class="card">
                    <div class="card-title"><i class="fas fa-info-circle"></i> 功能描述</div>
                    <p>通过配置中心统一管理多源接口与采集规则，采用基于 Transformer 的实体对齐模型对学者、机构等关键字段进行消歧与标准化。系统结合规则引擎完成字段映射与清洗，将实体节点写入图数据库，并利用预训练模型将文本向量化后存入向量数据库，支撑深度的专家发现与多维可视化分析。</p>
                </div>
                <div class="card">
                    <div class="card-title"><i class="fas fa-layer-group"></i> 系统子功能模块</div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                        <div class="sub-func-item"><strong>1. 直接关系识别构建</strong><br>包含多源采集、Transformer对齐、规则映射及向量化处理。</div>
                        <div class="sub-func-item"><strong>2. 专家特征与成果展示</strong><br>提供多维画像呈现、成果悬浮预览及关联成果深度钻取。</div>
                        <div class="sub-func-item"><strong>3. 交互与可视化分析</strong><br>支持层级动态钻取、关系灵活过滤及自定义样式展示。</div>
                    </div>
                </div>
            `,
            test: `
                <div class="card">
                    <div class="card-title"><i class="fas fa-flask"></i> 算法测试 (子功能选择)</div>
                    <div class="test-container">
                        <div class="input-panel">
                            <div class="form-group">
                                <label>选择子功能模块</label>
                                <select id="sub-func-selector" style="margin-bottom: 15px; border: 2px solid var(--secondary-color);">
                                    <optgroup label="1. 直接关系识别构建">
                                        <option value="expert-collect">1.1 数据采集与调度任务</option>
                                        <option value="expert-align">1.2 基于Transformer的实体对齐</option>
                                        <option value="expert-map">1.3 规则引擎关系映射与清洗</option>
                                        <option value="expert-vector">1.4 文本向量化处理与入库</option>
                                    </optgroup>
                                    <optgroup label="2. 专家特征与成果展示">
                                        <option value="expert-profile">2.1 专家画像多维呈现</option>
                                        <option value="expert-hover">2.2 成果详情悬浮查看</option>
                                        <option value="expert-drilldown">2.3 关联成果深度钻取</option>
                                    </optgroup>
                                    <optgroup label="3. 交互与可视化分析">
                                        <option value="expert-graph-drilldown">3.1 图谱层级钻取与展示</option>
                                        <option value="expert-filter">3.2 关系过滤与条件聚焦</option>
                                        <option value="expert-style">3.3 可视化样式自定义</option>
                                    </optgroup>
                                </select>
                            </div>
                            <div id="test-form-container" class="test-form">
                                <!-- 动态生成子功能表单 -->
                            </div>
                            <button class="btn-accent" style="margin-top: 20px; width: 100%; font-weight: bold; height: 45px;" id="run-test">
                                <i class="fas fa-play-circle"></i> 执行子功能测试
                            </button>
                        </div>
                        <div class="output-panel">
                            <div style="margin-bottom: 10px; display: flex; justify-content: space-between;">
                                <span style="font-weight: bold; color: #475569;">子模块处理结果:</span>
                                <span id="test-status" class="status-badge ready">就绪</span>
                            </div>
                            <div class="result-panel" id="test-result" style="height: 380px;">// 选择子功能并执行测试...</div>
                        </div>
                    </div>
                </div>
            `,
            api: {
                python: "# 参见各子模块调用示例",
                nodejs: "// 参见各子模块调用示例",
                curl: "# 参见各子模块调用示例"
            },
            subFunctions: {
                'expert-collect': {
                    path: '/api/v1/expert/collect',
                    params: [
                        { name: 'source_config', label: '采集源配置', type: 'select', options: ['Combined-Paper-Patent', 'WOS-Only', 'CNKI-Only'], default: 'Combined-Paper-Patent', desc: '中外论文、专利、基金接口管理' },
                        { name: 'rule_id', label: '采集规则ID', type: 'text', default: 'RULE_EXTRACT_V1', desc: '配置中心预设的抓取逻辑' },
                        { name: 'sync_mode', label: '采集模式', type: 'select', options: ['全量同步', '增量更新'], default: '增量更新', desc: 'DolphinScheduler 自动化调度模式' }
                    ]
                },
                'expert-align': {
                    path: '/api/v1/expert/align',
                    params: [
                        { name: 'scholar_name', label: '原始学者姓名', type: 'text', default: '张三', desc: '待消歧的姓名原始文本' },
                        { name: 'raw_inst', label: '所属机构文本', type: 'text', default: '清华大学', desc: '待标准化的机构名称' },
                        { name: 'align_model', label: '对齐模型', type: 'select', options: ['BERT-Dual-Tower-v2', 'RoBERTa-Align-v1.5'], default: 'BERT-Dual-Tower-v2', desc: '基于 Transformer 的语义消歧模型' }
                    ]
                },
                'expert-map': {
                    path: '/api/v1/expert/map',
                    params: [
                        { name: 'clean_engine', label: '清洗引擎', type: 'select', options: ['Regex+EditDistance', 'ML-Cleaner'], default: 'Regex+EditDistance', desc: '字段映射与格式错误清洗逻辑' },
                        { name: 'target_db', label: '目标图数据库', type: 'select', options: ['Neo4j-Cluster-Main', 'Neo4j-Backup'], default: 'Neo4j-Cluster-Main', desc: '关系边写入的目标实例' }
                    ]
                },
                'expert-vector': {
                    path: '/api/v1/expert/vectorize',
                    params: [
                        { name: 'text_input', label: '待向量化文本', type: 'text', default: '大规模图谱构建及其在专家发现中的应用', desc: '标题或摘要文本' },
                        { name: 'vec_dim', label: '向量维度', type: 'select', options: [768, 1024, 128], default: 768, desc: 'Transformer 提取的特征向量长度' },
                        { name: 'vector_db', label: '向量数据库', type: 'select', options: ['Milvus-Cluster', 'Pinecone-Service'], default: 'Milvus-Cluster', desc: '构建高性能语义索引' }
                    ]
                },
                'expert-profile': {
                    path: '/api/v1/expert/profile',
                    params: [
                        { name: 'scholar_id', label: '学者ID', type: 'text', default: 'SCH_ZHANG_8872', desc: '用于多维画像呈现的唯一标识' },
                        { name: 'render_spec', label: '渲染规范', type: 'select', options: ['AntV-G6-Standard', 'ECharts-Radar'], default: 'AntV-G6-Standard', desc: '生成专家特征报文格式' }
                    ]
                },
                'expert-hover': {
                    path: '/api/v1/expert/hover',
                    params: [
                        { name: 'result_id', label: '成果唯一标识', type: 'text', default: 'RES_PAT_2024_001', desc: '悬浮查看的成果 ID' },
                        { name: 'meta_fields', label: '显示字段', type: 'select', options: ['全量元数据', '精简摘要'], default: '全量元数据', desc: '异步请求详情包含的字段' }
                    ]
                },
                'expert-drilldown': {
                    path: '/api/v1/expert/drilldown',
                    params: [
                        { name: 'result_id', label: '成果节点ID', type: 'text', default: 'RES_PAPER_9921', desc: '下钻查询成果关联网络' },
                        { name: 'contribution_model', label: '贡献度模型', type: 'select', options: ['署名序位模型', '等权重模型'], default: '署名序位模型', desc: '量化专家的产出贡献比' }
                    ]
                },
                'expert-graph-drilldown': {
                    path: '/api/v1/expert/graph-drilldown',
                    params: [
                        { name: 'center_node', label: '中心专家节点', type: 'text', default: 'SCH_ZHANG_8872', desc: '层级钻取的起始节点' },
                        { name: 'drill_depth', label: '钻取深度', type: 'range', min: 1, max: 3, step: 1, default: 2, desc: '动态加载合作者及关联节点跳数' }
                    ]
                },
                'expert-filter': {
                    path: '/api/v1/expert/filter',
                    params: [
                        { name: 'year_range', label: '年份范围', type: 'text', default: '2015-2024', desc: '关系过滤的时间区间' },
                        { name: 'min_coop_count', label: '最小合作频次', type: 'number', default: 2, desc: '根据共同成果数进行条件聚焦' },
                        { name: 'res_type', label: '成果类型过滤', type: 'select', options: ['全部', '论文', '专利', '基金'], default: '全部', desc: '按类型筛选图谱子集' }
                    ]
                },
                'expert-style': {
                    path: '/api/v1/expert/style',
                    params: [
                        { name: 'style_template', label: '样式模板', type: 'select', options: ['学术影响力视角', '企业合作背景', '默认科技蓝'], default: '学术影响力视角', desc: '自定义节点/连线样式' },
                        { name: 'save_view', label: '保存视图视角', type: 'select', options: ['True', 'False'], default: 'True', desc: '是否持久化当前视图布局参数' }
                    ]
                }
            }
        },
        'indirect-relation': {
            id: 'indirect-relation',
            title: '科技单节点间接关系',
            desc: '深度挖掘专家间的隐性联系、学术传递路径与关联强度评估系统。',
            docs: `
                <div class="card">
                    <div class="card-title"><i class="fas fa-info-circle"></i> 功能描述</div>
                    <p>系统以核心节点为锚点，利用 Neo4j 图数据库执行多度路径遍历与 Louvain 社区发现算法，精准挖掘潜在间接关联。通过基于随机森林的推理校验模型剔除无效路径，并结合 XGBoost 回归模型量化计算包含路径长度衰减、成果共现在内的综合关联强度。最终实现间接关系的自动化标注与结构化归档，支撑复杂的人才网络分析。</p>
                </div>
                <div class="card">
                    <div class="card-title"><i class="fas fa-layer-group"></i> 系统子功能模块</div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                        <div class="sub-func-item"><strong>1. 间接关系挖掘</strong><br>包含核心节点定位、多度路径配置及潜在关联节点挖掘。</div>
                        <div class="sub-func-item"><strong>2. 关系路径分析与推理</strong><br>全量梳理传递路径、执行推理校验并适配可视化数据。</div>
                        <div class="sub-func-item"><strong>3. 关联强度与标注归档</strong><br>多维度强度计算、关系类型自动标注及结构化归档。</div>
                    </div>
                </div>
            `,
            test: `
                <div class="card">
                    <div class="card-title"><i class="fas fa-flask"></i> 算法测试 (子功能选择)</div>
                    <div class="test-container">
                        <div class="input-panel">
                            <div class="form-group">
                                <label>选择子功能模块</label>
                                <select id="sub-func-selector" style="margin-bottom: 15px; border: 2px solid var(--secondary-color);">
                                    <optgroup label="1. 间接关系挖掘">
                                        <option value="ind-node-position">1.1 核心节点精准定位</option>
                                        <option value="ind-path-config">1.2 多度路径检索配置</option>
                                        <option value="ind-potential-mine">1.3 潜在关联节点挖掘</option>
                                    </optgroup>
                                    <optgroup label="2. 关系路径分析与推理">
                                        <option value="ind-path-comb">2.1 传递路径全量梳理</option>
                                        <option value="ind-reasoning-verify">2.2 关系传递推理校验</option>
                                        <option value="ind-visual-adapt">2.3 可视化数据适配</option>
                                    </optgroup>
                                    <optgroup label="3. 关联强度与标注归档">
                                        <option value="ind-strength-calc">3.1 关联强度多维度计算</option>
                                        <option value="ind-type-tagging">3.2 间接关系类型标注</option>
                                        <option value="ind-archive">3.3 结果结构化归档</option>
                                    </optgroup>
                                </select>
                            </div>
                            <div id="test-form-container" class="test-form">
                                <!-- 动态生成子功能表单 -->
                            </div>
                            <button class="btn-accent" style="margin-top: 20px; width: 100%; font-weight: bold; height: 45px;" id="run-test">
                                <i class="fas fa-play-circle"></i> 执行子功能测试
                            </button>
                        </div>
                        <div class="output-panel">
                            <div style="margin-bottom: 10px; display: flex; justify-content: space-between;">
                                <span style="font-weight: bold; color: #475569;">子模块处理结果:</span>
                                <span id="test-status" class="status-badge ready">就绪</span>
                            </div>
                            <div class="result-panel" id="test-result" style="height: 380px;">// 选择子功能并执行测试...</div>
                        </div>
                    </div>
                </div>
            `,
            api: {
                python: "# 参见各子模块调用示例",
                nodejs: "// 参见各子模块调用示例",
                curl: "# 参见各子模块调用示例"
            },
            subFunctions: {
                'ind-node-position': {
                    path: '/api/v1/indirect/node-position',
                    params: [
                        { name: '学者标识', label: '学者ID/姓名', type: 'text', default: '李四', desc: '用于定位核心锚点' },
                        { name: '机构校验', label: '所属机构', type: 'text', default: '北京大学', desc: '辅助身份对齐' },
                        { name: '消歧模型', label: 'BERT消歧开关', type: 'select', options: ['开启', '关闭'], default: '开启', desc: '确保千万级节点下唯一性' }
                    ]
                },
                'ind-path-config': {
                    path: '/api/v1/indirect/path-config',
                    params: [
                        { name: '层级深度', label: '路径层级配置', type: 'select', options: ['1度', '2度', '3度及以上'], default: '2度', desc: '定义图遍历搜索深度' },
                        { name: '权重依据', label: '权重依据字段', type: 'select', options: ['论文/专利/基金', '仅论文', '仅专利'], default: '论文/专利/基金', desc: '路径检索体系支撑字段' }
                    ]
                },
                'ind-potential-mine': {
                    path: '/api/v1/indirect/potential-mine',
                    params: [
                        { name: '聚类算法', label: '节点挖掘算法', type: 'select', options: ['Louvain-Community', 'Label-Propagation'], default: 'Louvain-Community', desc: '用于挖掘高潜潜在关联' },
                        { name: '过滤频次', label: '共现频次阈值', type: 'number', default: 2, desc: '筛选潜在关联节点的频次要求' }
                    ]
                },
                'ind-path-comb': {
                    path: '/api/v1/indirect/path-comb',
                    params: [
                        { name: '路径ID', label: '间接关系路径ID', type: 'text', default: 'PATH_IND_882', desc: '待梳理的轨迹标识' },
                        { name: '依据标注', label: '成果ID标注', type: 'select', options: ['DOI/专利号', '简要标题'], default: 'DOI/专利号', desc: '生成标准路径清单的依据' }
                    ]
                },
                'ind-reasoning-verify': {
                    path: '/api/v1/indirect/reasoning-verify',
                    params: [
                        { name: '校验模型', label: '推理校验算法', type: 'select', options: ['Random-Forest-v2', 'Rule-Base'], default: 'Random-Forest-v2', desc: '评估路径合理性评分' },
                        { name: '阈值', label: '有效路径阈值', type: 'range', min: 0.1, max: 1.0, step: 0.1, default: 0.6, desc: '低于该分数的路径将被剔除' }
                    ]
                },
                'ind-visual-adapt': {
                    path: '/api/v1/indirect/visual-adapt',
                    params: [
                        { name: '适配组件', label: '可视化组件适配', type: 'select', options: ['AntV-G6', 'ECharts-Graph'], default: 'AntV-G6', desc: '转换输出标准化JSON结构' }
                    ]
                },
                'ind-strength-calc': {
                    path: '/api/v1/indirect/strength-calc',
                    params: [
                        { name: '衰减系数', label: '路径长度衰减', type: 'range', min: 0.1, max: 1.0, step: 0.1, default: 0.8, desc: '随跳数增加的强度折扣' },
                        { name: '强度模型', label: '计算评分模型', type: 'select', options: ['XGBoost-Regressor', 'Linear-Weighted'], default: 'XGBoost-Regressor', desc: '多维度归一化强度评分' }
                    ]
                },
                'ind-type-tagging': {
                    path: '/api/v1/indirect/type-tagging',
                    params: [
                        { name: '标注模型', label: '关系分类模型', type: 'select', options: ['RoBERTa-Text-Classify', 'Rule-Match'], default: 'RoBERTa-Text-Classify', desc: '自动标注间接关系类型' }
                    ]
                },
                'ind-archive': {
                    path: '/api/v1/indirect/archive',
                    params: [
                        { name: '存档模式', label: '结构化归档模式', type: 'select', options: ['全量追溯档案', '精简关系记录'], default: '全量追溯档案', desc: '包含节点、路径、强度及成果ID' }
                    ]
                }
            }
        },
        'coop-results': {
            id: 'coop-results',
            title: '科技两点合作成果',
            desc: '精准提取并多维分析两位专家间的协同产出、贡献分布与合作模式评估系统。',
            docs: `
                <div class="card">
                    <div class="card-title"><i class="fas fa-info-circle"></i> 功能描述</div>
                    <p>系统通过双专家精准定位锚点，利用 Neo4j 图数据库执行共同关联成果的毫秒级检索，并结合 Milvus 向量数据库进行语义相似召回，确保合作成果全量覆盖。通过基于 RoBERTa 的多标签分类模型自动标注缺失领域，并利用作者署名权重模型量化每位专家的贡献度。最终通过时间序列聚类算法识别合作模式，并输出包含量化评分与价值分级的综合评估报告。</p>
                </div>
                <div class="card">
                    <div class="card-title"><i class="fas fa-layer-group"></i> 系统子功能模块</div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                        <div class="sub-func-item"><strong>1. 合作成果提取与汇总</strong><br>包含双专家定位、多源关联检索及成果批量汇总。</div>
                        <div class="sub-func-item"><strong>2. 成果多维统计与分析</strong><br>提供多维分类统计、关键信息提取及属性精准标注。</div>
                        <div class="sub-func-item"><strong>3. 合作贡献与模式分析</strong><br>涵盖贡献精准分析、模式分类识别及价值综合评估。</div>
                    </div>
                </div>
            `,
            test: `
                <div class="card">
                    <div class="card-title"><i class="fas fa-flask"></i> 算法测试 (子功能选择)</div>
                    <div class="test-container">
                        <div class="input-panel">
                            <div class="form-group">
                                <label>选择子功能模块</label>
                                <select id="sub-func-selector" style="margin-bottom: 15px; border: 2px solid var(--secondary-color);">
                                    <optgroup label="1. 合作成果提取与汇总">
                                        <option value="coop-expert-pos">1.1 双专家精准定位</option>
                                        <option value="coop-multi-search">1.2 多源成果关联检索</option>
                                        <option value="coop-batch-summary">1.3 合作成果批量汇总</option>
                                    </optgroup>
                                    <optgroup label="2. 成果多维统计与分析">
                                        <option value="coop-multi-stats">2.1 成果多维分类统计</option>
                                        <option value="coop-info-extract">2.2 成果关键信息提取</option>
                                        <option value="coop-attr-tagging">2.3 成果属性精准标注</option>
                                    </optgroup>
                                    <optgroup label="3. 合作贡献与模式分析">
                                        <option value="coop-contrib-analysis">3.1 合作贡献精准分析</option>
                                        <option value="coop-mode-id">3.2 合作模式分类识别</option>
                                        <option value="coop-value-eval">3.3 合作深度与价值评估</option>
                                    </optgroup>
                                </select>
                            </div>
                            <div id="test-form-container" class="test-form">
                                <!-- 动态生成子功能表单 -->
                            </div>
                            <button class="btn-accent" style="margin-top: 20px; width: 100%; font-weight: bold; height: 45px;" id="run-test">
                                <i class="fas fa-play-circle"></i> 执行子功能测试
                            </button>
                        </div>
                        <div class="output-panel">
                            <div style="margin-bottom: 10px; display: flex; justify-content: space-between;">
                                <span style="font-weight: bold; color: #475569;">子模块处理结果:</span>
                                <span id="test-status" class="status-badge ready">就绪</span>
                            </div>
                            <div class="result-panel" id="test-result" style="height: 380px;">// 选择子功能并执行测试...</div>
                        </div>
                    </div>
                </div>
            `,
            api: {
                python: "# 参见各子模块调用示例",
                nodejs: "// 参见各子模块调用示例",
                curl: "# 参见各子模块调用示例"
            },
            subFunctions: {
                'coop-expert-pos': {
                    path: '/api/v1/coop/expert-pos',
                    params: [
                        { name: '专家A标识', label: '专家A姓名/ID', type: 'text', default: '张三', desc: '第一位专家锚点' },
                        { name: '专家B标识', label: '专家B姓名/ID', type: 'text', default: '李四', desc: '第二位专家锚点' },
                        { name: '校验模式', label: '身份二次校验', type: 'select', options: ['BERT-消歧模型', '机构/领域匹配'], default: 'BERT-消歧模型', desc: '确保千万级节点下精准定位' }
                    ]
                },
                'coop-multi-search': {
                    path: '/api/v1/coop/multi-search',
                    params: [
                        { name: '图检索深度', label: 'Neo4j 检索跳数', type: 'number', default: 2, desc: '共同关联成果的路径跳数' },
                        { name: '向量召回', label: 'Milvus 语义召回', type: 'select', options: ['开启', '关闭'], default: '开启', desc: '补充显式关联遗漏的合作成果' }
                    ]
                },
                'coop-batch-summary': {
                    path: '/api/v1/coop/batch-summary',
                    params: [
                        { name: '去重引擎', label: '去重规则配置', type: 'select', options: ['规则引擎+编辑距离', '完全匹配'], default: '规则引擎+编辑距离', desc: '整合同一成果的多源记录' }
                    ]
                },
                'coop-multi-stats': {
                    path: '/api/v1/coop/multi-stats',
                    params: [
                        { name: '统计维度', label: '分组统计维度', type: 'select', options: ['类型/领域/年份', '仅类型', '仅年份'], default: '类型/领域/年份', desc: '生成量化分布结果' },
                        { name: '自动标注', label: 'RoBERTa 领域标注', type: 'select', options: ['开启', '关闭'], default: '开启', desc: '自动补全缺失的技术领域标签' }
                    ]
                },
                'coop-info-extract': {
                    path: '/api/v1/coop/info-extract',
                    params: [
                        { name: '提取模型', label: '关键信息提取模型', type: 'select', options: ['NER+LLM', '正则提取'], default: 'NER+LLM', desc: '提取期刊、周期、奖项等元数据' }
                    ]
                },
                'coop-attr-tagging': {
                    path: '/api/v1/coop/attr-tagging',
                    params: [
                        { name: '属性范围', label: '标注属性范围', type: 'select', options: ['年份/领域/奖项', '仅年份', '仅奖项'], default: '年份/领域/奖项', desc: '形成以专家对为维度的可追溯档案' }
                    ]
                },
                'coop-contrib-analysis': {
                    path: '/api/v1/coop/contrib-analysis',
                    params: [
                        { name: '贡献模型', label: '权重分配模型', type: 'select', options: ['署名序位模型', 'BERT角色识别'], default: '署名序位模型', desc: '量化专家在合作中的产出贡献' }
                    ]
                },
                'coop-mode-id': {
                    path: '/api/v1/coop/mode-id',
                    params: [
                        { name: '识别算法', label: '模式聚类算法', type: 'select', options: ['K-means+DTW', '决策树分类'], default: 'K-means+DTW', desc: '识别长期稳定/短期项目等合作模式' }
                    ]
                },
                'coop-value-eval': {
                    path: '/api/v1/coop/value-eval',
                    params: [
                        { name: '评估模型', label: '综合评估模型', type: 'select', options: ['XGBoost-Regressor', '加权评分'], default: 'XGBoost-Regressor', desc: '输出包含量化评分与等级的报告' }
                    ]
                }
            }
        },
        'colleague-relation': {
            id: 'colleague-relation',
            title: '科技专家同事关系',
            desc: '基于工作经历的专家职场网络构建、协作时段精准判定与共事成果关联系统。',
            docs: `
                <div class="card">
                    <div class="card-title"><i class="fas fa-info-circle"></i> 功能描述</div>
                    <p>系统通过分布式调度框架采集并整合千万级学者任职数据，利用模糊匹配与地理编码服务实现机构标准化与地域背景补充。基于时间重叠匹配算法智能推理同一机构交集时段内的同事关系，并精准核算关系生效与截止时间。系统进一步挖掘共事团队与部门背景，并在同事时段内精准检索并校验协作成果，构建结构化的职场协作图谱。</p>
                </div>
                <div class="card">
                    <div class="card-title"><i class="fas fa-layer-group"></i> 系统子功能模块</div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                        <div class="sub-func-item"><strong>1. 同事关系推理构建</strong><br>包含经历数据整合、任职信息标准化及关系智能推理。</div>
                        <div class="sub-func-item"><strong>2. 关系时段与背景判定</strong><br>包含时段精准核算、背景深度挖掘及结构化标注归档。</div>
                        <div class="sub-func-item"><strong>3. 同事期间协作关联</strong><br>包含协作成果检索、匹配身份校验及联动展示适配。</div>
                    </div>
                </div>
            `,
            test: `
                <div class="card">
                    <div class="card-title"><i class="fas fa-flask"></i> 算法测试 (子功能选择)</div>
                    <div class="test-container">
                        <div class="input-panel">
                            <div class="form-group">
                                <label>选择子功能模块</label>
                                <select id="sub-func-selector" style="margin-bottom: 15px; border: 2px solid var(--secondary-color);">
                                    <optgroup label="1. 同事关系推理构建">
                                        <option value="col-data-integration">1.1 工作经历数据整合</option>
                                        <option value="col-standardization">1.2 任职信息标准化处理</option>
                                        <option value="col-smart-reasoning">1.3 同事关系智能推理构建</option>
                                    </optgroup>
                                    <optgroup label="2. 关系时段与背景判定">
                                        <option value="col-period-calc">2.1 同事关系时段核算</option>
                                        <option value="col-bg-mining">2.2 任职背景挖掘</option>
                                        <option value="col-archive">2.3 关系背景标注归档</option>
                                    </optgroup>
                                    <optgroup label="3. 同事期间协作关联">
                                        <option value="col-result-search">3.1 协作成果精准检索</option>
                                        <option value="col-match-verify">3.2 成果关联匹配校验</option>
                                        <option value="col-visual-adapt">3.3 协作成果联动展示适配</option>
                                    </optgroup>
                                </select>
                            </div>
                            <div id="test-form-container" class="test-form">
                                <!-- 动态生成子功能表单 -->
                            </div>
                            <button class="btn-accent" style="margin-top: 20px; width: 100%; font-weight: bold; height: 45px;" id="run-test">
                                <i class="fas fa-play-circle"></i> 执行子功能测试
                            </button>
                        </div>
                        <div class="output-panel">
                            <div style="margin-bottom: 10px; display: flex; justify-content: space-between;">
                                <span style="font-weight: bold; color: #475569;">子模块处理结果:</span>
                                <span id="test-status" class="status-badge ready">就绪</span>
                            </div>
                            <div class="result-panel" id="test-result" style="height: 380px;">// 选择子功能并执行测试...</div>
                        </div>
                    </div>
                </div>
            `,
            api: {
                python: "# 参见各子模块调用示例",
                nodejs: "// 参见各子模块调用示例",
                curl: "# 参见各子模块调用示例"
            },
            subFunctions: {
                'col-data-integration': {
                    path: '/api/v1/colleague/data-integration',
                    params: [
                        { name: '采集源', label: '任职数据源', type: 'select', options: ['中外论文+专利+公开简历', '仅论文', '仅专利'], default: '中外论文+专利+公开简历', desc: '分布式采集的学者任职信息来源' },
                        { name: '清洗引擎', label: '清洗规则开关', type: 'select', options: ['开启', '关闭'], default: '开启', desc: '自动修复时间格式与缺失字段' }
                    ]
                },
                'col-standardization': {
                    path: '/api/v1/colleague/standardization',
                    params: [
                        { name: '机构名称', label: '原始机构文本', type: 'text', default: '清华计算机系', desc: '待对齐的原始机构描述' },
                        { name: '地域补全', label: '地理编码服务', type: 'select', options: ['开启', '关闭'], default: '开启', desc: '自动补充省份、城市等背景信息' }
                    ]
                },
                'col-smart-reasoning': {
                    path: '/api/v1/colleague/smart-reasoning',
                    params: [
                        { name: '匹配算法', label: '关系推理算法', type: 'select', options: ['时间重叠匹配', '规则引擎'], default: '时间重叠匹配', desc: '筛选同一机构交集时段内的学者对' },
                        { name: '并行规模', label: '分布式并发数', type: 'number', default: 16, desc: '图数据库并行计算节点数' }
                    ]
                },
                'col-period-calc': {
                    path: '/api/v1/colleague/period-calc',
                    params: [
                        { name: '学者A时段', label: '学者A任职区间', type: 'text', default: '2010-01 至 2018-12', desc: '格式: YYYY-MM' },
                        { name: '学者B时段', label: '学者B任职区间', type: 'text', default: '2015-06 至 2022-05', desc: '格式: YYYY-MM' }
                    ]
                },
                'col-bg-mining': {
                    path: '/api/v1/colleague/bg-mining',
                    params: [
                        { name: '挖掘深度', label: '背景挖掘范围', type: 'select', options: ['部门+团队+地域', '仅部门', '仅地域'], default: '部门+团队+地域', desc: '利用NER模型从描述中抽取背景' }
                    ]
                },
                'col-archive': {
                    path: '/api/v1/colleague/archive',
                    params: [
                        { name: '档案版本', label: '生成快照版本', type: 'select', options: ['开启', '关闭'], default: '开启', desc: '定期生成档案版本用于历史追溯' }
                    ]
                },
                'col-result-search': {
                    path: '/api/v1/colleague/result-search',
                    params: [
                        { name: '成果类型', label: '检索成果范围', type: 'select', options: ['论文+专利', '仅论文', '仅专利'], default: '论文+专利', desc: '检索同事时段内的共同产出' },
                        { name: '检索引擎', label: '全文检索加速', type: 'select', options: ['Elasticsearch', 'None'], default: 'Elasticsearch', desc: '提升海量成果下的匹配速度' }
                    ]
                },
                'col-match-verify': {
                    path: '/api/v1/colleague/match-verify',
                    params: [
                        { name: '消歧模型', label: 'BERT消歧算法', type: 'select', options: ['BERT-Base', 'RoBERTa-Large'], default: 'BERT-Base', desc: '排除同名歧义，校验作者身份' }
                    ]
                },
                'col-visual-adapt': {
                    path: '/api/v1/colleague/visual-adapt',
                    params: [
                        { name: '适配模式', label: '可视化组件', type: 'select', options: ['图谱联动+时间轴', '仅图谱', '仅列表'], default: '图谱联动+时间轴', desc: '输出适配前端的标准化JSON' }
                    ]
                }
            }
        },
        'alumni-relation': {
            id: 'alumni-relation',
            title: '科技专家校友关系',
            desc: '基于教育经历的学术传承网络构建与校友深度互动关联。',
            docs: `
                <div class="card">
                    <div class="card-title"><i class="fas fa-info-circle"></i> 功能描述</div>
                    <p>通过 DolphinScheduler 调度多源采集任务，利用基于 BERT 的实体对齐模型结合编辑距离算法标准化院校名称，并调用高德地图 API 补充地域信息。系统通过 Apollo 配置中心预设规则，精细化拆分"校友"与"院友"关系，并在教育时段内关联共同署名的论文、专利及基金项目，构建结构化的学术传承图谱。</p>
                </div>
                <div class="card">
                    <div class="card-title"><i class="fas fa-layer-group"></i> 系统子功能模块</div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                        <div class="sub-func-item"><strong>【校友关系识别构建】</strong><br>1. 教育经历数据整合 - 批量采集千万级数据，清洗去重并补充地域信息<br>2. 校友关系智能识别构建 - 院校/时间匹配算法，识别同一院校交集时段校友</div>
                        <div class="sub-func-item"><strong>【关系细分与维度记录】</strong><br>3. 校友关系精准细分 - 区分校友/院友，支持教育阶段细分<br>4. 细分规则配置优化 - 预设规则，灵活调整适配不同院校<br>5. 核心维度信息记录 - 记录双方ID、院校院系、入学年份等</div>
                        <div class="sub-func-item"><strong>【校友互动关联】</strong><br>6. 学术互动信息检索 - 检索共同论文/专利/基金项目<br>7. 职业互动信息挖掘 - 挖掘共同任职/创业等职业互动<br>8. 互动与合作信息联动展示适配 - 整合关系与互动数据输出标准化数据</div>
                    </div>
                </div>
            `,
            test: `
                <div class="card">
                    <div class="card-title"><i class="fas fa-flask"></i> 算法测试 (子功能选择)</div>
                    <div class="test-container">
                        <div class="input-panel">
                            <div class="form-group">
                                <label>选择子功能模块</label>
                                <select id="sub-func-selector" style="margin-bottom: 15px; border: 2px solid var(--secondary-color);">
                                    <optgroup label="【校友关系识别构建】">
                                        <option value="alumni-data-integration">1. 教育经历数据整合</option>
                                        <option value="alumni-smart-build">2. 校友关系智能识别构建</option>
                                    </optgroup>
                                    <optgroup label="【关系细分与维度记录】">
                                        <option value="alumni-precise-classify">3. 校友关系精准细分</option>
                                        <option value="alumni-rule-config">4. 细分规则配置优化</option>
                                        <option value="alumni-dimension-record">5. 核心维度信息记录</option>
                                    </optgroup>
                                    <optgroup label="【校友互动关联】">
                                        <option value="alumni-academic-interact">6. 学术互动信息检索</option>
                                        <option value="alumni-career-interact">7. 职业互动信息挖掘</option>
                                        <option value="alumni-visual-adapt">8. 互动与合作信息联动展示适配</option>
                                    </optgroup>
                                </select>
                            </div>
                            <div id="test-form-container" class="test-form">
                            </div>
                            <button class="btn-accent" style="margin-top: 20px; width: 100%; font-weight: bold; height: 45px;" id="run-test">
                                <i class="fas fa-play-circle"></i> 执行子功能测试
                            </button>
                        </div>
                        <div class="output-panel">
                            <div style="margin-bottom: 10px; display: flex; justify-content: space-between;">
                                <span style="font-weight: bold; color: #475569;">子模块处理结果:</span>
                                <span id="test-status" class="status-badge ready">就绪</span>
                            </div>
                            <div class="result-panel" id="test-result" style="height: 380px;">// 选择子功能并执行测试...</div>
                        </div>
                    </div>
                </div>
            `,
            api: {
                python: "# 参见各子模块调用示例",
                nodejs: "// 参见各子模块调用示例",
                curl: "# 参见各子模块调用示例"
            },
            subFunctions: {
                'alumni-data-integration': {
                    path: '/api/v1/alumni/data-integration',
                    params: [
                        { name: '数据源选择', label: '数据源选择', type: 'select', options: ['中外论文库', '专利数据库', '公开简历源', '全部'], default: '全部', desc: '选择需要整合的教育经历数据来源' },
                        { name: '清洗引擎', label: '清洗引擎状态', type: 'select', options: ['已开启', '已关闭'], default: '已开启', desc: '是否启用数据清洗去重引擎' },
                        { name: '地域补全', label: '高德地图API补全', type: 'select', options: ['开启', '关闭'], default: '开启', desc: '自动补充省份、城市、经纬度信息' }
                    ]
                },
                'alumni-smart-build': {
                    path: '/api/v1/alumni/smart-build',
                    params: [
                        { name: '院校范围', label: '目标院校范围', type: 'text', default: '清华大学,北京大学,浙江大学', desc: '限定校友关系识别的院校范围' },
                        { name: '时间跨度', label: '教育时段范围', type: 'text', default: '2000-2024', desc: '限定入学与毕业时段范围' },
                        { name: '匹配粒度', label: '匹配粒度', type: 'select', options: ['院校级', '院系级'], default: '院系级', desc: '校友关系识别的精细程度' }
                    ]
                },
                'alumni-precise-classify': {
                    path: '/api/v1/alumni/precise-classify',
                    params: [
                        { name: '学者A教育经历', label: '学者A学位院系', type: 'text', default: '博士 / 计算机科学技术系 / 清华大学', desc: '示例：学历 / 院系名称 / 院校名称' },
                        { name: '学者B教育经历', label: '学者B学位院系', type: 'text', default: '硕士 / 计算机科学技术系 / 清华大学', desc: '示例：学历 / 院系名称 / 院校名称' },
                        { name: '分类规则', label: 'Apollo配置规则', type: 'text', default: 'ALUMNI_TYPE_DECISION_TREE', desc: '预设的关系细分逻辑ID' }
                    ]
                },
                'alumni-rule-config': {
                    path: '/api/v1/alumni/rule-config',
                    params: [
                        { name: '规则名称', label: '规则配置名称', type: 'text', default: '院校匹配粒度规则_v2', desc: '细分规则的唯一标识名称' },
                        { name: '匹配粒度', label: '院校匹配粒度', type: 'select', options: ['精确匹配', '模糊匹配', '层级匹配'], default: '层级匹配', desc: '院校名称匹配的精度级别' },
                        { name: '阶段分类', label: '教育阶段分类', type: 'select', options: ['本科', '硕士', '博士', '全部'], default: '全部', desc: '按教育阶段进行精细化拆分' }
                    ]
                },
                'alumni-dimension-record': {
                    path: '/api/v1/alumni/dimension-record',
                    params: [
                        { name: '校友关系ID', label: '校友关系标识', type: 'text', default: 'REL_ALUM_20240401_001', desc: '校友关系的唯一标识符' },
                        { name: '记录维度', label: '核心维度字段', type: 'select', options: ['全部', '双方ID', '院校院系', '入学年份', '细分类型'], default: '全部', desc: '选择需要记录的核心维度' },
                        { name: '存储格式', label: '档案存储格式', type: 'select', options: ['JSON', 'CSV', 'MySQL'], default: 'MySQL', desc: '结构化档案的存储格式' }
                    ]
                },
                'alumni-academic-interact': {
                    path: '/api/v1/alumni/academic-interact',
                    params: [
                        { name: '校友关系标识', label: '校友关系ID', type: 'text', default: 'REL_ALUM_5521', desc: '已构建的校友关系唯一标识' },
                        { name: '检索时段', label: '关联时间窗口', type: 'text', default: '2010-09 至 2014-07', desc: '限定成果与教育时段的关联' },
                        { name: '互动类型', label: '互动成果类型', type: 'select', options: ['全部', '论文', '专利', '基金项目'], default: '全部', desc: 'ES聚合查询的目标范围' }
                    ]
                },
                'alumni-career-interact': {
                    path: '/api/v1/alumni/career-interact',
                    params: [
                        { name: '校友关系标识', label: '校友关系ID', type: 'text', default: 'REL_ALUM_5521', desc: '已构建的校友关系唯一标识' },
                        { name: '互动类型', label: '职业互动类型', type: 'select', options: ['共同任职', '共同创业', '全部'], default: '全部', desc: '职业互动信息的挖掘范围' },
                        { name: '地域背景', label: '地域背景补全', type: 'select', options: ['开启', '关闭'], default: '开启', desc: '调用高德地图API补充地域信息' }
                    ]
                },
                'alumni-visual-adapt': {
                    path: '/api/v1/alumni/visual-adapt',
                    params: [
                        { name: '校友关系标识', label: '校友关系ID', type: 'text', default: 'REL_ALUM_5521', desc: '需要展示的校友关系标识' },
                        { name: '展示维度', label: '展示数据维度', type: 'select', options: ['关系档案', '学术互动', '职业互动', '全部'], default: '全部', desc: '选择需要展示的数据维度' },
                        { name: '可视化引擎', label: '前端可视化组件', type: 'select', options: ['AntV G6', 'ECharts', 'D3.js'], default: 'AntV G6', desc: '图谱可视化渲染引擎' }
                    ]
                }
            }
        },

        'paper-coop': {
            id: 'paper-coop',
            title: '科技专家论文合作关系',
            desc: '亿级论文数据驱动的作者消歧、合作网络构建与影响力分析系统。',
            docs: `
                <div class="card">
                    <div class="card-title"><i class="fas fa-info-circle"></i> 功能描述</div>
                    <p>通过 Apache DolphinScheduler 分布式调度框架从多源采集亿级论文数据，利用基于 BERT 的实体对齐模型将论文作者与学者唯一标识进行精准关联。系统采用规则引擎结合编辑距离算法清洗重复记录，规范化作者排序、通讯作者标识等字段格式。基于消歧后的作者身份档案提取共同作者关联，利用 Neo4j 图数据库构建全球论文合作网络，并通过多维评估模型量化合作网络对学者影响力的贡献。</p>
                </div>
                <div class="card">
                    <div class="card-title"><i class="fas fa-layer-group"></i> 系统子功能模块</div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                        <div class="sub-func-item"><strong>1. 论文合作关系构建</strong><br>亿级论文数据整合、作者消歧精准校验、合作网络搭建。</div>
                        <div class="sub-func-item"><strong>2. 合作数据量化统计</strong><br>合作论文数量统计、期刊会议级别分布、论文被引情况分析。</div>
                        <div class="sub-func-item"><strong>3. 合作网络与影响力分析</strong><br>研究方向分析、核心团队识别、网络影响力评估。</div>
                    </div>
                </div>
            `,
            test: `
                <div class="card">
                    <div class="card-title"><i class="fas fa-flask"></i> 算法测试 (子功能选择)</div>
                    <div class="test-container">
                        <div class="input-panel">
                            <div class="form-group">
                                <label>选择子功能模块</label>
                                <select id="sub-func-selector" style="margin-bottom: 15px; border: 2px solid var(--secondary-color);">
                                    <optgroup label="1. 论文合作关系构建">
                                        <option value="paper-data-integration">1.1 亿级论文数据整合</option>
                                        <option value="paper-author-disambiguation">1.2 作者消歧精准校验</option>
                                        <option value="paper-network-build">1.3 论文合作关系网络搭建</option>
                                    </optgroup>
                                    <optgroup label="2. 合作数据量化统计">
                                        <option value="paper-coop-count">2.1 合作论文数量统计</option>
                                        <option value="paper-journal-distribution">2.2 期刊/会议级别分布统计</option>
                                        <option value="paper-citation-stats">2.3 论文被引情况统计</option>
                                    </optgroup>
                                    <optgroup label="3. 合作网络与影响力分析">
                                        <option value="paper-research-direction">3.1 合作研究方向分析</option>
                                        <option value="paper-team-identify">3.2 核心合作团队识别</option>
                                        <option value="paper-influence-eval">3.3 合作网络影响力评估</option>
                                    </optgroup>
                                </select>
                            </div>
                            <div id="test-form-container" class="test-form">
                                <!-- 动态生成子功能表单 -->
                            </div>
                            <button class="btn-accent" style="margin-top: 20px; width: 100%; font-weight: bold; height: 45px;" id="run-test">
                                <i class="fas fa-play-circle"></i> 执行子功能测试
                            </button>
                        </div>
                        <div class="output-panel">
                            <div style="margin-bottom: 10px; display: flex; justify-content: space-between;">
                                <span style="font-weight: bold; color: #475569;">子模块处理结果:</span>
                                <span id="test-status" class="status-badge ready">就绪</span>
                            </div>
                            <div class="result-panel" id="test-result" style="height: 380px;">// 选择子功能并执行测试...</div>
                        </div>
                    </div>
                </div>
            `,
            api: {
                python: "# 参见各子模块调用示例",
                nodejs: "// 参见各子模块调用示例",
                curl: "# 参见各子模块调用示例"
            },
            subFunctions: {
                'paper-data-integration': {
                    path: '/api/v1/paper/data-integration',
                    params: [
                        { name: '采集源', label: '数据源选择', type: 'select', options: ['CNKI', 'WOS', 'Scopus', 'IEEE', 'PubMed'], default: 'WOS', desc: '选择论文数据来源渠道' },
                        { name: '采集规模', label: '采集规模', type: 'number', default: 100000000, desc: '单次任务处理的记录行数' },
                        { name: '调度引擎', label: '调度引擎', type: 'select', options: ['Apache DolphinScheduler', 'Airflow'], default: 'Apache DolphinScheduler', desc: '分布式调度框架' }
                    ]
                },
                'paper-author-disambiguation': {
                    path: '/api/v1/paper/author-disambiguation',
                    params: [
                        { name: '作者姓名', label: '论文作者姓名', type: 'text', default: 'Zhang Wei', desc: '待消歧的论文作者原始文本' },
                        { name: '作者机构', label: '作者所属机构', type: 'text', default: '清华大学计算机系', desc: '辅助消歧的机构字段' },
                        { name: '研究方向', label: '研究方向', type: 'text', default: '知识图谱', desc: '辅助消歧的研究方向字段' },
                        { name: '消歧模型', label: 'BERT模型版本', type: 'select', options: ['BERT-Base-Disambig-v1', 'BERT-Large-Disambig-v2'], default: 'BERT-Large-Disambig-v2', desc: '实体消歧模型版本' }
                    ]
                },
                'paper-network-build': {
                    path: '/api/v1/paper/network-build',
                    params: [
                        { name: '学者ID', label: '学者标识', type: 'text', default: 'SCH_THU_001', desc: '消歧后的学者唯一标识' },
                        { name: '时间范围', label: '时间范围', type: 'text', default: '2010-2024', desc: '合作网络构建的时间区间' },
                        { name: '图数据库', label: '图数据库', type: 'select', options: ['Neo4j', 'NebulaGraph'], default: 'Neo4j', desc: '存储合作网络的图数据库' }
                    ]
                },
                'paper-coop-count': {
                    path: '/api/v1/paper/coop-count',
                    params: [
                        { name: '学者A', label: '学者A标识', type: 'text', default: 'SCH_THU_001', desc: '第一位学者ID' },
                        { name: '学者B', label: '学者B标识', type: 'text', default: 'SCH_PKU_002', desc: '第二位学者ID' },
                        { name: '年份区间', label: '年份区间', type: 'text', default: '2015-2024', desc: '统计的年份范围' },
                        { name: '语言', label: '论文语言', type: 'select', options: ['全部', '中文', '英文'], default: '全部', desc: '按语言筛选' }
                    ]
                },
                'paper-journal-distribution': {
                    path: '/api/v1/paper/journal-distribution',
                    params: [
                        { name: '学者ID', label: '学者标识', type: 'text', default: 'SCH_THU_001', desc: '待统计的学者ID' },
                        { name: '分级标准', label: '期刊分级标准', type: 'select', options: ['CCF推荐', 'JCR分区', '中科院分区'], default: 'CCF推荐', desc: '期刊会议分级依据' }
                    ]
                },
                'paper-citation-stats': {
                    path: '/api/v1/paper/citation-stats',
                    params: [
                        { name: '学者A', label: '学者A标识', type: 'text', default: 'SCH_THU_001', desc: '第一位学者ID' },
                        { name: '学者B', label: '学者B标识', type: 'text', default: 'SCH_PKU_002', desc: '第二位学者ID' },
                        { name: '统计维度', label: '统计维度', type: 'select', options: ['总被引', '单篇最高', '平均被引', '时间趋势'], default: '总被引', desc: '被引统计维度' }
                    ]
                },
                'paper-research-direction': {
                    path: '/api/v1/paper/research-direction',
                    params: [
                        { name: '学者ID', label: '学者标识', type: 'text', default: 'SCH_THU_001', desc: '待分析的学者ID' },
                        { name: '聚类算法', label: '聚类算法', type: 'select', options: ['K-Means', 'Louvain', 'DBSCAN'], default: 'Louvain', desc: '关键词聚类算法' },
                        { name: '向量数据库', label: '向量数据库', type: 'select', options: ['Milvus', 'Faiss'], default: 'Milvus', desc: '关键词向量存储' }
                    ]
                },
                'paper-team-identify': {
                    path: '/api/v1/paper/team-identify',
                    params: [
                        { name: '合作网络', label: '网络范围', type: 'select', options: ['全球网络', '机构网络', '学科网络'], default: '全球网络', desc: '团队识别的网络范围' },
                        { name: '合作频次阈值', label: '合作频次阈值', type: 'number', default: 5, desc: '筛选稳定团队的最小合作频次' },
                        { name: '持续时间阈值', label: '持续时间阈值(年)', type: 'number', default: 3, desc: '筛选稳定团队的最小合作年限' }
                    ]
                },
                'paper-influence-eval': {
                    path: '/api/v1/paper/influence-eval',
                    params: [
                        { name: '学者ID', label: '学者标识', type: 'text', default: 'SCH_THU_001', desc: '待评估的学者ID' },
                        { name: '评估模型', label: '评估模型', type: 'select', options: ['XGBoost', 'RandomForest', 'NeuralNetwork'], default: 'XGBoost', desc: '影响力评估模型' },
                        { name: '可视化引擎', label: '可视化引擎', type: 'select', options: ['AntV G6', 'ECharts', 'D3.js'], default: 'AntV G6', desc: '合作网络可视化组件' }
                    ]
                }
            }
        },
        'enterprise-relation': {
            id: 'enterprise-relation',
            title: '重点关注科技企业关系',
            desc: '产学研深度融合的专家-企业多源关联数据集构建与背景深度分析系统。',
            docs: `
                <div class="card">
                    <div class="card-title"><i class="fas fa-info-circle"></i> 功能描述</div>
                    <p>系统通过分布式调度框架从多源采集学者经历、专利、基金等数据，利用基于 BERT 的实体对齐模型实现专家身份与企业信息的标准化处理。通过智能校验与多元关系构建，精准识别专家在企业中的角色（在职/顾问）并提取详细合作背景，最终结合企业核心维度分析，输出专家与企业间的深度关联图谱与竞争力报告。</p>
                </div>
                <div class="card">
                    <div class="card-title"><i class="fas fa-layer-group"></i> 系统子功能模块</div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                        <div class="sub-func-item"><strong>1. 专家-企业关系构建</strong><br>多源整合、标准化处理、匹配校验及多元关系生成。</div>
                        <div class="sub-func-item"><strong>2. 角色与合作详情标注</strong><br>精准识别专家角色，全量提取技术领域、时段及模式。</div>
                        <div class="sub-func-item"><strong>3. 企业背景关联分析</strong><br>整合企业背景信息，评估行业地位与技术竞争力。</div>
                    </div>
                </div>
            `,
            test: `
                <div class="card">
                    <div class="card-title"><i class="fas fa-flask"></i> 算法测试 (子功能选择)</div>
                    <div class="test-container">
                        <div class="input-panel">
                            <div class="form-group">
                                <label>选择子功能模块</label>
                                <select id="sub-func-selector" style="margin-bottom: 15px; border: 2px solid var(--secondary-color);">
                                    <optgroup label="1. 专家-企业关系构建">
                                        <option value="ent-data-integration">1.1 多源关联数据整合</option>
                                        <option value="ent-standardization">1.2 企业信息标准化处理</option>
                                        <option value="ent-match-verify">1.3 企业与专家匹配校验</option>
                                        <option value="ent-relation-build">1.4 多元关系智能构建</option>
                                    </optgroup>
                                    <optgroup label="2. 角色与合作详情标注">
                                        <option value="ent-role-id">2.1 专家角色精准识别</option>
                                        <option value="ent-coop-extract">2.2 合作详情全量提取</option>
                                        <option value="ent-archive">2.3 标准化标注归档</option>
                                    </optgroup>
                                    <optgroup label="3. 企业背景关联分析">
                                        <option value="ent-bg-integration">3.1 企业背景信息整合</option>
                                        <option value="ent-core-analysis">3.2 企业核心维度分析</option>
                                    </optgroup>
                                </select>
                            </div>
                            <div id="test-form-container" class="test-form">
                                <!-- 动态生成子功能表单 -->
                            </div>
                            <button class="btn-accent" style="margin-top: 20px; width: 100%; font-weight: bold; height: 45px;" id="run-test">
                                <i class="fas fa-play-circle"></i> 执行子功能测试
                            </button>
                        </div>
                        <div class="output-panel">
                            <div style="margin-bottom: 10px; display: flex; justify-content: space-between;">
                                <span style="font-weight: bold; color: #475569;">子模块处理结果:</span>
                                <span id="test-status" class="status-badge ready">就绪</span>
                            </div>
                            <div class="result-panel" id="test-result" style="height: 380px;">// 选择子功能并执行测试...</div>
                        </div>
                    </div>
                </div>
            `,
            api: {
                python: "# 参见各子模块调用示例",
                nodejs: "// 参见各子模块调用示例",
                curl: "# 参见各子模块调用示例"
            },
            subFunctions: {
                'ent-data-integration': {
                    path: '/api/v1/enterprise/data-integration',
                    params: [
                        { name: '数据源', label: '采集数据源', type: 'select', options: ['学者经历+专利+基金', '仅经历', '专利+基金'], default: '学者经历+专利+基金', desc: '选择多源数据整合范围' },
                        { name: '清洗规范', label: '清洗规范开关', type: 'select', options: ['开启', '关闭'], default: '开启', desc: '是否执行字段清洗与规范化' }
                    ]
                },
                'ent-standardization': {
                    path: '/api/v1/enterprise/standardization',
                    params: [
                        { name: '企业名称', label: '原始企业名称', type: 'text', default: '阿里', desc: '待标准化的企业名称' },
                        { name: '对齐模型', label: '实体对齐模型', type: 'select', options: ['BERT-Ent-Align-v1', 'Rule-Based'], default: 'BERT-Ent-Align-v1', desc: '规避同名混淆的算法模型' }
                    ]
                },
                'ent-match-verify': {
                    path: '/api/v1/enterprise/match-verify',
                    params: [
                        { name: '学者标识', label: '学者唯一ID', type: 'text', default: 'SCH_001', desc: '待校验的学者标识' },
                        { name: '企业标识', label: '企业统一社会信用代码', type: 'text', default: '91330100712560555A', desc: '标准化后的企业标识' },
                        { name: '校验维度', label: '匹配校验维度', type: 'select', options: ['机构/专利/基金全维度', '仅机构', '仅专利'], default: '机构/专利/基金全维度', desc: '多源比对校验范围' }
                    ]
                },
                'ent-relation-build': {
                    path: '/api/v1/enterprise/relation-build',
                    params: [
                        { name: '匹配算法', label: '关系识别算法', type: 'select', options: ['时间重叠匹配', '规则引擎'], default: '时间重叠匹配', desc: '识别任职/顾问/合作关系' },
                        { name: '图库写入', label: '图数据库实例', type: 'select', options: ['Neo4j-Main', 'Neo4j-Dev'], default: 'Neo4j-Main', desc: '关系边写入的目标库' }
                    ]
                },
                'ent-role-id': {
                    path: '/api/v1/enterprise/role-id',
                    params: [
                        { name: '职称经历', label: '职称/经历描述', type: 'text', default: '首席科学家，曾任高级工程师', desc: '用于角色识别的文本背景' },
                        { name: '分类模型', label: '文本分类模型', type: 'select', options: ['RoBERTa-Role-v2', 'BERT-Base'], default: 'RoBERTa-Role-v2', desc: '精准识别专家角色（在职/顾问）' }
                    ]
                },
                'ent-coop-extract': {
                    path: '/api/v1/enterprise/coop-extract',
                    params: [
                        { name: '合作描述', label: '合作背景文本', type: 'text', default: '负责XX项目研发，产出专利CN101...', desc: '提取技术领域与模式的原文' },
                        { name: 'NER模型', label: '命名实体识别', type: 'select', options: ['CRF-NER', 'BERT-NER-v2'], default: 'BERT-NER-v2', desc: '抽取技术领域、时段等详情' }
                    ]
                },
                'ent-archive': {
                    path: '/api/v1/enterprise/archive',
                    params: [
                        { name: '档案类型', label: '归档档案类型', type: 'select', options: ['可追溯结构化档案', '简版关系记录'], default: '可追溯结构化档案', desc: '包含成果ID的标准化归档' }
                    ]
                },
                'ent-bg-integration': {
                    path: '/api/v1/enterprise/bg-integration',
                    params: [
                        { name: '企业ID', label: '企业唯一标识', type: 'text', default: 'ENT_ALIBABA_001', desc: '待分析的企业标识' },
                        { name: '整合范围', label: '背景数据范围', type: 'select', options: ['工商/专利/基金/年报', '仅工商', '专利+基金'], default: '工商/专利/基金/年报', desc: '整合企业多维度背景信息' }
                    ]
                },
                'ent-core-analysis': {
                    path: '/api/v1/enterprise/core-analysis',
                    params: [
                        { name: '评估指标', label: '核心维度指标', type: 'select', options: ['综合地位', '专利竞争力', '资助强度'], default: '综合地位', desc: '行业地位与竞争力评估核心' },
                        { name: '回归模型', label: '评估模型算法', type: 'select', options: ['XGBoost-Regressor', 'Linear-Model'], default: 'XGBoost-Regressor', desc: '量化评估结论的生成模型' }
                    ]
                }
            }
        },
        'top-n-events': {
            id: 'top-n-events',
            title: '科技产业链点TOP-N事件',
            desc: '基于语义匹配与影响力评估模型的高价值科技事件识别与趋势分析系统。',
            docs: `
                <div class="card">
                    <div class="card-title"><i class="fas fa-info-circle"></i> 功能描述</div>
                    <p>系统通过配置中心预设产业链关键词，利用 RoBERTa 模型对专利、论文、基金等文本进行技术领域分类与语义匹配，实现产业链环节的精准定位。通过分布式调度框架整合多源事件数据，并基于 XGBoost 回归模型量化评估事件影响力，生成 TOP-N 排名。同时，挖掘事件背后的专家团队，并联动时间序列预测模型研判技术演进路径与潜在风险机遇。</p>
                </div>
                <div class="card">
                    <div class="card-title"><i class="fas fa-layer-group"></i> 系统子功能模块</div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                        <div class="sub-func-item"><strong>1. 高影响力事件筛选</strong><br>环节定位、数据整合、影响力评分与 TOP-N 灵活筛选。</div>
                        <div class="sub-func-item"><strong>2. 事件-专家关系构建</strong><br>主体挖掘、身份精准校验、团队关联关系补充。</div>
                        <div class="sub-func-item"><strong>3. 事件影响与趋势分析</strong><br>产业链影响评估、发展趋势研判及风险机遇挖掘。</div>
                    </div>
                </div>
            `,
            test: `
                <div class="card">
                    <div class="card-title"><i class="fas fa-flask"></i> 算法测试 (子功能选择)</div>
                    <div class="test-container">
                        <div class="input-panel">
                            <div class="form-group">
                                <label>选择子功能模块</label>
                                <select id="sub-func-selector" style="margin-bottom: 15px; border: 2px solid var(--secondary-color);">
                                    <optgroup label="1. 高影响力事件筛选">
                                        <option value="event-position">1.1 产业链环节精准定位</option>
                                        <option value="event-integration">1.2 多类型事件数据整合</option>
                                        <option value="event-impact-model">1.3 影响力评估模型应用</option>
                                        <option value="event-screening">1.4 TOP-N事件灵活筛选</option>
                                    </optgroup>
                                    <optgroup label="2. 事件-专家关系构建">
                                        <option value="event-subject-mining">2.1 事件关联主体挖掘</option>
                                        <option value="event-relation-verify">2.2 关联关系精准校验</option>
                                        <option value="event-team-completion">2.3 团队关联关系补充</option>
                                    </optgroup>
                                    <optgroup label="3. 事件影响与趋势分析">
                                        <option value="event-impact-analysis">3.1 产业链影响多维度分析</option>
                                        <option value="event-trend-judgment">3.2 发展趋势智能研判</option>
                                        <option value="event-risk-opportunity">3.3 风险与机遇挖掘</option>
                                    </optgroup>
                                </select>
                            </div>
                            <div id="test-form-container" class="test-form">
                                <!-- 动态生成子功能表单 -->
                            </div>
                            <button class="btn-accent" style="margin-top: 20px; width: 100%; font-weight: bold; height: 45px;" id="run-test">
                                <i class="fas fa-play-circle"></i> 执行子功能测试
                            </button>
                        </div>
                        <div class="output-panel">
                            <div style="margin-bottom: 10px; display: flex; justify-content: space-between;">
                                <span style="font-weight: bold; color: #475569;">子模块处理结果:</span>
                                <span id="test-status" class="status-badge ready">就绪</span>
                            </div>
                            <div class="result-panel" id="test-result" style="height: 380px;">// 选择子功能并执行测试...</div>
                        </div>
                    </div>
                </div>
            `,
            api: {
                python: "# 参见各子模块调用示例",
                nodejs: "// 参见各子模块调用示例",
                curl: "# 参见各子模块调用示例"
            },
            subFunctions: {
                'event-position': {
                    path: '/api/v1/event/position',
                    params: [
                        { name: '文本内容', label: '技术文本(专利/论文)', type: 'text', default: '一种基于GPU硬件加速的大规模并行图计算框架', desc: '待定位的技术描述文本' },
                        { name: '匹配引擎', label: '向量检索引擎', type: 'select', options: ['Milvus-Semantic-v2', 'ES-Keyword'], default: 'Milvus-Semantic-v2', desc: '基于RoBERTa语义向量的环节定位' }
                    ]
                },
                'event-integration': {
                    path: '/api/v1/event/integration',
                    params: [
                        { name: '事件类型', label: '采集事件范围', type: 'select', options: ['专利授权+基金+论文', '仅专利', '仅基金'], default: '专利授权+基金+论文', desc: '分布式调度框架采集范围' },
                        { name: '对齐模型', label: '实体对齐模型', type: 'select', options: ['BERT-Event-Align-v1', 'Simple-Mapping'], default: 'BERT-Event-Align-v1', desc: '为事件分配唯一标识并清洗规范' }
                    ]
                },
                'event-impact-model': {
                    path: '/api/v1/event/impact-model',
                    params: [
                        { name: '评估指标', label: '影响力指标体系', type: 'select', options: ['专利被引/基金金额/论文IF', '仅专利维度', '仅基金维度'], default: '专利被引/基金金额/论文IF', desc: '综合影响力评分权重设置' },
                        { name: '模型算法', label: '回归评分模型', type: 'select', options: ['XGBoost-Regressor-v3', 'Linear-Weighted'], default: 'XGBoost-Regressor-v3', desc: '多维度自动化评分模型' }
                    ]
                },
                'event-screening': {
                    path: '/api/v1/event/screening',
                    params: [
                        { name: 'N值', label: '筛选 TOP-N 数量', type: 'number', default: 10, desc: '降序筛选前 N 个高影响力事件' },
                        { name: '筛选条件', label: '灵活筛选维度', type: 'select', options: ['时间范围+技术领域', '仅时间范围', '仅技术领域'], default: '时间范围+技术领域', desc: 'MySQL 分组聚合筛选配置' }
                    ]
                },
                'event-subject-mining': {
                    path: '/api/v1/event/subject-mining',
                    params: [
                        { name: '事件ID', label: '高影响力事件ID', type: 'text', default: 'EVT_GPU_2024_001', desc: '以筛选出的事件为起点挖掘' },
                        { name: '挖掘深度', label: '关联挖掘深度', type: 'select', options: ['核心发明人/负责人', '包含全量团队成员'], default: '核心发明人/负责人', desc: '从专利/论文/基金中提取主体' }
                    ]
                },
                'event-relation-verify': {
                    path: '/api/v1/event/relation-verify',
                    params: [
                        { name: '学者姓名', label: '待校验学者姓名', type: 'text', default: '张三', desc: '事件关联的学者原始姓名' },
                        { name: '消歧模型', label: '身份消歧策略', type: 'select', options: ['BERT-Disambiguation-v2', 'Exact-Match'], default: 'BERT-Disambiguation-v2', desc: '结合机构与领域剔除同名误关联' }
                    ]
                },
                'event-team-completion': {
                    path: '/api/v1/event/team-completion',
                    params: [
                        { name: '社区算法', label: '团队识别算法', type: 'select', options: ['Louvain-Community', 'Label-Propagation'], default: 'Louvain-Community', desc: '识别参与同一事件的学者子图' },
                        { name: '关系补充', label: 'Neo4j路径补充', type: 'select', options: ['开启', '关闭'], default: '开启', desc: '构建事件-团队的多维度关联网络' }
                    ]
                },
                'event-impact-analysis': {
                    path: '/api/v1/event/impact-analysis',
                    params: [
                        { name: '分析维度', label: '产业链影响维度', type: 'select', options: ['技术路线/竞争格局', '技术路线', '竞争格局'], default: '技术路线/竞争格局', desc: '分析事件对产业链的深层影响' },
                        { name: '可视化', label: '输出可视化组件', type: 'select', options: ['ECharts-Trend', 'G6-Network'], default: 'ECharts-Trend', desc: '生成对比图或演变图结论' }
                    ]
                },
                'event-trend-judgment': {
                    path: '/api/v1/event/trend-judgment',
                    params: [
                        { name: '预测模型', label: '时间序列模型', type: 'select', options: ['LSTM-Trend-v2', 'ARIMA-Classic'], default: 'LSTM-Trend-v2', desc: '联动事件时间序列预判演进路径' },
                        { name: '图谱推理', label: '知识图谱路径推理', type: 'select', options: ['开启', '关闭'], default: '开启', desc: '结合专家方向预判技术演进' }
                    ]
                },
                'event-risk-opportunity': {
                    path: '/api/v1/event/risk-opportunity',
                    params: [
                        { name: '挖掘目标', label: '分析目标范围', type: 'select', options: ['风险与机遇全量', '仅技术空白/机遇', '仅迭代/竞争风险'], default: '风险与机遇全量', desc: '识别空白环节、缺口或竞争压力' },
                        { name: '大模型报告', label: 'LLM自动生成报告', type: 'select', options: ['ChatGLM-v3', 'GPT-4-Turbo'], default: 'ChatGLM-v3', desc: '输出综合分析报告结论' }
                    ]
                }
            }
        },
        'industry-panorama': {
            id: 'industry-panorama',
            title: '科技产业链全景图',
            desc: '多源数据驱动的产业链结构化建模与全景动态展示系统。',
            docs: `
                <div class="card">
                    <div class="card-title"><i class="fas fa-info-circle"></i> 功能描述</div>
                    <p>系统通过全产业链多源数据整合，利用基于 BERT 的实体对齐模型关联要素，并结合 RoBERTa 进行环节分层划分。采用 Neo4j 图数据库实现知识图谱建模落地，支持全链条可视化呈现、关键信息标注及价值流向展示。同时，系统具备底层数据自动同步更新、更新日志回溯及多维度交互操作能力，构建完整的产业链知识闭环。</p>
                </div>
                <div class="card">
                    <div class="card-title"><i class="fas fa-layer-group"></i> 系统子功能模块</div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                        <div class="sub-func-item"><strong>1. 产业链结构化建模</strong><br>多源整合、环节分层、图谱落地与关联完善。</div>
                        <div class="sub-func-item"><strong>2. 全景可视化展示</strong><br>全链条呈现、精准标注及价值流向可视化。</div>
                        <div class="sub-func-item"><strong>3. 交互与动态更新</strong><br>交互操作、同步更新、日志回溯与自定义配置。</div>
                    </div>
                </div>
            `,
            test: `
                <div class="card">
                    <div class="card-title"><i class="fas fa-flask"></i> 算法测试 (子功能选择)</div>
                    <div class="test-container">
                        <div class="input-panel">
                            <div class="form-group">
                                <label>选择子功能模块</label>
                                <select id="sub-func-selector" style="margin-bottom: 15px; border: 2px solid var(--secondary-color);">
                                    <optgroup label="1. 产业链结构化建模">
                                        <option value="panorama-integration">1.1 全产业链多源数据整合</option>
                                        <option value="panorama-segmentation">1.2 产业链环节分层划分</option>
                                        <option value="panorama-modeling">1.3 知识图谱建模落地</option>
                                        <option value="panorama-link-completion">1.4 多要素关联体系完善</option>
                                    </optgroup>
                                    <optgroup label="2. 全景可视化展示">
                                        <option value="panorama-render">2.1 全链条全景呈现</option>
                                        <option value="panorama-annotation">2.2 关键信息精准标注</option>
                                        <option value="panorama-flow">2.3 关联关系与价值流向可视化</option>
                                    </optgroup>
                                    <optgroup label="3. 交互与动态更新">
                                        <option value="panorama-interaction">3.1 多维度交互操作</option>
                                        <option value="panorama-sync">3.2 底层数据同步更新</option>
                                        <option value="panorama-log">3.3 更新日志与回溯</option>
                                        <option value="panorama-config">3.4 自定义交互配置</option>
                                    </optgroup>
                                </select>
                            </div>
                            <div id="test-form-container" class="test-form">
                                <!-- 动态生成子功能表单 -->
                            </div>
                            <button class="btn-accent" style="margin-top: 20px; width: 100%; font-weight: bold; height: 45px;" id="run-test">
                                <i class="fas fa-play-circle"></i> 执行子功能测试
                            </button>
                        </div>
                        <div class="output-panel">
                            <div style="margin-bottom: 10px; display: flex; justify-content: space-between;">
                                <span style="font-weight: bold; color: #475569;">子模块处理结果:</span>
                                <span id="test-status" class="status-badge ready">就绪</span>
                            </div>
                            <div class="result-panel" id="test-result" style="height: 380px;">// 选择子功能并执行测试...</div>
                        </div>
                    </div>
                </div>
            `,
            api: {
                python: "# 参见各子模块调用示例",
                nodejs: "// 参见各子模块调用示例",
                curl: "# 参见各子模块调用示例"
            },
            subFunctions: {
                'panorama-integration': {
                    path: '/api/v1/panorama/integration',
                    params: [
                        { name: '数据源范围', label: '整合数据源', type: 'select', options: ['企业+技术+人才+资本', '企业+技术', '人才+资本'], default: '企业+技术+人才+资本', desc: 'DolphinScheduler多源采集范围' },
                        { name: '对齐模型', label: '实体对齐策略', type: 'select', options: ['BERT-Universal-v1', 'Simple-Mapping'], default: 'BERT-Universal-v1', desc: '统一学者/专利/论文/基金标识' }
                    ]
                },
                'panorama-segmentation': {
                    path: '/api/v1/panorama/segmentation',
                    params: [
                        { name: '分类维度', label: '分层划分维度', type: 'select', options: ['技术/业务/研究方向', '仅业务', '仅技术'], default: '技术/业务/研究方向', desc: 'RoBERTa语义分类维度' },
                        { name: '环节定义', label: '环节映射规则', type: 'select', options: ['上中下游标准分层', '自定义环节'], default: '上中下游标准分层', desc: '界定核心定位与边界' }
                    ]
                },
                'panorama-modeling': {
                    path: '/api/v1/panorama/modeling',
                    params: [
                        { name: '要素节点', label: '映射要素节点', type: 'select', options: ['全量(企业/技术/人才/资本)', '仅企业+技术'], default: '全量(企业/技术/人才/资本)', desc: '知识图谱建模的核心要素' },
                        { name: '关系类型', label: '构建关系类型', type: 'select', options: ['合作/任职/研发', '仅合作', '仅任职'], default: '合作/任职/研发', desc: 'Neo4j 结构化图谱关系边' }
                    ]
                },
                'panorama-link-completion': {
                    path: '/api/v1/panorama/link-completion',
                    params: [
                        { name: '补充维度', label: '要素链路补充', type: 'select', options: ['技术-企业/人才-企业', '仅技术-企业', '仅人才-企业'], default: '技术-企业/人才-企业', desc: '完善产业链多要素关联链路' }
                    ]
                },
                'panorama-render': {
                    path: '/api/v1/panorama/render',
                    params: [
                        { name: '布局模式', label: '可视化布局', type: 'select', options: ['上中下游全链条', '全局视图', '分环节聚焦'], default: '上中下游全链条', desc: 'ECharts/AntV G6 渲染布局' },
                        { name: '自定义样式', label: '样式模板', type: 'select', options: ['科技蓝', '极简白', '暗黑模式'], default: '科技蓝', desc: '配置中心管理样式渲染' }
                    ]
                },
                'panorama-annotation': {
                    path: '/api/v1/panorama/annotation',
                    params: [
                        { name: '标注内容', label: '精准标注项', type: 'select', options: ['关键技术/重点企业/核心专家', '仅重点企业'], default: '关键技术/重点企业/核心专家', desc: '支持悬浮查看详细背景' }
                    ]
                },
                'panorama-flow': {
                    path: '/api/v1/panorama/flow',
                    params: [
                        { name: '价值流向', label: '动态呈现路径', type: 'select', options: ['资金+人才+技术', '仅技术流转', '仅资金流向'], default: '资金+人才+技术', desc: '区分关系样式并凸显核心链路' }
                    ]
                },
                'panorama-interaction': {
                    path: '/api/v1/panorama/interaction',
                    params: [
                        { name: '交互方式', label: '交互操作类型', type: 'select', options: ['层级钻取/关系筛选/条件聚焦', '仅层级钻取', '仅关系筛选'], default: '层级钻取/关系筛选/条件聚焦', desc: '适配多样化查询场景' }
                    ]
                },
                'panorama-sync': {
                    path: '/api/v1/panorama/sync',
                    params: [
                        { name: '同步频率', label: '自动同步策略', type: 'select', options: ['实时(RocketMQ+Flink)', '定时增量', '手动同步'], default: '实时(RocketMQ+Flink)', desc: '同步更新图谱节点与关系' }
                    ]
                },
                'panorama-log': {
                    path: '/api/v1/panorama/log',
                    params: [
                        { name: '回溯版本', label: '版本回溯号', type: 'text', default: 'VER_20240401_01', desc: '记录更新时间/来源，支持查询' }
                    ]
                },
                'panorama-config': {
                    path: '/api/v1/panorama/config',
                    params: [
                        { name: '样式配置', label: '自定义样式', type: 'text', default: '{"nodeSize": 50, "linkColor": "#4a90e2"}', desc: '保存常用筛选条件与视角' }
                    ]
                }
            }
        },
        'performance-monitor': {
            title: '通用与性能保障',
            desc: '亿级数据自动化同步与任务闭环管理',
            docs: `
                <div class="card">
                    <div class="card-title"><i class="fas fa-shield-alt"></i> 性能与监控方案</div>
                    <p>通过 Apache DolphinScheduler 编排中外论文、专利、学者等数据源的采集任务，支持亿级数据的自动化拉取与增量同步。利用 Elasticsearch 构建采集进度索引实现任务状态的可视化监控。</p>
                </div>
                <div class="card">
                    <div class="card-title"><i class="fas fa-tachometer-alt"></i> 核心指标 (SLA)</div>
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr style="border-bottom: 1px solid #eee;"><td style="padding:10px;">单节点检索响应</td><td>< 100ms</td></tr>
                        <tr style="border-bottom: 1px solid #eee;"><td style="padding:10px;">亿级图谱全量更新</td><td>< 24h</td></tr>
                        <tr style="border-bottom: 1px solid #eee;"><td style="padding:10px;">实体对齐准确率</td><td>> 98.5%</td></tr>
                    </table>
                </div>
            `,
            test: '',
            api: ''
        },
        'config-center': {
            title: '配置中心 (算法管理)',
            desc: '统一管理消歧模型、分类权重与采集规则',
            docs: `
                <div class="card">
                    <div class="card-title"><i class="fas fa-sliders-h"></i> 活跃模型管理</div>
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:15px;">
                        <div style="padding:15px; border:1px solid #e2e8f0; border-radius:8px;">
                            <div style="font-weight:bold;">BERT-Disambiguation-v2</div>
                            <div style="font-size:0.8rem; color:#666;">用于实体消歧与对齐</div>
                        </div>
                        <div style="padding:15px; border:1px solid #e2e8f0; border-radius:8px;">
                            <div style="font-weight:bold;">RoBERTa-Classifier-v1.5</div>
                            <div style="font-size:0.8rem; color:#666;">用于关系类型分类</div>
                        </div>
                    </div>
                </div>
            `,
            test: '',
            api: ''
        }
    };

    function renderTestForm(moduleId) {
        const module = modules[moduleId];
        const container = document.getElementById('test-form-container');
        if (!container) return;

        let params = module.params;
        
        // 通用子功能切换逻辑 (支持直接关系、间接关系等所有模块)
        if (module.subFunctions) {
            const selector = document.getElementById('sub-func-selector');
            if (selector) {
                const subFuncKey = selector.value;
                params = module.subFunctions[subFuncKey].params;
                
                // 绑定选择器切换事件
                if (!selector.dataset.bound) {
                    selector.addEventListener('change', () => renderTestForm(moduleId));
                    selector.dataset.bound = 'true';
                }
            }
        }

        if (!params) {
            container.innerHTML = '<div style="color:#94a3b8; padding:20px; text-align:center;">该模块暂无特定参数配置</div>';
            return;
        }

        container.innerHTML = params.map(p => {
            let fieldHTML = '';
            if (p.type === 'text') {
                fieldHTML = `<input type="text" id="test_${p.name}" value="${p.default}" placeholder="${p.desc}">`;
            } else if (p.type === 'number') {
                fieldHTML = `<input type="number" id="test_${p.name}" value="${p.default}">`;
            } else if (p.type === 'select') {
                fieldHTML = `<select id="test_${p.name}">
                    ${p.options.map(opt => `<option value="${opt}" ${opt === p.default ? 'selected' : ''}>${opt}</option>`).join('')}
                </select>`;
            } else if (p.type === 'range') {
                fieldHTML = `
                    <div class="range-group">
                        <input type="range" id="test_${p.name}" min="${p.min}" max="${p.max}" step="${p.step}" value="${p.default}">
                        <span class="range-value">${p.default}</span>
                    </div>`;
            }

            return `
                <div class="form-group">
                    <label>${p.label}</label>
                    ${fieldHTML}
                    <div class="form-help">${p.desc}</div>
                </div>
            `;
        }).join('');

        // 重新绑定 range 滑动事件
        container.querySelectorAll('input[type="range"]').forEach(range => {
            range.addEventListener('input', (e) => {
                e.target.nextElementSibling.textContent = e.target.value;
            });
        });
    }

    function switchModule(moduleId) {
        const module = modules[moduleId] || modules['expert-relation'];
        moduleContent.innerHTML = `
            <div class="module-header">
                <h1>${module.title}</h1>
                <p class="desc">${module.desc}</p>
            </div>
            <div class="tabs" id="main-tabs">
                <div class="tab active" data-tab="docs">技术方案</div>
                ${module.test || module.subFunctions ? '<div class="tab" data-tab="test">算法测试</div>' : ''}
                ${module.api ? '<div class="tab" data-tab="api">开发者接口</div>' : ''}
            </div>
            <div id="tab-content">${module.docs}</div>
        `;

        const tabs = document.querySelectorAll('#main-tabs .tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                const tabId = tab.getAttribute('data-tab');
                
                if (tabId === 'api') {
                    renderApiContent(moduleId);
                } else {
                    moduleContent.querySelector('#tab-content').innerHTML = module[tabId];
                    if (tabId === 'test') {
                        renderTestForm(moduleId);
                        bindTestEvents(moduleId);
                    }
                }
            });
        });
    }

    function renderApiContent(moduleId, lang = 'python', subFuncKey = null) {
        const module = modules[moduleId];
        let apiPath = '';
        let payload = {};

        // 处理子功能逻辑
        if (module.subFunctions) {
            subFuncKey = subFuncKey || Object.keys(module.subFunctions)[0];
            const subFunc = module.subFunctions[subFuncKey];
            apiPath = subFunc.path;
            payload = Object.fromEntries(subFunc.params.map(p => [p.name, p.default]));
        } else {
            // 安全提取 apiPath
            const match = module.test ? module.test.match(/data-path="([^"]+)"/) : null;
            apiPath = match ? match[1] : '';
            payload = Object.fromEntries(module.params.map(p => [p.name, p.default]));
        }

        const payloadStr = JSON.stringify(payload, null, 4);
        const codeSnippets = {
            python: `import requests\n\nurl = "http://localhost:3001${apiPath}"\npayload = ${payloadStr}\nheaders = {"Content-Type": "application/json"}\n\nresponse = requests.post(url, json=payload, headers=headers)\nprint(response.json())`,
            nodejs: `const axios = require('axios');\n\nconst url = "http://localhost:3001${apiPath}";\nconst payload = ${payloadStr};\n\naxios.post(url, payload)\n  .then(res => console.log(res.data))\n  .catch(err => console.error(err));`,
            curl: `curl -X POST "http://localhost:3001${apiPath}" \\\n     -H "Content-Type: application/json" \\\n     -d '${JSON.stringify(payload)}'`
        };

        const apiHTML = `
            <div class="card">
                <div class="card-title"><i class="fas fa-plug"></i> API 接口 (对外服务) ${subFuncKey ? ` - ${subFuncKey}` : ''}</div>
                ${module.subFunctions ? `
                    <div class="form-group" style="margin-bottom: 20px;">
                        <label>选择子功能接口</label>
                        <select id="api-sub-func-selector" style="border: 2px solid var(--secondary-color);">
                            ${Object.keys(module.subFunctions).map(k => `<option value="${k}" ${k === subFuncKey ? 'selected' : ''}>${k}</option>`).join('')}
                        </select>
                    </div>
                ` : ''}
                <p><strong>Endpoint:</strong> <code>POST ${apiPath}</code></p>
                <div style="margin-top: 15px;">
                    <div class="tabs" id="api-lang-tabs" style="margin-bottom: 15px;">
                        <div class="tab ${lang === 'python' ? 'active' : ''}" data-lang="python">Python</div>
                        <div class="tab ${lang === 'nodejs' ? 'active' : ''}" data-lang="nodejs">Node.js</div>
                        <div class="tab ${lang === 'curl' ? 'active' : ''}" data-lang="curl">cURL</div>
                    </div>
                    <pre><code id="api-code-block">${codeSnippets[lang]}</code></pre>
                </div>
            </div>
        `;
        
        moduleContent.querySelector('#tab-content').innerHTML = apiHTML;

        // 绑定语言切换事件
        document.querySelectorAll('#api-lang-tabs .tab').forEach(tab => {
            tab.addEventListener('click', () => {
                renderApiContent(moduleId, tab.getAttribute('data-lang'), subFuncKey);
            });
        });

        // 绑定子功能切换事件
        const subSelector = document.getElementById('api-sub-func-selector');
        if (subSelector) {
            subSelector.addEventListener('change', () => {
                renderApiContent(moduleId, lang, subSelector.value);
            });
        }
    }

    function bindTestEvents(moduleId) {
        const runTestBtn = document.getElementById('run-test');
        const testResult = document.getElementById('test-result');
        const testStatus = document.getElementById('test-status');
        const openConfigBtn = document.getElementById('open-config-btn');
        const module = modules[moduleId];

        // --- 核心硬编码 Mock 数据 (前端写死，确保 100% 可用) ---
        const MOCK_DATA = {
            // 科技专家/人才直接关系
            'expert-collect': {
                "code": 200,
                "message": "【多源采集】自动化调度任务已触发",
                "data": {
                    "任务ID": "TASK_EXT_20240401_88",
                    "数据源状态": { "中外论文": "连接正常", "专利库": "分片同步中", "基金委": "增量更新完成" },
                    "预计新增节点": "12,500+",
                    "调度引擎": "Apache DolphinScheduler v3.0",
                    "MySQL监控状态": "Active"
                }
            },
            'expert-align': {
                "code": 200,
                "message": "【实体消歧】对齐成功",
                "data": {
                    "标准姓名": "张三",
                    "分配唯一ID": "SCH_ZHANG_8872",
                    "标准机构": "清华大学计算机科学与技术系",
                    "语义相似度": 0.998,
                    "模型特征向量预览": [0.12, -0.45, 0.88, "..."],
                    "对齐结论": "通过 Transformer 双塔模型二次校验，已排除同名干扰项"
                }
            },
            'expert-map': {
                "code": 200,
                "message": "【关系映射】完成并入库",
                "data": {
                    "清洗记录数": 1500,
                    "修正格式错误": 12,
                    "写入Neo4j节点": 8,
                    "写入Neo4j关系": 15,
                    "映射Schema": "Expert -> CO_AUTHOR -> Expert",
                    "状态": "Success"
                }
            },
            'expert-vector': {
                "code": 200,
                "message": "【文本向量化】入库成功",
                "data": {
                    "向量维度": 768,
                    "索引策略": "HNSW",
                    "Milvus集合": "expert_knowledge_vector",
                    "处理耗时": "45ms",
                    "语义召回预览": ["知识图谱构建", "图数据库优化", "实体消歧算法"]
                }
            },
            'expert-profile': {
                "code": 200,
                "message": "【专家画像】数据报文生成成功",
                "data": {
                    "基本信息": { "姓名": "张三", "职称": "教授", "H-Index": 45 },
                    "技术领域": ["人工智能", "大数据", "图计算"],
                    "成果概况": { "论文": 120, "专利": 15, "基金项目": 5 },
                    "影响力指标": { "学术贡献度": 0.92, "企业合作度": 0.78 },
                    "可视化规范": "AntV-G6-Standard-v1"
                }
            },
            'expert-hover': {
                "code": 200,
                "message": "【成果元数据】异步请求成功",
                "data": {
                    "标题": "基于Transformer的亿级科技知识图谱构建方法",
                    "作者序": "张三(1), 李四(2), 王五(通讯)",
                    "发表年份": 2023,
                    "摘要预览": "本文提出一种分布式的图谱构建方案，解决了千万级实体下的实时消歧难题...",
                    "关键词": ["Transformer", "知识图谱", "实体消歧"]
                }
            },
            'expert-drilldown': {
                "code": 200,
                "message": "【成果关联下钻】查询成功",
                "data": {
                    "关联作者": ["张三", "李四", "王五"],
                    "依托机构": ["清华大学", "北京大学"],
                    "引证关系数": 45,
                    "贡献度量化": { "张三": "45% (模型设计)", "李四": "30% (数据清洗)", "王五": "25% (实验验证)" },
                    "影响力传播路径": "已通过 ECharts 生成扩散模型"
                }
            },
            'expert-graph-drilldown': {
                "code": 200,
                "message": "【图谱层级钻取】成功",
                "data": {
                    "下钻层级": 2,
                    "新增节点": 25,
                    "新增连线": 42,
                    "动态加载状态": "已完成动画渲染",
                    "路径遍历算法": "BFS-Optimized"
                }
            },
            'expert-filter': {
                "code": 200,
                "message": "【关系过滤】结果已更新",
                "data": {
                    "过滤后节点数": 15,
                    "过滤后关系数": 28,
                    "Cypher语句预览": "MATCH (p:Expert)-[r:CO_AUTHOR]-(m) WHERE r.year > 2015 RETURN p,r,m",
                    "条件聚焦状态": "已适配年份: 2015-2024"
                }
            },
            'expert-style': {
                "code": 200,
                "message": "【样式自定义】配置已保存",
                "data": {
                    "应用模板": "学术影响力视角",
                    "节点颜色": "基于H-Index热力映射",
                    "连线粗细": "基于合作频次加权",
                    "视角快照": "VIEW_SNAPSHOT_20240401_001",
                    "保存状态": "Persistent"
                }
            },
            // 科技单节点间接关系
            'ind-node-position': {
                "code": 200,
                "message": "【核心节点定位】成功",
                "data": {
                    "学者ID": "SCH_LI_8821",
                    "标准姓名": "李四",
                    "标准机构": "北京大学信息科学技术学院",
                    "研究方向": "深度学习 / 自然语言处理",
                    "消歧置信度": 0.998,
                    "BERT校验结果": "已排除同名异人干扰"
                }
            },
            'ind-path-config': {
                "code": 200,
                "message": "【检索配置】已生效",
                "data": {
                    "检索深度": "2度",
                    "权重字段": ["论文", "专利", "基金"],
                    "查询模板": "MATCH (p:Expert {id: $id})-[r*1..2]-(m) ...",
                    "同步状态": "已实时同步至图查询引擎"
                }
            },
            'ind-potential-mine': {
                "code": 200,
                "message": "【潜在关联挖掘】完成",
                "data": {
                    "挖掘总数": 156,
                    "高潜关联数": 12,
                    "聚类社区": "AI-NLP-Group-B",
                    "挖掘示例": [
                        { "节点": "王五", "共现频次": 5, "关联概率": 0.85 },
                        { "节点": "赵六", "共现频次": 3, "关联概率": 0.72 }
                    ]
                }
            },
            'ind-path-comb': {
                "code": 200,
                "message": "【传递路径梳理】成功",
                "data": {
                    "路径总数": 24,
                    "轨迹详情": [
                        { "步骤": "李四 -> 周七 -> 王五", "依据": "PAT_2022_001, DOI_10.1145_331" },
                        { "步骤": "李四 -> 吴八 -> 王五", "依据": "PROJ_NSFC_882" }
                    ],
                    "清单状态": "已写入标准化路径档案"
                }
            },
            'ind-reasoning-verify': {
                "code": 200,
                "message": "【推理校验】完成",
                "data": {
                    "输入路径数": 24,
                    "有效路径数": 18,
                    "剔除无效路径": 6,
                    "校验评分分布": { "高合理性(>0.8)": 10, "中合理性(0.6-0.8)": 8 },
                    "日志详情": "剔除了 6 条由于机构背景冲突或研究方向偏差较大的路径"
                }
            },
            'ind-visual-adapt': {
                "code": 200,
                "message": "【可视化适配】成功",
                "data": {
                    "节点数": 35,
                    "关系边数": 52,
                    "数据版本": "V_20240401_ADAPT",
                    "JSON结构预览": "{ \"nodes\": [...], \"edges\": [...], \"metadata\": {...} }",
                    "适配目标": "AntV-G6-Graph"
                }
            },
            'ind-strength-calc': {
                "code": 200,
                "message": "【强度计算】结论已生成",
                "data": {
                    "计算模型": "XGBoost-Regressor-v2",
                    "平均强度评分": 0.72,
                    "分级分布": { "强关联": 3, "中关联": 8, "弱关联": 7 },
                    "核心因子权重": { "路径衰减": 0.4, "成果共现": 0.35, "机构重合": 0.25 }
                }
            },
            'ind-type-tagging': {
                "code": 200,
                "message": "【类型标注】完成",
                "data": {
                    "标注类型分布": { "论文合作衍生": 12, "项目协作衍生": 4, "校友关联衍生": 2 },
                    "标注模型": "RoBERTa-Text-Classify",
                    "置信度": 0.94,
                    "自定义扩展": "已合并用户预设规则"
                }
            },
            'ind-archive': {
                "code": 200,
                "message": "【结构化归档】已入库",
                "data": {
                    "归档编号": "ARC_IND_2024_0991",
                    "核心节点": "SCH_LI_8821",
                    "路径存档数": 18,
                    "存储位置": "MySQL: expert_indirect_archives",
                    "可追溯性": "已关联成果ID与校验日志"
                }
            },
            // 科技两点合作成果
            'coop-expert-pos': {
                "code": 200,
                "message": "【双专家定位】成功",
                "data": {
                    "专家A": { "ID": "SCH_001", "姓名": "张三", "标准机构": "清华大学" },
                    "专家B": { "ID": "SCH_002", "姓名": "李四", "标准机构": "北京大学" },
                    "定位状态": "已锁定",
                    "消歧置信度": 0.998,
                    "模型版本": "BERT-Disambiguation-v2"
                }
            },
            'coop-multi-search': {
                "code": 200,
                "message": "【多源关联检索】完成",
                "data": {
                    "图数据库检索数": 12,
                    "向量语义召回数": 5,
                    "初步筛选成果总数": 17,
                    "覆盖维度": ["论文", "专利", "基金项目"],
                    "检索耗时": "125ms"
                }
            },
            'coop-batch-summary': {
                "code": 200,
                "message": "【合作成果汇总】成功",
                "data": {
                    "去重合并数": 3,
                    "生成结构化清单数": 14,
                    "清单详情预览": [
                        { "ID": "DOI_10.1145_331", "类型": "论文", "标题": "大规模图谱协同分析", "产出时间": "2023-05" },
                        { "ID": "PAT_2022_001", "类型": "专利", "标题": "一种分布式实体消歧装置", "产出时间": "2022-11" }
                    ]
                }
            },
            'coop-multi-stats': {
                "code": 200,
                "message": "【多维分类统计】完成",
                "data": {
                    "类型分布": { "论文": 8, "专利": 4, "基金项目": 2 },
                    "年份趋势": { "2021": 3, "2022": 5, "2023": 6 },
                    "技术领域(RoBERTa标注)": { "人工智能": 10, "大数据": 4 },
                    "量化结果描述": "双方在AI领域有深厚合作，近年成果呈上升趋势。"
                }
            },
            'coop-info-extract': {
                "code": 200,
                "message": "【关键信息提取】完成",
                "data": {
                    "提取成功率": "100%",
                    "元数据概览": {
                        "期刊/会议": ["CVPR", "Nature", "KDD"],
                        "专利授权号": ["CN101xxx", "CN102..."],
                        "项目周期": "2021-2024"
                    },
                    "LLM处理日志": "已自动补充 2 项奖项信息并规范化描述。"
                }
            },
            'coop-attr-tagging': {
                "code": 200,
                "message": "【成果属性标注】成功",
                "data": {
                    "标注专家对": "SCH_001 <-> SCH_002",
                    "属性索引状态": "已更新",
                    "归档档案ID": "ARC_COOP_2024_001",
                    "包含维度": ["年份", "技术领域", "奖项/评价"]
                }
            },
            'coop-contrib-analysis': {
                "code": 200,
                "message": "【合作贡献分析】完成",
                "data": {
                    "张三平均贡献度": 0.55,
                    "李四平均贡献度": 0.45,
                    "主要角色分布": { "张三": "主要发起人/通讯作者", "李四": "核心研发/第一作者" },
                    "BERT角色识别结论": "双方在基础理论与工程实现上分工明确，贡献均衡。"
                }
            },
            'coop-mode-id': {
                "code": 200,
                "message": "【合作模式识别】完成",
                "data": {
                    "识别模式": "长期稳定合作型",
                    "时间序列特征": "2021-2024 持续产出",
                    "跨领域指数": 0.15,
                    "模式标注": "核心战略合作伙伴",
                    "决策树置信度": 0.96
                }
            },
            'coop-value-eval': {
                "code": 200,
                "message": "【合作价值评估】成功",
                "data": {
                    "综合评分": 92.5,
                    "评估等级": "极高价值 (S级)",
                    "核心指标": { "成果质量": 0.95, "合作周期": 0.88, "贡献均衡性": 0.92 },
                    "XGBoost模型预测": "该合作对所在领域有重大影响力，建议维持并加大投入。",
                    "报告下载路径": "/reports/coop_eval_001.pdf"
                }
            },
            // 科技专家同事关系 (9个子功能)
            'col-data-integration': {
                "code": 200,
                "message": "【工作经历数据整合】成功",
                "data": {
                    "任务ID": "TASK_COL_INT_20240401_001",
                    "数据源状态": {
                        "中外论文库": "连接正常",
                        "专利数据库": "分片同步中",
                        "公开简历源": "增量更新完成"
                    },
                    "采集记录总数": "2,580,000+",
                    "清洗引擎状态": "已开启",
                    "自动修复统计": {
                        "时间格式修正": 12500,
                        "缺失字段补全": 8200,
                        "重复记录剔除": 3500
                    },
                    "调度引擎": "Apache DolphinScheduler v3.0",
                    "存储位置": "MySQL: scholar_work_experience"
                }
            },
            'col-standardization': {
                "code": 200,
                "message": "【任职信息标准化处理】完成",
                "data": {
                    "原始机构文本": "清华计算机系",
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
                    "高德地图API调用状态": "成功"
                }
            },
            'col-smart-reasoning': {
                "code": 200,
                "message": "【同事关系智能推理构建】成功",
                "data": {
                    "推理算法": "时间重叠匹配",
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
                        },
                        {
                            "学者A": "王五 (SCH_003)",
                            "学者B": "赵六 (SCH_004)",
                            "重叠时段": "2018-01 至 2022-06",
                            "重叠月数": 54,
                            "推理置信度": 0.95
                        }
                    ],
                    "分布式并发数": 16,
                    "图数据库写入状态": "Neo4j-Cluster-Main: Success"
                }
            },
            'col-period-calc': {
                "code": 200,
                "message": "【同事关系时段核算】完成",
                "data": {
                    "学者A": {
                        "姓名": "张三",
                        "ID": "SCH_001",
                        "任职区间": "2010-01 至 2018-12",
                        "任职机构": "清华大学计算机系"
                    },
                    "学者B": {
                        "姓名": "李四",
                        "ID": "SCH_002",
                        "任职区间": "2015-06 至 2022-05",
                        "任职机构": "清华大学计算机系"
                    },
                    "同事关系生效时间": "2015-06",
                    "同事关系截止时间": "2018-12",
                    "共同在职时长": "42个月 (3年6个月)",
                    "时段重叠算法": "Interval-Intersection",
                    "核算精度": "月份级别"
                }
            },
            'col-bg-mining': {
                "code": 200,
                "message": "【任职背景挖掘】成功",
                "data": {
                    "挖掘对象": "张三 (SCH_001) 与 李四 (SCH_002)",
                    "挖掘深度": "部门+团队+地域",
                    "NER模型版本": "BERT-NER-v3",
                    "挖掘结果": {
                        "共同部门": "计算机科学与技术系",
                        "共同团队": "智能计算实验室",
                        "地域背景": "北京市海淀区",
                        "研究方向交集": ["人工智能", "大数据", "分布式计算"]
                    },
                    "背景描述生成": "两位学者在2015-2018年间同属清华大学计算机系智能计算实验室，研究方向高度重合，地域背景一致。",
                    "抽取实体数": 12,
                    "置信度": 0.94
                }
            },
            'col-archive': {
                "code": 200,
                "message": "【关系背景标注归档】已入库",
                "data": {
                    "档案编号": "ARC_COL_2024_001",
                    "档案版本": "V_20240401_SNAPSHOT",
                    "归档内容": {
                        "关系ID": "REL_COL_THU_001",
                        "学者对": "张三 <-> 李四",
                        "同事时段": "2015-06 至 2018-12",
                        "共同部门": "计算机科学与技术系",
                        "共同团队": "智能计算实验室"
                    },
                    "存储位置": "MySQL: colleague_relation_archive",
                    "快照生成状态": "已开启",
                    "可追溯性": "支持历史版本回溯查询"
                }
            },
            'col-result-search': {
                "code": 200,
                "message": "【协作成果精准检索】完成",
                "data": {
                    "检索对象": "张三 (SCH_001) 与 李四 (SCH_002)",
                    "同事时段": "2015-06 至 2018-12",
                    "成果类型": "论文+专利",
                    "检索引擎": "Elasticsearch-Cluster",
                    "检索结果": {
                        "共同论文数": 5,
                        "共同专利数": 3,
                        "成果总数": 8
                    },
                    "成果清单": [
                        { "ID": "DOI_10.1145_331", "类型": "论文", "标题": "大规模图数据处理优化方法", "发表时间": "2017-05" },
                        { "ID": "DOI_10.1109_KDD", "类型": "论文", "标题": "基于深度学习的实体对齐研究", "发表时间": "2016-08" },
                        { "ID": "PAT_CN2018_001", "类型": "专利", "标题": "一种分布式索引构建装置", "授权时间": "2018-11" },
                        { "ID": "PAT_CN2017_002", "类型": "专利", "标题": "基于GPU的并行计算加速方法", "授权时间": "2017-06" }
                    ],
                    "检索耗时": "45ms",
                    "全文索引命中数": 125
                }
            },
            'col-match-verify': {
                "code": 200,
                "message": "【成果关联匹配校验】完成",
                "data": {
                    "校验成果数": 8,
                    "校验通过数": 8,
                    "校验失败数": 0,
                    "消歧模型": "BERT-Base",
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
            },
            'col-visual-adapt': {
                "code": 200,
                "message": "【协作成果联动展示适配】成功",
                "data": {
                    "适配模式": "图谱联动+时间轴",
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
                    "JSON结构预览": {
                        "nodes": "[{id: 'SCH_001', label: '张三', type: 'scholar'}, ...]",
                        "edges": "[{source: 'SCH_001', target: 'SCH_002', label: '同事关系'}, ...]",
                        "timeline": "[{date: '2017-05', event: '论文发表', title: '大规模图数据处理'}, ...]"
                    },
                    "前端适配状态": "Ready"
                }
            },
            // 科技专家校友关系
            'alumni-data-integration': {
                "code": 200,
                "message": "【教育经历数据整合】成功",
                "data": {
                    "任务ID": "TASK_EDU_INT_20240401_001",
                    "数据源状态": { "中外论文库": "已同步", "专利数据库": "已同步", "公开简历源": "增量更新中" },
                    "整合记录数": "15,823,456",
                    "清洗去重数": "1,245,892",
                    "地域补全数": "12,500,000+",
                    "调度引擎": "Apache DolphinScheduler v3.0",
                    "处理耗时": "2小时35分钟"
                }
            },
            'alumni-smart-build': {
                "code": 200,
                "message": "【校友关系智能识别构建】完成",
                "data": {
                    "识别任务ID": "BUILD_ALUM_20240401_001",
                    "目标院校": ["清华大学", "北京大学", "浙江大学"],
                    "时间跨度": "2000-2024",
                    "匹配粒度": "院系级",
                    "识别校友关系数": "8,562,341",
                    "院校级关系": "5,234,567",
                    "院系级关系": "3,327,774",
                    "匹配算法": "院校名称标准化 + 教育时段交集判定",
                    "状态": "Success"
                }
            },
            'alumni-precise-classify': {
                "code": 200,
                "message": "【校友关系精准细分】完成",
                "data": {
                    "关系ID": "REL_ALUM_20240401_001",
                    "学者A": { "姓名": "张三", "学历": "博士", "院系": "计算机科学技术系", "院校": "清华大学", "入学年份": 2010 },
                    "学者B": { "姓名": "李四", "学历": "硕士", "院系": "计算机科学技术系", "院校": "清华大学", "入学年份": 2011 },
                    "细分类型": "院友 (同系不同级)",
                    "教育阶段细分": "博士-硕士传承关系",
                    "Apollo匹配规则": "ALUMNI_TYPE_DECISION_TREE",
                    "置信等级": "极高",
                    "判定依据": "同一院系、教育时段存在交集"
                }
            },
            'alumni-rule-config': {
                "code": 200,
                "message": "【细分规则配置优化】成功",
                "data": {
                    "规则名称": "院校匹配粒度规则_v2",
                    "规则ID": "RULE_MATCH_V2_20240401",
                    "匹配粒度": "层级匹配",
                    "教育阶段分类": ["本科", "硕士", "博士"],
                    "生效院校数": 985,
                    "配置来源": "Apollo配置中心",
                    "更新时间": "2024-04-01 10:30:00",
                    "状态": "已生效"
                }
            },
            'alumni-dimension-record': {
                "code": 200,
                "message": "【核心维度信息记录】成功",
                "data": {
                    "档案ID": "ARCH_ALUM_20240401_001",
                    "校友关系ID": "REL_ALUM_20240401_001",
                    "核心维度": {
                        "学者A_ID": "SCH_ZHANG_8872",
                        "学者B_ID": "SCH_LI_8821",
                        "院校": "清华大学",
                        "院系": "计算机科学技术系",
                        "学者A入学年份": 2010,
                        "学者B入学年份": 2011,
                        "细分类型": "院友 (同系不同级)"
                    },
                    "存储格式": "MySQL",
                    "写入状态": "Success",
                    "记录时间": "2024-04-01 10:35:22"
                }
            },
            'alumni-academic-interact': {
                "code": 200,
                "message": "【学术互动信息检索】成功",
                "data": {
                    "校友关系ID": "REL_ALUM_5521",
                    "检索时段": "2010-09 至 2014-07",
                    "互动成果总数": 8,
                    "互动详情": [
                        { "名称": "基于BERT的实体对齐研究", "类型": "论文", "发表时间": "2012-05", "关联性": "教育时段共同产出" },
                        { "名称": "国家自然科学基金重点项目", "类型": "基金项目", "立项时间": "2013-01", "角色": "共同成员" },
                        { "名称": "一种基于图神经网络的知识推理方法", "类型": "专利", "申请时间": "2013-08", "发明人排序": "第2、第3" }
                    ],
                    "ES聚合耗时": "32ms",
                    "索引分片": "es_shard_alumni_03"
                }
            },
            'alumni-career-interact': {
                "code": 200,
                "message": "【职业互动信息挖掘】完成",
                "data": {
                    "校友关系ID": "REL_ALUM_5521",
                    "职业互动类型": "全部",
                    "互动记录数": 3,
                    "互动详情": [
                        { "类型": "共同任职", "机构": "北京智源人工智能研究院", "时段": "2018-2020", "角色": "均任研究员" },
                        { "类型": "共同创业", "公司": "北京图智科技有限公司", "成立时间": "2020-05", "股权占比": "张三15%、李四10%" }
                    ],
                    "地域背景补全": { "省份": "北京市", "城市": "北京市", "经纬度": "116.31, 39.99" },
                    "数据来源": "公开工商信息、LinkedIn等"
                }
            },
            'alumni-visual-adapt': {
                "code": 200,
                "message": "【互动与合作信息联动展示适配】成功",
                "data": {
                    "校友关系ID": "REL_ALUM_5521",
                    "展示维度": "全部",
                    "可视化引擎": "AntV G6",
                    "节点数据": {
                        "关系档案": { "学者A": "张三", "学者B": "李四", "关系类型": "院友", "院校": "清华大学计算机系" },
                        "学术互动": { "论文": 5, "专利": 2, "基金项目": 1 },
                        "职业互动": { "共同任职": 1, "共同创业": 1 }
                    },
                    "边数据": [
                        { "source": "张三", "target": "李四", "type": "校友关系", "weight": 0.92 },
                        { "source": "张三", "target": "论文_001", "type": "产出", "weight": 1.0 }
                    ],
                    "JSON结构预览": "{ 'nodes': [...], 'edges': [...], 'metadata': {...} }",
                    "适配状态": "Ready"
                }
            },
            // 科技专家论文合作关系
            'paper-data-integration': {
                "code": 200,
                "message": "【亿级论文数据整合】完成",
                "data": {
                    "任务ID": "DS_JOB_PAPER_INT_001",
                    "数据源": "WOS (Web of Science)",
                    "采集规模": "100,000,000 条",
                    "整合状态": "分片执行完成",
                    "已写入MySQL": "98,756,432 条",
                    "调度引擎": "Apache DolphinScheduler",
                    "执行耗时": "4小时32分钟",
                    "数据质量": { "完整率": "99.2%", "去重率": "3.8%", "有效记录": "95,012,876 条" }
                }
            },
            'paper-author-disambiguation': {
                "code": 200,
                "message": "【作者消歧精准校验】完成",
                "data": {
                    "原始姓名": "Li Wei",
                    "关联学者": "李维 (ID: SCH_THU_092)",
                    "标准单位": "清华大学计算机科学与技术系",
                    "消歧置信度": 0.994,
                    "模型版本": "BERT-Large-Author-v2",
                    "消歧详情": {
                        "候选实体数": 15,
                        "特征匹配": { "单位匹配度": 0.98, "研究领域匹配度": 0.95, "合作者匹配度": 0.92 },
                        "最终判定": "高置信度匹配"
                    },
                    "处理统计": { "总消歧数": "12,456,789", "高置信度": "11,234,567", "需人工复核": "1,222,222" }
                }
            },
            'paper-network-build': {
                "code": 200,
                "message": "【论文合作关系网络搭建】完成",
                "data": {
                    "网络ID": "NET_COOP_2024_Q1",
                    "节点总数": "8,567,234 位学者",
                    "边总数": "45,678,901 条合作关系",
                    "图数据库": "Neo4j 5.x 集群",
                    "网络特征": {
                        "平均度": 10.67,
                        "最大连通分量": "99.2%",
                        "聚类系数": 0.34,
                        "平均路径长度": 4.2
                    },
                    "存储详情": { "节点标签": "Scholar", "边类型": "COOPERATE", "属性索引": ["name", "institution", "research_field"] }
                }
            },
            'paper-coop-count': {
                "code": 200,
                "message": "【合作论文数量统计】完成",
                "data": {
                    "统计ID": "STAT_COOP_CNT_001",
                    "学者ID": "SCH_THU_092",
                    "学者姓名": "李维",
                    "合作论文总数": 156,
                    "合作者数量": 42,
                    "合作分布": {
                        "独立作者": 23,
                        "2人合作": 45,
                        "3-5人合作": 67,
                        "6人以上合作": 21
                    },
                    "Top合作者": [
                        { "姓名": "王明", "单位": "北京大学", "合作论文数": 28 },
                        { "姓名": "张华", "单位": "清华大学", "合作论文数": 22 },
                        { "姓名": "刘洋", "单位": "中科院", "合作论文数": 18 }
                    ],
                    "年度趋势": { "2020": 12, "2021": 18, "2022": 25, "2023": 32, "2024": 28 }
                }
            },
            'paper-journal-distribution': {
                "code": 200,
                "message": "【期刊/会议级别分布统计】完成",
                "data": {
                    "统计ID": "STAT_JRNL_DIST_001",
                    "学者ID": "SCH_THU_092",
                    "论文总数": 156,
                    "期刊分布": {
                        "SCI一区": 45,
                        "SCI二区": 38,
                        "SCI三区": 22,
                        "SCI四区": 15,
                        "EI": 28,
                        "中文核心": 8
                    },
                    "顶级期刊": [
                        { "期刊名": "Nature", "论文数": 3, "影响因子": 69.5 },
                        { "期刊名": "Science", "论文数": 2, "影响因子": 56.9 },
                        { "期刊名": "IEEE TPAMI", "论文数": 12, "影响因子": 24.3 }
                    ],
                    "顶级会议": [
                        { "会议名": "CVPR", "论文数": 8, "CCF等级": "A" },
                        { "会议名": "ICCV", "论文数": 6, "CCF等级": "A" },
                        { "会议名": "NeurIPS", "论文数": 5, "CCF等级": "A" }
                    ],
                    "平均影响因子": 8.76
                }
            },
            'paper-citation-stats': {
                "code": 200,
                "message": "【论文被引情况统计】完成",
                "data": {
                    "统计ID": "STAT_CITE_001",
                    "学者ID": "SCH_THU_092",
                    "总被引次数": 8567,
                    "h指数": 32,
                    "i10指数": 58,
                    "被引分布": {
                        "0次被引": 12,
                        "1-10次": 45,
                        "11-50次": 67,
                        "51-100次": 23,
                        "100次以上": 9
                    },
                    "高被引论文": [
                        { "标题": "Deep Learning for Image Recognition", "被引": 856, "年份": 2020 },
                        { "标题": "Transformer-based Object Detection", "被引": 623, "年份": 2021 },
                        { "标题": "Self-supervised Visual Representation", "被引": 445, "年份": 2022 }
                    ],
                    "被引趋势": { "2020": 856, "2021": 1234, "2022": 1876, "2023": 2456, "2024": 2145 }
                }
            },
            'paper-research-direction': {
                "code": 200,
                "message": "【合作研究方向分析】完成",
                "data": {
                    "分析ID": "ANL_DIR_001",
                    "学者ID": "SCH_THU_092",
                    "主要研究方向": [
                        { "方向": "计算机视觉", "论文占比": "45%", "合作者数": 28 },
                        { "方向": "深度学习", "论文占比": "32%", "合作者数": 22 },
                        { "方向": "自然语言处理", "论文占比": "15%", "合作者数": 12 },
                        { "方向": "强化学习", "论文占比": "8%", "合作者数": 8 }
                    ],
                    "关键词聚类": {
                        "算法": "Neo4j图算法",
                        "向量库": "Milvus",
                        "聚类数": 156,
                        "Top关键词": ["目标检测", "图像分割", "特征提取", "神经网络", "注意力机制"]
                    },
                    "跨学科合作": [
                        { "学科": "生物医学", "论文数": 8, "合作机构": "北京协和医院" },
                        { "学科": "自动驾驶", "论文数": 6, "合作机构": "百度Apollo" }
                    ]
                }
            },
            'paper-team-identify': {
                "code": 200,
                "message": "【核心合作团队识别】完成",
                "data": {
                    "识别ID": "ID_TEAM_001",
                    "学者ID": "SCH_THU_092",
                    "识别算法": "Louvain社区发现",
                    "团队总数": 5,
                    "核心团队": [
                        {
                            "团队ID": "TEAM_001",
                            "团队规模": 12,
                            "核心成员": ["李维", "王明", "张华", "刘洋"],
                            "合作紧密度": 0.89,
                            "主要研究方向": "计算机视觉",
                            "代表论文": 28
                        },
                        {
                            "团队ID": "TEAM_002",
                            "团队规模": 8,
                            "核心成员": ["李维", "陈强", "赵敏"],
                            "合作紧密度": 0.76,
                            "主要研究方向": "深度学习",
                            "代表论文": 15
                        }
                    ],
                    "团队演化": { "新增成员": 5, "退出成员": 2, "稳定周期": "3年+" }
                }
            },
            'paper-influence-eval': {
                "code": 200,
                "message": "【合作网络影响力评估】完成",
                "data": {
                    "评估ID": "EVAL_INF_001",
                    "学者ID": "SCH_THU_092",
                    "评估模型": "XGBoost影响力模型",
                    "综合影响力得分": 87.6,
                    "影响力维度": {
                        "学术产出": { "得分": 92, "权重": 0.3, "详情": "论文数量与质量" },
                        "合作广度": { "得分": 85, "权重": 0.25, "详情": "合作者数量与多样性" },
                        "合作深度": { "得分": 88, "权重": 0.25, "详情": "长期稳定合作关系" },
                        "网络中心性": { "得分": 82, "权重": 0.2, "详情": "在合作网络中的核心程度" }
                    },
                    "网络中心性指标": {
                        "度中心性": 0.045,
                        "介数中心性": 0.032,
                        "接近中心性": 0.067,
                        "PageRank": 0.0012
                    },
                    "影响力排名": { "全球": "Top 5%", "国内": "Top 2%", "领域": "Top 3%" },
                    "可视化引擎": "AntV G6"
                }
            },
            // 重点关注科技企业关系
            'ent-data-integration': {
                "code": 200,
                "message": "【多源数据整合】成功",
                "data": {
                    "整合记录数": 12500,
                    "数据源构成": { "学者经历": 4500, "专利数据": 6200, "基金项目": 1800 },
                    "清洗状态": "已根据 Default-Clean-v1 规范化",
                    "存储位置": "MySQL: standard_enterprise_relation"
                }
            },
            'ent-standardization': {
                "code": 200,
                "message": "【企业信息标准化】完成",
                "data": {
                    "原始名称": "阿里",
                    "标准名称": "阿里巴巴(中国)有限公司",
                    "统一社会信用代码": "91330100712560555A",
                    "所属行业": "软件和信息技术服务业",
                    "置信度": 0.997
                }
            },
            'ent-match-verify': {
                "code": 200,
                "message": "【匹配校验】通过",
                "data": {
                    "学者": "张三 (SCH_001)",
                    "企业": "阿里巴巴 (ENT_001)",
                    "校验结果": "匹配成功",
                    "依据": "专利受让单位与任职机构一致",
                    "误匹配剔除数": 0
                }
            },
            'ent-relation-build': {
                "code": 200,
                "message": "【多元关系构建】成功",
                "data": {
                    "识别关系数": 3,
                    "关系详情": [
                        { "类型": "任职关系", "起止": "2018-2024", "详情": "高级工程师" },
                        { "类型": "研发合作", "项目": "AI大规模预训练", "成果": "专利x5" }
                    ],
                    "写入状态": "Neo4j 节点与边已更新"
                }
            },
            'ent-role-id': {
                "code": 200,
                "message": "【专家角色识别】成功",
                "data": {
                    "识别角色": "在职 (核心研发人员)",
                    "职称权重": 0.85,
                    "专利贡献权重": 0.92,
                    "模型结论": "结合首席科学家职称与第一发明人排序，判定为企业核心技术领军人"
                }
            },
            'ent-coop-extract': {
                "code": 200,
                "message": "【合作详情提取】完成",
                "data": {
                    "技术领域": ["深度学习", "知识图谱", "分布式系统"],
                    "合作时段": "2019-01 至 2023-12",
                    "研发模式": "联合实验室项目驱动",
                    "关联成果ID": ["PAT_2022_001", "PROJ_NSFC_882"]
                }
            },
            'ent-archive': {
                "code": 200,
                "message": "【标注归档】已入库",
                "data": {
                    "档案编号": "ARC_ENT_EXP_2024_099",
                    "可追溯路径": "/archive/expert-enterprise/SCH_001/ENT_001",
                    "包含维度": ["角色", "领域", "时段", "模式", "成果ID"]
                }
            },
            'ent-bg-integration': {
                "code": 200,
                "message": "【企业背景整合】成功",
                "data": {
                    "企业": "阿里巴巴(中国)有限公司",
                    "工商信息": "已同步",
                    "专利存量": 45200,
                    "基金支持": "省部级以上项目 12 项",
                    "数据更新时间": "2024-04-01"
                }
            },
            'ent-core-analysis': {
                "code": 200,
                "message": "【核心维度分析】结论已生成",
                "data": {
                    "行业地位评估": "头部领军企业 (Top 1%)",
                    "核心技术竞争力": 0.96,
                    "资助金额总计": "1.2 亿",
                    "竞争力雷达图数据": [95, 88, 92, 85, 98],
                    "报告摘要": "该企业在AI领域拥有极高的专利话语权，与多位顶级专家保持长期稳定的研发合作。"
                }
            },
            // 科技产业链点TOP-N事件
            'event-position': {
                "code": 200,
                "message": "【环节定位】成功",
                "data": {
                    "技术文本": "一种基于GPU硬件加速的大规模并行图计算框架",
                    "匹配环节": "计算芯片 -> GPU加速器 -> 并行计算框架",
                    "语义相似度": 0.945,
                    "定位结论": "该技术文本精准关联至产业链中游的计算核心环节"
                }
            },
            'event-integration': {
                "code": 200,
                "message": "【事件整合】完成",
                "data": {
                    "事件唯一ID": "EVT_GPU_2024_001",
                    "关联记录数": 5,
                    "事件构成": { "专利授权": 2, "论文发表": 2, "基金立项": 1 },
                    "清洗状态": "已剔除 2 条重复或逻辑冲突记录"
                }
            },
            'event-impact-model': {
                "code": 200,
                "message": "【影响力评估】成功",
                "data": {
                    "事件ID": "EVT_GPU_2024_001",
                    "综合影响力评分": 92.5,
                    "评分构成": { "专利被引权重": 45, "资助金额权重": 30, "论文影响力": 17.5 },
                    "行业分位": "Top 0.5%"
                }
            },
            'event-screening': {
                "code": 200,
                "message": "【TOP-N筛选】完成",
                "data": {
                    "筛选数量": 10,
                    "事件排名": [
                        { "排名": 1, "ID": "EVT_GPU_2024_001", "评分": 92.5, "标题": "GPU并行架构重大突破" },
                        { "排名": 2, "ID": "EVT_AI_2024_015", "评分": 89.8, "标题": "Transformer模型压缩新方法" }
                    ],
                    "筛选维度": "全产业链 / 2024年度"
                }
            },
            'event-subject-mining': {
                "code": 200,
                "message": "【主体挖掘】成功",
                "data": {
                    "事件ID": "EVT_GPU_2024_001",
                    "核心专家": ["张三 (ID: SCH_001)", "李四 (ID: SCH_002)"],
                    "核心团队": "清华大学并行计算实验室",
                    "参与角色": { "张三": "首席发明人", "李四": "项目负责人" }
                }
            },
            'event-relation-verify': {
                "code": 200,
                "message": "【关系校验】完成",
                "data": {
                    "校验对象": "张三",
                    "身份状态": "已确认 (Verified)",
                    "校验依据": "机构(清华大学)与研究领域(并行计算)双重匹配",
                    "误关联排除": "已排除 1 名同名(张三, 某中学教师)的关联"
                }
            },
            'event-team-completion': {
                "code": 200,
                "message": "【团队补充】成功",
                "data": {
                    "识别社区": "Parallel-Computing-Group-A",
                    "团队规模": 12,
                    "关键链路": "张三 -> 合作网络 -> 核心研发团队",
                    "Neo4j状态": "已补充 5 条团队协同关系边"
                }
            },
            'event-impact-analysis': {
                "code": 200,
                "message": "【影响分析】结论已生成",
                "data": {
                    "技术路线影响": "加速了从通用计算向专用硬件加速的演进趋势",
                    "竞争格局影响": "提升了国内在该环节的自主可控评分，缩小了与国际顶尖水平的差距",
                    "分析结论": "该事件具有里程碑意义，可能引发后续 2-3 年的产业链技术迭代"
                }
            },
            'event-trend-judgment': {
                "code": 200,
                "message": "【趋势研判】完成",
                "data": {
                    "技术演进路径": "并行框架 -> 硬件自适应优化 -> 跨平台算力调度",
                    "关键时间节点": { "2025-Q2": "原型落地", "2026-Q1": "产业化应用" },
                    "研判依据": "联动 5 位核心专家的后续研究方向与 3 项在研基金"
                }
            },
            'event-risk-opportunity': {
                "code": 200,
                "message": "【风险机遇挖掘】成功",
                "data": {
                    "潜在机遇": "在高性能算力调度环节存在技术空白，建议提前布局",
                    "竞争风险": "北美某机构在相关领域已有专利布局，存在交叉许可风险",
                    "综合结论": "机遇大于风险，建议加大在软件适配层的研发投入",
                    "大模型摘要": "本事件标志着算力基础设施的又一次跨越，虽然存在知识产权竞争，但为国产化替代提供了绝佳的技术切入点。"
                }
            },
            // 科技产业链全景图
            'panorama-integration': {
                "code": 200,
                "message": "【多源数据整合】成功",
                "data": {
                    "整合规模": "千万级要素",
                    "数据源构成": { "企业数据": "50万+", "技术成果": "200万+", "人才数据": "100万+", "资本数据": "10万+" },
                    "实体对齐状态": "BERT模型已完成 98.5% 的跨源关联",
                    "标准化路径": "/data/industry/standard_dataset_v1"
                }
            },
            'panorama-segmentation': {
                "code": 200,
                "message": "【环节分层划分】完成",
                "data": {
                    "上游环节": ["原材料供应", "核心算法研发"],
                    "中游环节": ["芯片制造", "模组集成", "系统软件"],
                    "下游环节": ["终端应用", "行业解决方案", "运维服务"],
                    "分类模型": "RoBERTa-Industry-v2.1",
                    "核心定位": "已界定 15 个核心技术节点与 42 个业务边界"
                }
            },
            'panorama-modeling': {
                "code": 200,
                "message": "【图谱建模落地】成功",
                "data": {
                    "节点总数": 125400,
                    "关系总数": 458200,
                    "图数据库": "Neo4j-Cluster-Main",
                    "写入速度": "15,000 关系/秒",
                    "结构化图谱": "已生成产业链拓扑底座"
                }
            },
            'panorama-link-completion': {
                "code": 200,
                "message": "【关联体系完善】完成",
                "data": {
                    "新增技术-企业关联": 1250,
                    "新增人才-企业关联": 850,
                    "完善链路": "构建了从‘基础研究’到‘产业化应用’的全要素关联路径",
                    "校验状态": "BERT实体匹配校验通过"
                }
            },
            'panorama-render': {
                "code": 200,
                "message": "【全景呈现】渲染成功",
                "data": {
                    "渲染引擎": "AntV G6 - 动态力导向布局",
                    "层级深度": 4,
                    "节点样式": "已应用‘科技蓝’样式模板",
                    "视图状态": "全链条全景视图已就绪"
                }
            },
            'panorama-annotation': {
                "code": 200,
                "message": "【关键信息标注】完成",
                "data": {
                    "标注项": [
                        { "类型": "关键技术", "内容": "GPU架构/并行计算", "标签": "核心瓶颈" },
                        { "类型": "重点企业", "内容": "某芯片领军企业", "标签": "产业链主" }
                    ],
                    "检索索引": "Elasticsearch 全文检索已挂载"
                }
            },
            'panorama-flow': {
                "code": 200,
                "message": "【价值流向展示】成功",
                "data": {
                    "流向类型": ["资金流", "人才流", "技术扩散"],
                    "核心链路": "凸显了中游芯片制造向各行业应用的价值辐射路径",
                    "样式区分": "不同线型与颜色已成功渲染"
                }
            },
            'panorama-interaction': {
                "code": 200,
                "message": "【交互操作】已适配",
                "data": {
                    "层级钻取": "支持从产业大类下钻至具体技术分类",
                    "关系筛选": "已配置 12 种关系类型筛选器",
                    "条件聚焦": "支持按地域、时间、强度进行图谱聚焦"
                }
            },
            'panorama-sync': {
                "code": 200,
                "message": "【同步更新】任务运行中",
                "data": {
                    "监听源": ["专利库变更", "学者入职变更"],
                    "同步引擎": "RocketMQ + Apache Flink",
                    "最近更新时间": "2024-04-01 14:30:00",
                    "同步增量": "今日新增节点 125 个"
                }
            },
            'panorama-log': {
                "code": 200,
                "message": "【日志查询】成功",
                "data": {
                    "版本号": "VER_20240401_01",
                    "更新内容": "全量同步 2024 第一季度专利数据",
                    "来源": "国家专利局数据接口",
                    "操作人": "System-Auto-Sync"
                }
            },
            'panorama-config': {
                "code": 200,
                "message": "【自定义配置】已保存",
                "data": {
                    "配置ID": "CFG_USER_001",
                    "样式模板": "暗黑模式",
                    "常用视角": "中游环节聚焦视图",
                    "同步状态": "已同步至 Apollo 配置中心"
                }
            },
            // 兜底模块 Mock
            'indirect-relation': {
                "code": 200,
                "message": "【科技单节点间接关系】整体分析成功",
                "data": {
                    "中心专家": "李四",
                    "关联总数": 125,
                    "深度": 3
                }
            }
        };

        if (runTestBtn) {
            const newBtn = runTestBtn.cloneNode(true);
            runTestBtn.parentNode.replaceChild(newBtn, runTestBtn);
            
            newBtn.addEventListener('click', async () => {
                testStatus.textContent = '运行中...';
                testStatus.className = 'status-badge running';
                testResult.innerHTML = '<span style="color: #60a5fa;"><i class="fas fa-spinner fa-spin"></i> 正在调用亿级算法引擎...</span>';
                
                try {
                    let path = newBtn.getAttribute('data-path');
                    let params = module.params;
                    let subFuncKey = '';

                    if (module.subFunctions) {
                        const selector = document.getElementById('sub-func-selector');
                        if (selector) {
                            subFuncKey = selector.value;
                            const subFunc = module.subFunctions[subFuncKey];
                            path = subFunc.path;
                            params = subFunc.params;
                        }
                    }

                    // --- 方案 1: 尝试调用真实 API ---
                    try {
                        const payload = {};
                        params.forEach(p => {
                            const input = document.getElementById(`test_${p.name}`);
                            if (input) {
                                payload[p.name] = p.type === 'number' || p.type === 'range' ? parseFloat(input.value) : input.value;
                            }
                        });

                        const response = await fetch(path, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(payload)
                        });

                        const contentType = response.headers.get("content-type");
                        if (response.ok && contentType && contentType.includes("application/json")) {
                            const result = await response.json();
                            testResult.innerHTML = JSON.stringify(result, null, 4);
                            testStatus.textContent = '成功 (Real API)';
                            testStatus.className = 'status-badge success';
                            return;
                        }
                    } catch (apiError) {
                        console.warn('Real API failed, switching to Mock mode:', apiError);
                    }

                    // --- 方案 2: 后退至 Mock 模式 (如果 API 不通或 404) ---
                    setTimeout(() => {
                        console.log('Using Mock Data for subFuncKey:', subFuncKey);
                        // 如果 subFuncKey 在 MOCK_DATA 中找不到，尝试使用 moduleId
                        let result = MOCK_DATA[subFuncKey];
                        
                        if (!result) {
                            console.warn(`Mock data for ${subFuncKey} not found, trying moduleId: ${moduleId}`);
                            result = MOCK_DATA[moduleId];
                        }

                        if (!result) {
                            result = {
                                "code": 200,
                                "message": "演示数据 (未定义子模块)",
                                "data": {
                                    "提示": "当前子功能暂无专用Mock数据",
                                    "模块ID": moduleId,
                                    "子功能Key": subFuncKey
                                }
                            };
                        }
                        
                        testResult.innerHTML = JSON.stringify(result, null, 4);
                        testStatus.textContent = '成功';
                        testStatus.className = 'status-badge success';
                    }, 500);

                } catch (e) {
                    testResult.innerHTML = `<span style="color:#ef4444;">调用失败: ${e.message}</span>`;
                    testStatus.textContent = '失败';
                    testStatus.className = 'status-badge error';
                }
            });
        }
        if (openConfigBtn) openConfigBtn.onclick = () => configModal.style.display = 'block';
    }

    sidebarItems.forEach(item => {
        item.onclick = () => {
            sidebarItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            switchModule(item.getAttribute('data-module'));
        };
    });

    closeBtns.forEach(btn => btn.onclick = () => configModal.style.display = 'none');
    switchModule('expert-relation');
});
