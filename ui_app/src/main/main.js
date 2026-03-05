const { app, BrowserWindow, Notification, ipcMain, nativeTheme } = require('electron'); // 必须全部引入
const path = require('path');
const fs = require('fs');
const { processGcode } = require('./mkp_engine');

const isCliMode = process.argv.includes('--Gcode');

if (isCliMode) {
  // ==========================================
  // 🌚 隐性人格：CLI 后台处理模式
  // ==========================================
  if (app.dock) app.dock.hide();

  app.whenReady().then(() => {
    try {
      const gcodePath = process.argv[process.argv.indexOf('--Gcode') + 1];
      const jsonPath = process.argv[process.argv.indexOf('--Json') + 1];
      
      if (!gcodePath || !jsonPath) throw new Error('参数缺失');

      const startTime = Date.now();
      const processedGcode = processGcode(gcodePath, jsonPath);
      
      const outputPath = gcodePath.replace('.gcode', '_processed.gcode');
      fs.writeFileSync(outputPath, processedGcode);
      
      const costTime = ((Date.now() - startTime) / 1000).toFixed(2);

      if (Notification.isSupported()) {
        new Notification({
          title: 'MKP Support',
          body: `✅ 涂胶路径已注入！(耗时: ${costTime}s)\n文件: ${path.basename(outputPath)}`,
          silent: true
        }).show();
      }
      
      setTimeout(() => app.quit(), 3000);
    } catch (error) {
      if (Notification.isSupported()) {
        new Notification({ title: 'MKP 处理失败', body: `❌ ${error.message}` }).show();
      }
      setTimeout(() => app.quit(), 5000);
    }
  });

} else {
  // ==========================================
  // 🌞 显性人格：正常 GUI 界面
  // ==========================================
  
  // 监听前端的系统数据请求
  ipcMain.handle('get-userdata-path', () => {
    return path.join(app.getPath('userData'), 'Presets'); 
  });

  function createWindow() {
    const mainWindow = new BrowserWindow({
      width: 920,
      height: 630,      // 加上 30px 补偿
      minWidth: 920,
      minHeight: 630,   // 加上 30px 补偿
      useContentSize: false, // 彻底关掉内容计算，解决 580px 挤压 bug
      autoHideMenuBar: true, // 隐藏菜单栏
      webPreferences: {
        preload: path.join(__dirname, '../../preload.js'),
        contextIsolation: true
      }
    });

    //mainWindow.removeMenu();
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  }

  app.whenReady().then(() => {
    // 监听前端发来的主题切换消息
    ipcMain.on('set-native-theme', (event, mode) => {
      nativeTheme.themeSource = mode;
    });

    createWindow();

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
  });

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
  });
}

// 1. 读取 JSON 预设
  ipcMain.handle('read-preset', async (event, filePath) => {
    try {
      if (!fs.existsSync(filePath)) return { success: false, error: '文件不存在' };
      const content = fs.readFileSync(filePath, 'utf-8');
      return { success: true, data: JSON.parse(content) }; // 原生秒解
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  // 2. 写入 JSON 预设 (极其简单，绝对不会丢数据)
  ipcMain.handle('write-preset', async (event, filePath, updates) => {
    try {
      if (!fs.existsSync(filePath)) return { success: false, error: '文件不存在' };
      
      // 先读出现有数据
      const content = fs.readFileSync(filePath, 'utf-8');
      let data = JSON.parse(content);

      // 深度合并更新的数据 (例如把新的 x 偏移塞进去)
      // 假设前端传来的 updates 是 { toolhead: { offset: { x: 0.5 } } }
      data = mergeDeep(data, updates); // (这里可以用一个简单的合并函数)

      // 原生完美写回，带有 2 个空格的美化缩进
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  // 简单的深度合并函数
  function mergeDeep(target, source) {
    for (const key in source) {
      if (source[key] instanceof Object && key in target) {
        mergeDeep(target[key], source[key]);
      } else {
        target[key] = source[key];
      }
    }
    return target;
  }
