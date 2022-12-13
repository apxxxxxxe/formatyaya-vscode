import * as vscode from "vscode";
import { execFileSync } from "child_process";
import { fileSync } from "tmp";
import { writeFileSync, existsSync } from "fs";
import { platform, arch } from "process";

const isNotSupported = "ISNOTSUPPORTED";

export function activate(context: vscode.ExtensionContext) {
  const provideDocumentFormattingEdits = <
    vscode.DocumentFormattingEditProvider
  >{
    provideDocumentFormattingEdits: (document: vscode.TextDocument) =>
      format(document, null),
  };
  context.subscriptions.push(
    vscode.languages.registerDocumentFormattingEditProvider(
      "aya",
      provideDocumentFormattingEdits
    )
  );
}

export function format(
  document: vscode.TextDocument,
  range: vscode.Range | null
) {
  const cmd = getCmdName();
  if (cmd === isNotSupported) {
    vscode.window.showErrorMessage(
      "Currently, formatyaya-vscode is only supported on Windows and Linux."
    );
    return [];
  }

  if (range === null) {
    range = initDocumentRange(document);
  }

  const settings = vscode.workspace.getConfiguration("formatyaya-vscode");
  const useSpace = settings.get("useSpace", false);
  const spaceCount = settings.get("spaceCount", 2);

  const sep = __dirname.includes("/") ? "/" : "\\";
  const result: vscode.TextEdit[] = [];
  const content = document.getText(range);

  const tmpobj = fileSync({ prefix: "formatyaya-", postfix: ".dic" });
  writeFileSync(tmpobj.name, content);

  const path = `${__dirname}${sep}${cmd}`;
  if (!existsSync( path )) {
    vscode.window.showErrorMessage(
		`${path} not found.`
    );
	return [];
  }

  let formatted: Buffer;
  try {
    const options: string[] = [];
    if (useSpace) {
      options.push("-s");
    }
    options.push("-c", spaceCount.toString(), tmpobj.name);

    formatted = execFileSync(path, options);
  } catch (error) {
    throw error;
  }

  tmpobj.removeCallback();

  if (formatted) {
	const f = formatted.toString().replace(/\n+$/,""); // execFileSyncで生じる末尾の改行を削除
    result.push(new vscode.TextEdit(range, f));
  }

  return result;
}

function getCmdName(): string {
  let name = "formatyaya_";
  let ext = "";
  switch (platform.toString()) {
    case "win32":
      name += "windows_";
      ext = ".exe";
      break;
    case "linux":
      name += "linux_";
      break;
    default:
      console.log(platform.toString());
      return isNotSupported;
  }

  switch (arch.toString()) {
    case "x64":
      name += "amd64";
      break;
    case "arm":
      name += "arm";
      break;
    case "arm64":
      name += "arm64";
      break;
    default:
      console.log(arch.toString());
      return isNotSupported;
  }

  return name + ext;
}

function initDocumentRange(document: vscode.TextDocument): vscode.Range {
  const lastLine = document.lineCount - 1;
  const start = new vscode.Position(0, 0);
  const end = new vscode.Position(
    lastLine,
    document.lineAt(lastLine).text.length
  );

  return new vscode.Range(start, end);
}

export function deactivate() {}
