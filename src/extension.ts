'use strict';

import * as vscode from 'vscode';
import { normalize } from 'path';
const Raven = require('raven');
const clipboardy = require('clipboardy');
const opn = require('opn');

import mongodb from './lib/mongodb';
import statusBarItem from './lib/status-bar-item';

Raven
    .config(
        'http://b257f70b9f594d33a4992a1157f59b77:e83eb4c398434d92807f3db0ff52b2e4@sentry.jser.club:2018/8',
        {
            release: 'v0.0.1 dev'
        }
    )
    .install();

export function activate(context: vscode.ExtensionContext) {

    try {
        statusBarItem.create({
            text: '$(database) MongoDB',
            command: 'extension.showMenu',
            tooltip: 'MongoDB 数据库未启动，单击启动'
        })

        if (mongodb.runningStatus) {
            mongodb.start();
        }

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

        context.subscriptions.push(showMenuCmd);
    } catch (error) {
        Raven.captureException(error);
    }

}

export function deactivate() {
}
