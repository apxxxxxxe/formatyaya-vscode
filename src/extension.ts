import * as vscode from 'vscode';
import { execFileSync } from 'child_process';
import { fileSync} from 'tmp';
import { writeFileSync } from 'fs';

export function activate(context: vscode.ExtensionContext) {
	const provideDocumentFormattingEdits = <vscode.DocumentFormattingEditProvider>{
		provideDocumentFormattingEdits: (document: vscode.TextDocument) => format(document, null)
	};
	context.subscriptions.push(vscode.languages.registerDocumentFormattingEditProvider('aya', provideDocumentFormattingEdits));
}

export function format(document: vscode.TextDocument,range: vscode.Range | null) {
	if (range === null) {
        range = initDocumentRange(document);
    }

	const settings = vscode.workspace.getConfiguration('formate');
	const useSpace = settings.get('useSpace',false);
	const spaceCount = settings.get('spaceCount', 2);

	const sep = __dirname.includes("/") ? "/" : "\\";
	const result: vscode.TextEdit[] = [];
    const content = document.getText(range);

	const tmpobj = fileSync({ prefix: 'formatyaya-',postfix: '.dic'});
	writeFileSync(tmpobj.name, content);

	let formatted : Buffer;
	try {
		const options :string[] = [];
		if (useSpace) {
			options.push("-s");
		}
		options.push("-c",spaceCount.toString(),tmpobj.name);

		formatted = execFileSync(`${__dirname}${sep}formatyaya.exe`,options);
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
