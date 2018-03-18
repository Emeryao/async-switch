'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
// import * as ts from 'typescript';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext): void {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "async-switch" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable: vscode.Disposable = vscode.commands.registerCommand('async-switch.toggle', () => {
        // The code you place here will be executed every time your command is executed
        if (vscode.window.activeTextEditor) {
            let targetLine: string = '';
            if (vscode.window.activeTextEditor.document.languageId == 'typescript' || vscode.window.activeTextEditor.document.languageId == 'javascript') {
                let currentLine: string = vscode.window.activeTextEditor.document.lineAt(vscode.window.activeTextEditor.selection.start.line).text;
                let matches: RegExpMatchArray | null = currentLine.match(/^([^\(]+)/);
                if (matches && matches.length >= 1) {
                    let prefix: string = matches[0];
                    if (prefix.indexOf('async ') >= 0) {
                        targetLine = currentLine.replace('async ', '');
                        let returnType: string = currentLine.substr(currentLine.lastIndexOf(': '));
                        let targetReturn: string = returnType.replace('Promise<', '').replace('>', '');
                        targetLine = `${targetLine.substring(0, targetLine.lastIndexOf(': '))}${targetReturn}`;
                    } else {
                        if (currentLine.indexOf('function ') >= 0) {
                            targetLine = currentLine.replace('function ', 'async function ');
                        }
                        if (currentLine.indexOf('private ') >= 0) {
                            targetLine = currentLine.replace('private ', 'private async ');
                        }
                        if (currentLine.indexOf('public ') >= 0) {
                            targetLine = currentLine.replace('public ', 'public async ');
                        }
                        let returnType: string = currentLine.substring(currentLine.lastIndexOf(': ') + 2, currentLine.indexOf(' {'));
                        let targetReturn: string = `Promise<${returnType}>`;
                        targetLine = `${targetLine.substring(0, targetLine.lastIndexOf(': ') + 2)}${targetReturn} {`;
                    }
                }
            }
            if (targetLine) {
                vscode.window.activeTextEditor.edit(builder => {
                    if (vscode.window.activeTextEditor) {
                        builder.replace(vscode.window.activeTextEditor.document.lineAt(vscode.window.activeTextEditor.selection.start.line).range, targetLine);
                    }
                });
            }
        }
    });

    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate(): void {
    console.log('async-switch deactivated~');
}
