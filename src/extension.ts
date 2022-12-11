import * as vscode from 'vscode';
import { execFileSync } from 'child_process';
import { fileSync} from 'tmp';
import { writeFileSync } from 'fs';

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push( vscode.commands.registerCommand('formatyaya-vscode.helloWorld', () => {
		vscode.window.showInformationMessage('cmd');

		const tmpobj = fileSync({ prefix: 'formatyaya-',postfix: '.dic'});
		writeFileSync(tmpobj.name, "func { entity }");

		let formatted = execFileSync(`${__dirname}\\formatyaya.exe`,[tmpobj.name]);
		vscode.window.showInformationMessage('STDOUT'+ formatted.toString());
	}));

	const provideDocumentFormattingEdits = <vscode.DocumentFormattingEditProvider>{
		provideDocumentFormattingEdits: (document: vscode.TextDocument, options: vscode.FormattingOptions) => format(document, null, options)
	};
	context.subscriptions.push(vscode.languages.registerDocumentFormattingEditProvider('aya', provideDocumentFormattingEdits));
}

export function format(document: vscode.TextDocument,range: vscode.Range | null, defaultOptions: vscode.FormattingOptions) {
	if (range === null) {
        range = initDocumentRange(document);
    }

	const sep = __dirname.includes("/") ? "/" : "\\";
	const result: vscode.TextEdit[] = [];
    const content = document.getText(range);

	const tmpobj = fileSync({ prefix: 'formatyaya-',postfix: '.dic'});
	writeFileSync(tmpobj.name, content);

	let formatted : Buffer;
	try {
		formatted = execFileSync(`${__dirname}${sep}formatyaya.exe`,[tmpobj.name]);
	} catch(error) {
		throw(error);
	}

	if (formatted) {
		result.push(new vscode.TextEdit(range, formatted.toString()));
	}

    return result;
}

function initDocumentRange(document: vscode.TextDocument): vscode.Range {
    const lastLine = document.lineCount - 1;
    const start = new vscode.Position(0, 0);
    const end = new vscode.Position(lastLine, document.lineAt(lastLine).text.length);

    return new vscode.Range(start, end);
}

export function deactivate() {}
