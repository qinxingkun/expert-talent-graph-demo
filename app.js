document.addEventListener('DOMContentLoaded', () => {
    const moduleContent = document.getElementById('module-content');
    const sidebarItems = document.querySelectorAll('.sidebar-nav li');
    const configModal = document.getElementById('config-modal');
    const closeBtns = document.querySelectorAll('.close-btn');

    // 模块通用模板生成器
    const createModule = (id, title, desc, tech, support, apiPath, inputJson) => ({
        title,
        desc,
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
                        <div style="margin-bottom: 10px; display: flex; justify-content: space-between;">
                            <span>请求参数 (JSON):</span>
                            <button class="btn-secondary btn-sm" id="open-config-btn"><i class="fas fa-cog"></i> 算法配置</button>
                        </div>
                        <textarea id="test-input" style="height: 180px;">${JSON.stringify(inputJson, null, 2)}</textarea>
                        <button class="btn-accent" style="margin-top: 15px; width: 100%;" id="run-test" data-path="${apiPath}">执行算法调用</button>
                    </div>
                    <div class="output-panel">
                        <div style="margin-bottom: 10px;">引擎响应:</div>
                        <div class="result-panel" id="test-result" style="height: 235px;">// 等待调用...</div>
                    </div>
                </div>
            </div>
        `,
        api: `
            <div class="card">
                <div class="card-title"><i class="fas fa-plug"></i> API 接口</div>
                <p><strong>Endpoint:</strong> <code>POST ${apiPath}</code></p>
                <pre style="margin-top:15px;"><code># Python 示例
import requests
resp = requests.post("http://localhost:3001${apiPath}", 
                     json=${JSON.stringify(inputJson)})
print(resp.json())</code></pre>
            </div>
        `
    });

    const modules = {
        'expert-relation': createModule(
            'expert-relation',
            '科技专家/人才直接关系',
            '基于 Transformer 的专家合作关系识别与抽取',
            '通过配置中心管理多源接口，采用 Transformer 实体对齐消歧，结合 RoBERTa 多分类模型预测合作关系类型（论文、专利、项目等）。',
            ['人才匹配系统', '知识图谱自动化构建', '学术社区发现'],
            '/api/v1/expert/direct-relation',
            { expert_name: "张三", target_domain: "人工智能" }
        ),
        'indirect-relation': createModule(
            'indirect-relation',
            '科技单节点间接关系',
            '深度挖掘专家间的隐性联系与学术路径',
            '在图数据库中利用索引与全文检索快速定位目标节点。引入基于 BERT 的实体消歧模型进行二次校验，确保核心节点唯一性并返回关系路径。',
            ['学术路径分析', '隐性合作挖掘', '科研圈探测'],
            '/api/v1/expert/indirect-relation',
            { expert_name: "李四", depth: 2 }
        ),
        'coop-results': createModule(
            'coop-results',
            '科技两点合作成果',
            '千万级节点毫秒级响应的合作成果检索',
            '利用全文索引与图数据库索引实现毫秒级响应。引入基于 BERT 的实体消歧模型，结合机构、研究方向等字段进行二次校验。',
            ['合作评价体系', '成果归属分析', '竞争力报告生成'],
            '/api/v1/expert/coop-results',
            { expert_a: "张三", expert_b: "李四" }
        ),
        'colleague-relation': createModule(
            'colleague-relation',
            '科技专家同事关系',
            '结构化工作经历与同事网络构建',
            '利用分布式调度框架分片写入任职信息，采用基于模糊匹配的实体对齐算法标准化机构名称，生成统一结构的工作经历数据集。',
            ['人才流动追踪', '机构影响力评估', '职场网络分析'],
            '/api/v1/expert/colleague-relation',
            { expert_name: "王五" }
        ),
        'alumni-relation': createModule(
            'alumni-relation',
            '科技专家校友关系',
            '基于教育经历的学术传承网络构建',
            '通过 DolphinScheduler 调度采集任务，利用基于 BERT 的实体对齐模型标准化院校名称，并调用地图 API 补充地域信息。',
            ['学术传承图谱', '校友资源对接', '高校科研产出分析'],
            '/api/v1/expert/alumni-relation',
            { expert_name: "赵六" }
        ),
        'paper-coop': createModule(
            'paper-coop',
            '科技专家论文合作关系',
            '亿级论文数据的作者关联与规范化',
            '利用基于 BERT 的实体对齐模型将论文作者与学者标识关联，采用规则引擎清洗重复记录并规范字段格式。',
            ['论文合作网络', '学科交叉分析', '合著倾向研究'],
            '/api/v1/expert/paper-coop',
            { expert_name: "钱七" }
        ),
        'enterprise-relation': createModule(
            'enterprise-relation',
            '重点关注科技企业关系',
            '产学研深度融合的关联数据集构建',
            '从多源采集学者工作经历、专利发明、基金项目数据，利用 BERT 对齐模型关联姓名与唯一标识，生成标准化的多源关联数据集。',
            ['产学研对接', '企业技术顾问挖掘', '技术转移追踪'],
            '/api/v1/expert/enterprise-relation',
            { expert_name: "周八" }
        ),
        'top-n-events': createModule(
            'top-n-events',
            '科技产业链点TOP-N事件',
            '基于语义匹配的高影响力事件识别',
            '利用基于 RoBERTa 的文本分类模型对专利、论文、基金进行分类，结合 Milvus 向量检索实现产业链环节的精准关联。',
            ['产业链风险监控', '技术热点追踪', '重大突破识别'],
            '/api/v1/industry/top-n-events',
            { node_name: "GPU芯片", n: 5 }
        ),
        'industry-panorama': createModule(
            'industry-panorama',
            '科技产业链全景图',
            '多源数据驱动的产业链结构化建模',
            '利用分布式调度框架采集企业、成果、人才、资本数据，通过 BERT 对齐模型实现多模态实体的统一关联与规范化。',
            ['产业布局分析', '供应链安全评估', '投资机会发现'],
            '/api/v1/industry/panorama',
            { industry_name: "人工智能" }
        ),
        'performance-monitor': {
            title: '通用与性能保障',
            desc: '亿级数据自动化同步与任务闭环管理',
            docs: `
                <div class="card">
                    <div class="card-title"><i class="fas fa-shield-alt"></i> 性能与监控方案</div>
                    <p>通过 DolphinScheduler 编排亿级数据源采集任务，利用 Elasticsearch 构建索引实现任务状态可视化监控，配置告警规则形成完整闭环。</p>
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

    function switchModule(moduleId) {
        const module = modules[moduleId] || modules['expert-relation'];
        moduleContent.innerHTML = `
            <div class="module-header">
                <h1>${module.title}</h1>
                <p class="desc">${module.desc}</p>
            </div>
            <div class="tabs" id="main-tabs">
                <div class="tab active" data-tab="docs">技术方案</div>
                ${module.test ? '<div class="tab" data-tab="test">算法测试</div>' : ''}
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
                moduleContent.querySelector('#tab-content').innerHTML = module[tabId];
                if (tabId === 'test') bindTestEvents();
            });
        });
        bindTestEvents();
    }

    function bindTestEvents() {
        const runTestBtn = document.getElementById('run-test');
        const testResult = document.getElementById('test-result');
        const testInput = document.getElementById('test-input');
        const openConfigBtn = document.getElementById('open-config-btn');

        if (runTestBtn) {
            runTestBtn.addEventListener('click', async () => {
                testResult.innerHTML = '<span style="color: #60a5fa;">正在调用分布式算法引擎...</span>';
                try {
                    const path = runTestBtn.getAttribute('data-path');
                    const response = await fetch(path, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: testInput.value
                    });
                    const result = await response.json();
                    testResult.innerHTML = JSON.stringify(result, null, 2);
                } catch (e) {
                    testResult.innerHTML = `<span style="color:#ef4444;">调用失败: ${e.message}</span>`;
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
