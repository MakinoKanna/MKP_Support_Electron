// 主题与暗黑模式管理

// ==================== 外观主题三态控制系统 (带圆形扩散动画) ====================
let currentThemeMode = document.documentElement.getAttribute('data-theme-mode') || 'light';

// 初始化主题
function initTheme() {
  const savedMode = localStorage.getItem('themeMode') || 'light';
  setThemeMode(savedMode, null);
}

// 1. 卡片点击分发器
function setThemeMode(mode, event) {
  if (currentThemeMode === mode) return; // 如果已经是该模式，不触发动画
  
  currentThemeMode = mode;
  // 保存主题设置
  localStorage.setItem('themeMode', mode);
  // 判断最终是要渲染暗色还是亮色
  const isDark = mode === 'dark' || (mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  
  executeThemeTransition(mode, isDark, event);
}

// 2. 侧边栏按钮逻辑
function toggleDarkMode(event) {
  const isDark = document.documentElement.classList.contains('dark');
  setThemeMode(isDark ? 'light' : 'dark', event);
}

// 3. 核心动画执行器
function executeThemeTransition(mode, isDark, event) {
  const html = document.documentElement;

  // 将所有的 DOM 修改打包在一起
  const applyDOMChanges = () => {
    html.setAttribute('data-theme-mode', mode);
    html.classList.toggle('dark', isDark);

    // 顺手切换侧边栏的太阳/月亮图标
    const icon = document.querySelector('.dark-icon-sun path');
    if (icon) {
      if (isDark) {
         icon.setAttribute('d', 'M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z');
      } else {
         icon.setAttribute('d', 'M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-2.25l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z');
      }
    }

    // 通知 Electron 主进程同步修改原生窗口标题栏
    if (window.mkpAPI && window.mkpAPI.setNativeTheme) {
          window.mkpAPI.setNativeTheme(mode);
        }
  };

  // 如果浏览器/Electron版本过低不支持该 API，直接切换无动画
  if (!document.startViewTransition) {
    applyDOMChanges();
    return;
  }

  // 智能获取扩散圆心坐标：优先使用鼠标点击位置，如果没拿到 event，则从屏幕正中心扩散
  const x = (event && event.clientX !== undefined) ? event.clientX : window.innerWidth / 2;
  const y = (event && event.clientY !== undefined) ? event.clientY : window.innerHeight / 2;
  
  // 计算圆心到屏幕最远角落的距离，作为圆的最终半径
  const endRadius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));

  // 启动视图过渡 API
  const transition = document.startViewTransition(() => {
    applyDOMChanges();
  });

  // 注入我们自定义的 CSS 动画参数
  transition.ready.then(() => {
    document.documentElement.animate(
      { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`] },
      {
        duration: 400, // 动画持续时间 400ms，你可以自己微调
        easing: "ease-out",
        pseudoElement: "::view-transition-new(root)"
      }
    );
  });
}

// 4. 监听操作系统级别的夜间模式自动切换
function initSystemThemeListener() {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (currentThemeMode === 'system') {
      // 系统自动切换时没鼠标坐标，传 null，从屏幕中心扩散
      executeThemeTransition('system', e.matches, null);
    }
  });
}

// 设置版本主题色
function setVersionTheme(version, textHex, bgHex) {
  const root = document.documentElement;
  root.style.setProperty(`--theme-${version}-text`, textHex);
  root.style.setProperty(`--theme-${version}-bg`, bgHex);
  
  // 如果当前选中的版本就是修改的版本，更新侧边栏徽章
  if (window.selectedVersion === version) {
    updateSidebarVersionBadge(version);
  }
}

// 导出函数
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { initTheme, setThemeMode, toggleDarkMode, setVersionTheme, initSystemThemeListener };
}
