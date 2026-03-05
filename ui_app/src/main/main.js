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
      const tomlPath = process.argv[process.argv.indexOf('--Toml') + 1];
      
      if (!gcodePath || !tomlPath) throw new Error('参数缺失');

      const startTime = Date.now();
      const processedGcode = processGcode(gcodePath, tomlPath);
      
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