import * as vscode from 'vscode';

class ExtStatusBarItem {

  statusBarItem: vscode.StatusBarItem;

  /**
   * 创建状态栏项目实例
   * @param options 选项
   */
  create(options: { text: string, color?: string, command?: string, tooltip?: string }) {
    const { color, command, text, tooltip } = options;
    this.statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
    this.statusBarItem.command = command;
    this.statusBarItem.text = text;
    this.statusBarItem.color = color;
    this.statusBarItem.tooltip = tooltip;
    this.show();
  }

  /**
   * 更新状态栏项目实例
   * @param options 选项
   */
  update(options: { text: string, color?: string, command?: string, tooltip?: string }) {
    this.dispose();
    this.create(options);
  }

  /**
   * 释放状态栏项目实例
   */
  dispose() {
    this.statusBarItem.dispose();
  }

  /**
   * 隐藏状态栏项目
   */
  hide() {
    this.statusBarItem.hide();
  }

  /**
   * 显示状态栏项目
   */
  show() {
    this.statusBarItem.show();
  }

}

export default new ExtStatusBarItem();
