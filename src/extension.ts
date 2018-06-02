'use strict';

import * as vscode from 'vscode';
import mongodb from './lib/mongodb';
import { normalize } from 'path';

export function activate(context: vscode.ExtensionContext) {

    const showMenuCmd = vscode.commands.registerCommand('extension.showMenu', async () => {
        let pickItems = [
            {
                type: 0,
                id: 0,
                label: '开启 MongoDB 数据库',
                detail: ''
            }
        ];
        if (mongodb.mongoDBInstance) {
            const dbPort = await mongodb.mongoDBInstance.getPort();
            const dbPath = await mongodb.mongoDBInstance.getDbPath();
            pickItems = [
                {
                    type: 1,
                    id: 0,
                    label: '关闭 MongoDB 数据库',
                    detail: ''
                },
                {
                    type: 1,
                    id: 1,
                    label: '复制数据库连接 URI',
                    detail: `mongodb://localhost:${dbPort}`
                },
                {
                    type: 1,
                    id: 2,
                    label: '复制数据库端口号',
                    detail: dbPort + ''
                },
                {
                    type: 1,
                    id: 3,
                    label: '打开数据库文件所在目录',
                    detail: normalize(dbPath)
                }
            ]
        }

        const pickResult = await vscode.window.showQuickPick(pickItems);

        if (pickResult) {
            if (pickResult.type) {
                switch (pickResult.id) {
                    case 0:
                        mongodb.stop();
                        break;
                    case 1:
                        console.log('复制dbUri');
                        break;
                    case 2: 
                        console.log('端口号');
                        break;
                    case 3:
                        console.log('文件路径');
                        break;
                    case 4:
                        console.log('名称');
                        break;
                }
            } else {
                mongodb.start();
            }
        }
    });

    context.subscriptions.push(showMenuCmd);

}

export function deactivate() {
}