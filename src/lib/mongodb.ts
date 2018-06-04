'use strict';

import MongoDBMemoryServer from 'mongodb-memory-server';
import { homedir } from 'os';
import * as vscode from 'vscode';
import * as path from 'path';
const fs = require('fs-extra');

import statusBarItem from './status-bar-item';

class MongoDB {

  mongoDBInstance = null;
  lockFilePath = path.resolve(__dirname, '../../mongod-lock');

  start(options: any = {}) {
    const { port, dbName, dbPath, storageEngine, instanceDebug, binaryVersion, downloadDir, platform, arch, binaryDebug, mongoDebug, autoStart } = options

    let finalDbPath = dbPath || `${homedir()}/.mongodb/data`;
    if (!fs.existsSync(finalDbPath)) {
      fs.mkdirsSync(finalDbPath);
    }

    const mongod = new MongoDBMemoryServer({
      instance: {
        port: parseInt(port) || 27017,
        dbName: dbName || 'db',
        dbPath: finalDbPath,
        storageEngine,
        debug: instanceDebug || false
      },
      binary: {
        version: binaryVersion,
        downloadDir: downloadDir || `${homedir()}/.mongodb/binaries`,
        platform,
        arch,
        debug: binaryDebug
      },
      debug: mongoDebug,
      autoStart
    });

    mongod.start();

    this.mongoDBInstance = mongod;

    statusBarItem.update({
      text: '$(database) MongoDB',
      command: 'extension.showMenu',
      color: '#69b241',
      tooltip: 'MongoDB 数据库已启动, 单击以查看选项'
    });

    this.updateRunningStatus(true);
  }

  stop() {
    this.mongoDBInstance.stop();
    this.mongoDBInstance = null;
    statusBarItem.update({
      text: '$(database) MongoDB',
      command: 'extension.showMenu',
      tooltip: 'MongoDB 数据库未启动，单击启动'
    });

    this.updateRunningStatus(false);
  }

  get instance() {
    return this.mongoDBInstance;
  }

  get runningStatus() {
    return fs.existsSync(this.lockFilePath);
  }

  updateRunningStatus(status) {
    if (status) {
      fs.writeFileSync(this.lockFilePath, '');
      return true;
    }
    fs.unlinkSync(this.lockFilePath);
    return false;
  }

}

export default new MongoDB();
