document.addEventListener('DOMContentLoaded', () => {
    const moduleContent = document.getElementById('module-content');
    const sidebarItems = document.querySelectorAll('.sidebar-nav li');
    const configModal = document.getElementById('config-modal');
    const closeBtns = document.querySelectorAll('.close-btn');

    // 模块数据
    const modules = {
        'expert-relation': {
            title: '科技专家/人才直接关系',
            desc: '基于文献、专利、项目等多元数据的专家合作关系识别与抽取系统。',
            docs: `
                <div class="card">
                    <div class="card-title"><i class="fas fa-info-circle"></i> 功能描述</div>
                    <p>通过配置中心统一管理多源接口与采集规则，从清洗后的文献数据中提取作者列表，采用加权共现算法生成候选关系。结合 BERT 孪生网络进行实体对齐，最终通过 RoBERTa 多分类模型预测合作关系类型（论文、专利、项目等）。</p>
                </div>
                <div class="card">
                    <div class="card-title"><i class="fas fa-layer-group"></i> 算法支撑板块</div>
                    <ul>
                        <li><strong>人才匹配系统</strong>：为企业/项目匹配最合适的专家。</li>
                        <li><strong>知识图谱构建</strong>：自动化构建亿级规模的科技人才图谱。</li>
                        <li><strong>学术社区发现</strong>：识别领域内的领军人才及其团队。</li>
                    </ul>
                </div>
                <div class="card">
                    <div class="card-title"><i class="fas fa-user-tie"></i> 服务对象</div>
                    <div style="display: flex; gap: 20px;">
                        <div style="flex: 1; padding: 15px; background: #f8fafc; border-radius: 8px;">
                            <h4 style="color: #166534;"><i class="fas fa-code"></i> 系统开发人员</h4>
                            <p style="font-size: 0.9rem;">集成 API 接口，构建上层业务应用，查看 API 实例和调用文档。</p>
                        </div>
                        <div style="flex: 1; padding: 15px; background: #f8fafc; border-radius: 8px;">
                            <h4 style="color: #854d0e;"><i class="fas fa-tools"></i> 系统运维人员</h4>
                            <p style="font-size: 0.9rem;">管理算法配置中心，调整权重参数，监控服务性能和采集任务。</p>
                        </div>
                    </div>
                </div>
            `,
            test: `
                <div class="card">
                    <div class="card-title"><i class="fas fa-flask"></i> 在线测试</div>
                    <div class="test-container">
                        <div class="input-panel">
                            <div style="margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center;">
                                <span>输入专家数据 (JSON):</span>
                                <button class="btn-secondary" id="open-config-btn"><i class="fas fa-cog"></i> 参数配置</button>
                            </div>
                            <textarea id="test-input">{
  "expert_name": "张三",
  "institution": "清华大学",
  "target_domain": "人工智能",
  "min_confidence": 0.8
}</textarea>
                            <button class="btn-accent" style="margin-top: 15px; width: 100%;" id="run-test">执行测试</button>
                        </div>
                        <div class="output-panel">
                            <div style="margin-bottom: 10px;">输出结果:</div>
                            <div class="result-panel" id="test-result">// 运行测试以查看结果...</div>
                        </div>
                    </div>
                </div>
            `,
            api: `
                <div class="card">
                    <div class="card-title"><i class="fas fa-plug"></i> API 接口 (对外服务)</div>
                    <p><strong>Endpoint:</strong> <code>POST /api/v1/expert/direct-relation</code></p>
                    <div style="margin-top: 15px;">
                        <div class="tabs" style="margin-bottom: 15px;">
                            <div class="tab active">Python</div>
                            <div class="tab">Node.js</div>
                            <div class="tab">cURL</div>
                        </div>
                        <pre><code>import requests

url = "http://localhost:3001/api/v1/expert/direct-relation"
payload = {
    "expert_name": "张三",
    "target_domain": "人工智能"
}
headers = {"Content-Type": "application/json"}

response = requests.post(url, json=payload, headers=headers)
print(response.json())</code></pre>
                    </div>
                </div>
            `
        },
        'config-center': {
            title: '配置中心 (算法管理界面)',
            desc: '统一管理算法参数、采集规则和多源接口映射。',
            docs: `
                <div class="card">
                    <div class="card-title"><i class="fas fa-sliders-h"></i> 算法参数管理</div>
                    <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                        <thead style="background: #f1f5f9; text-align: left;">
                            <tr>
                                <th style="padding: 12px;">算法名称</th>
                                <th style="padding: 12px;">当前版本</th>
                                <th style="padding: 12px;">核心参数</th>
                                <th style="padding: 12px;">操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style="border-bottom: 1px solid #e2e8f0;">
                                <td style="padding: 12px;">加权共现算法</td>
                                <td style="padding: 12px;">v2.1.0</td>
                                <td style="padding: 12px;">w_first=0.8, w_corr=0.9</td>
                                <td style="padding: 12px;"><button class="btn-primary" style="padding: 4px 12px;">编辑</button></td>
                            </tr>
                            <tr style="border-bottom: 1px solid #e2e8f0;">
                                <td style="padding: 12px;">RoBERTa 多分类</td>
                                <td style="padding: 12px;">v1.5.4</td>
                                <td style="padding: 12px;">threshold=0.85</td>
                                <td style="padding: 12px;"><button class="btn-primary" style="padding: 4px 12px;">编辑</button></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="card">
                    <div class="card-title"><i class="fas fa-database"></i> 采集规则管理</div>
                    <div style="padding: 15px; border: 1px dashed #cbd5e1; border-radius: 6px;">
                        <p style="color: #64748b; font-size: 0.9rem;">通过决策树结构存储合作类型分类规则...</p>
                        <button class="btn-secondary" style="margin-top: 10px;">查看规则决策树</button>
                    </div>
                </div>
            `,
            test: '',
            api: ''
        }
    };

    // 切换模块
    function switchModule(moduleId) {
        const module = modules[moduleId] || modules['expert-relation'];
        
        let html = `
            <div class="module-header">
                <h1>${module.title}</h1>
                <p class="desc">${module.desc}</p>
            </div>
            <div class="tabs" id="main-tabs">
                <div class="tab active" data-tab="docs">功能文档</div>
                ${module.test ? '<div class="tab" data-tab="test">在线测试</div>' : ''}
                ${module.api ? '<div class="tab" data-tab="api">API 实例</div>' : ''}
            </div>
            <div id="tab-content">
                ${module.docs}
            </div>
        `;
        
        moduleContent.innerHTML = html;

        // 重新绑定标签页点击事件
        const tabs = document.querySelectorAll('#main-tabs .tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                const tabId = tab.getAttribute('data-tab');
                moduleContent.querySelector('#tab-content').innerHTML = module[tabId];
                
                // 如果切换到测试页，绑定测试按钮
                if (tabId === 'test') {
                    bindTestEvents();
                }
            });
        });

        // 绑定测试事件（默认显示 docs，如果直接切换模块也需要绑定）
        bindTestEvents();
    }

    function bindTestEvents() {
        const runTestBtn = document.getElementById('run-test');
        const openConfigBtn = document.getElementById('open-config-btn');
        const testResult = document.getElementById('test-result');
        const testInput = document.getElementById('test-input');

        if (runTestBtn) {
            runTestBtn.addEventListener('click', async () => {
                testResult.innerHTML = '<span style="color: #60a5fa;">正在调用 Node.js 算法引擎...</span>';
                
                try {
                    const inputData = JSON.parse(testInput.value);
                    const response = await fetch('/api/v1/expert/direct-relation', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(inputData)
                    });
                    
                    const result = await response.json();
                    testResult.innerHTML = JSON.stringify(result, null, 2);
                } catch (error) {
                    testResult.innerHTML = `<span style="color: #ef4444;">请求失败: ${error.message}</span>`;
                }
            });
        }

        if (openConfigBtn) {
            openConfigBtn.addEventListener('click', () => {
                configModal.style.display = 'block';
            });
        }
    }

    // 侧边栏点击
    sidebarItems.forEach(item => {
        item.addEventListener('click', () => {
            sidebarItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            switchModule(item.getAttribute('data-module'));
        });
    });

    // 关闭弹窗
    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            configModal.style.display = 'none';
        });
    });

    // 滑动条值更新
    document.querySelectorAll('input[type="range"]').forEach(range => {
        range.addEventListener('input', (e) => {
            e.target.nextElementSibling.textContent = e.target.value;
        });
    });

    // 初始化显示第一个模块
    switchModule('expert-relation');
});
