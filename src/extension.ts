'use strict';

import * as vscode from 'vscode';
import { normalize } from 'path';
const clipboardy = require('clipboardy');
const opn = require('opn')

import mongodb from './lib/mongodb';
import statusBarItem from './lib/status-bar-item';

export function activate(context: vscode.ExtensionContext) {

    statusBarItem.create({
        text: '$(database) MongoDB',
        command: 'extension.showMenu',
        tooltip: 'MongoDB 数据库未启动，单击启动'
    })

    const showMenuCmd = vscode.commands.registerCommand('extension.showMenu', async () => {
        if (mongodb.mongoDBInstance) {
            const dbPort = await mongodb.mongoDBInstance.getPort();
            const dbPath = await mongodb.mongoDBInstance.getDbPath();
            const pickItems = [
                {
                    id: 0,
                    label: '关闭 MongoDB 数据库',
                    detail: ''
                },
                {
                    id: 1,
                    label: '复制数据库连接 URI',
                    detail: `mongodb://localhost:${dbPort}`
                },
                {
                    id: 2,
                    label: '复制数据库端口号',
                    detail: dbPort + ''
                },
                {
                    id: 3,
                    label: '打开数据库文件所在目录',
                    detail: normalize(dbPath)
                }
            ]
            
            const pickResult = await vscode.window.showQuickPick(pickItems);
            if (pickResult) {
                switch (pickResult.id) {
                    case 0:
                        mongodb.stop();
                        break;
                    case 1:
                        clipboardy.writeSync(`mongodb://localhost:${dbPort}`);
                        break;
                    case 2: 
                        clipboardy.writeSync(dbPort + '');
                        break;
                    case 3:
                        opn(dbPath);
                        break;
                }
            }
        } else {
            mongodb.start();
        }

    });

    const devCmd = vscode.commands.registerCommand('extension.devCommand', async () => {
        vscode.window.withProgress(
            {
                location: vscode.ProgressLocation.Notification,
                title: '测试进度',
                cancellable: true
            },
            (progress, token) => {
                token.onCancellationRequested(() => {
                    console.log('用户取消了操作');
                });

                progress.report({ increment: 0 });

                setTimeout(() => {
                    progress.report({
                        increment: 20,
                        message: "预设进度1"
                    })
                }, 2000);

                setTimeout(() => {
                    progress.report({
                        increment: 50,
                        message: '第二阶段进度'
                    })
                }, 3000);

                setTimeout(() => {
                    progress.report({
                        increment: 30,
                        message: '第三阶段预设进度'
                    })
                }, 5000);

                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        resolve();
                    }, 5000);
                });
            }
        )
    })

    context.subscriptions.push(showMenuCmd, devCmd);

}

export function deactivate() {
}
