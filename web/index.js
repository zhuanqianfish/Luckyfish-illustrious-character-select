class CharacterSearch {
    constructor() {
        this.zhTWData = {};
        this.outputData = [];
        this.currentCharacter = null;
        this.debounceTimer = null;
        this.init();
    }

    async init() {
        await this.loadData();
        this.bindEvents();
        this.showInitialMessage();
    }

    // 修改第22-25行的文件路径
    async loadData() {
        try {
            // 根据系统语言选择加载的文件，默认zh_CN.json
            const userLanguage = navigator.language || navigator.userLanguage;
            const isTraditionalChinese = userLanguage === 'zh-TW' || userLanguage === 'zh-HK' || userLanguage === 'zh-MO';
            const dataFile = isTraditionalChinese ? './zh_TW.json' : './zh_CN.json';
            
            console.log(`检测到系统语言: ${userLanguage}, 加载文件: ${dataFile}`);
            
            // 立即加载中文翻译数据
            const zhResponse = await fetch(dataFile);
            this.zhTWData = await zhResponse.json();
            
            // 异步加载图片数据
            this.loadImageDataAsync();
        } catch (error) {
            console.error('加载数据失败:', error);
            this.showError('加载数据失败，请检查文件路径');
        }
    }

    async loadImageDataAsync() {
        try {
            const loadPromises = [];
            for (let i = 1; i <= 10; i++) {
                loadPromises.push(this.loadImageFile(i));
            }
            
            await Promise.allSettled(loadPromises);
            this.showLoadingStatus();
        } catch (error) {
            console.warn('部分图片数据加载失败:', error);
        }
    }

    // 修改第47行的图片数据文件路径
    async loadImageFile(index) {
        try {
            const response = await fetch(`./output_${index}.json`);
            const data = await response.json();
            this.outputData = this.outputData.concat(data);
        } catch (error) {
            console.warn(`无法加载output_${index}.json:`, error);
        }
    }

    showLoadingStatus() {
        const status = document.getElementById('loadingStatus');
        if (status) {
            status.classList.remove('d-none');
        }
    }

    bindEvents() {
        const searchInput = document.getElementById('searchInput');
        const searchBtn = document.getElementById('searchBtn');

        searchInput.addEventListener('input', (e) => {
            if (e.target.value.trim()) {
                this.debounceSearch(e.target.value);
            } else {
                this.showInitialMessage();
            }
        });

        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.searchCharacters(e.target.value);
            }
        });

        searchBtn.addEventListener('click', () => {
            const query = searchInput.value.trim();
            if (query) {
                this.searchCharacters(query);
            }
        });
    }

    debounceSearch(query) {
        clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(() => {
            this.searchCharacters(query);
        }, 300);
    }

    searchCharacters(query) {
        if (!query.trim()) {
            this.showInitialMessage();
            return;
        }

        const results = this.performSearch(query);
        this.displayResults(results, query);
    }

    performSearch(query) {
        const results = [];
        const lowercaseQuery = query.toLowerCase();

        for (const [chineseName, englishPrompt] of Object.entries(this.zhTWData)) {
            // 搜索中文名或英文提示词
            if (chineseName.toLowerCase().includes(lowercaseQuery) || 
                englishPrompt.toLowerCase().includes(lowercaseQuery)) {
                results.push({
                    chineseName: chineseName,
                    englishPrompt: englishPrompt,
                    image: this.findImageForCharacter(englishPrompt) // 使用英文提示词作为键名
                });
            }
        }

        return results;
    }

    findImageForCharacter(englishPrompt) {
        for (const item of this.outputData) {
            if (item[englishPrompt]) {
                return item[englishPrompt];
            }
        }
        return null;
    }

    displayResults(results, query) {
        const container = document.getElementById('resultsContainer');
        
        if (results.length === 0) {
            container.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search-minus fa-2x mb-3 text-muted"></i>
                    <p>未找到与 "${query}" 相关的角色</p>
                </div>
            `;
            return;
        }

        container.innerHTML = results.map((result, index) => `
            <div class="character-item fade-in" data-index="${index}" data-character="${result.chineseName}">
                <div class="character-name">${this.highlightMatch(result.chineseName, query)}</div>
                <div class="character-prompt">${result.englishPrompt}</div>
            </div>
        `).join('');

        container.querySelectorAll('.character-item').forEach(item => {
            item.addEventListener('click', (e) => {
                this.selectCharacter(e.currentTarget);
            });
        });
    }

    selectCharacter(element) {
        document.querySelectorAll('.character-item').forEach(item => {
            item.classList.remove('active');
        });

        element.classList.add('active');
        const characterName = element.dataset.character;
        
        // 获取英文提示词并复制到剪贴板
        const englishPrompt = this.zhTWData[characterName];
        if (englishPrompt) {
            navigator.clipboard.writeText(englishPrompt)
                .then(() => {
                    // 显示复制成功提示
                    this.showCopySuccess(englishPrompt);
                })
                .catch(err => {
                    console.error('复制失败:', err);
                    // 降级方案：使用传统方法复制
                    this.fallbackCopyToClipboard(englishPrompt);
                });
        }
        
        this.displayCharacter(characterName);
    }

    showCopySuccess(text) {
        // 创建临时提示元素
        const toast = document.createElement('div');
        toast.className = 'copy-toast';
        toast.innerHTML = `
            <div class="toast-content">
                <i class="fas fa-check-circle text-success"></i>
                <span>已复制到剪贴板: ${text.substring(0, 50)}${text.length > 50 ? '...' : ''}</span>
            </div>
        `;
        
        document.body.appendChild(toast);
        
        // 2秒后移除提示
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 2000);
    }

    fallbackCopyToClipboard(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        textArea.select();
        
        try {
            document.execCommand('copy');
            this.showCopySuccess(text);
        } catch (err) {
            console.error('复制失败:', err);
        }
        
        document.body.removeChild(textArea);
    }

    displayCharacter(characterName) {
        const characterData = {
            chineseName: characterName,
            englishPrompt: this.zhTWData[characterName],
            image: this.findImageForCharacter(this.zhTWData[characterName]) // 使用英文提示词作为键名
        };
        this.displayImage(characterData);
    }

    displayImage(characterData) {
        const container = document.getElementById('rightImageContainer');
        
        if (!characterData.image) {
            container.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-image fa-2x mb-3 text-muted"></i>
                    <p>未找到 ${characterData.chineseName} 的预览图片</p>
                </div>
            `;
            return;
        }

        container.innerHTML = `
            <div class="fade-in">
                <img src="${characterData.image}" 
                     alt="${characterData.chineseName}" 
                     class="img-fluid">
            </div>
        `;
    }

    highlightMatch(text, query) {
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<span class="highlight">$1</span>');
    }

    showInitialMessage() {
        const container = document.getElementById('resultsContainer');
        container.innerHTML = `
            <div class="loading">
                <i class="fas fa-search fa-2x mb-3 text-muted"></i>
                <p>请输入角色名称开始搜索</p>
            </div>
        `;
        
        // 重置右侧图片容器
        const rightContainer = document.getElementById('rightImageContainer');
        rightContainer.innerHTML = `
            <div class="no-results">
                <i class="fas fa-image fa-2x mb-3 text-muted"></i>
                <p>请选择角色查看预览图</p>
            </div>
        `;
    }

    showError(message) {
        const container = document.getElementById('resultsContainer');
        container.innerHTML = `
            <div class="no-results">
                <i class="fas fa-exclamation-triangle fa-2x mb-3 text-danger"></i>
                <p>${message}</p>
            </div>
        `;
    }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    new CharacterSearch();
});