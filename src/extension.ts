import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext): void {
    let disposable: vscode.Disposable = vscode.commands.registerCommand('async-switch.toggle', () => {
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

export function deactivate(): void {
    console.log('async-switch deactivated~');
}
