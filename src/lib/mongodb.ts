'use strict';

import MongoDBMemoryServer from 'mongodb-memory-server';
import { homedir } from 'os';
import { existsSync, mkdirsSync } from 'fs-extra';
import * as vscode from 'vscode';

let statusBarItem: vscode.StatusBarItem;

class MongoDB {

  public mongoDBInstance = null;

  start(options: any = {}) {
    const { port, dbName, dbPath, storageEngine, instanceDebug, binaryVersion, downloadDir, platform, arch, binaryDebug, mongoDebug, autoStart } = options

    let finalDbPath = dbPath || `${homedir()}/.mongodb/data`;
    if (!existsSync(finalDbPath)) {
      mkdirsSync(finalDbPath);
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

    statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
    statusBarItem.command = 'extension.showMenu';
    statusBarItem.text = `$(database) MongoDB`;
    statusBarItem.color = '#69b241';
    statusBarItem.show();
  }

  stop() {
    this.mongoDBInstance.stop();
    this.mongoDBInstance = null;
    statusBarItem.dispose();
  }

  get instance() {
    return this.mongoDBInstance;
  }

}

export default new MongoDB();
