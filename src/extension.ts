import * as vscode from "vscode";
import { spawnSync } from "child_process";
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
  const spaceCount = settings.get("spaceCount", 4);
  const showFormatError = settings.get("showFormatError", true);

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

  let options = " ";
  if (useSpace) {
	  options += "-s ";
  }
  options += "-c "+ spaceCount.toString() + " " +tmpobj.name;

  const spawn = spawnSync(path+options, {shell: true});

  tmpobj.removeCallback();

  if (spawn.status === 0) {
	const f = spawn.output.toString().replace(/(^,|,$)/g,"").replace(/\n+$/,""); // spawnSyncで生じるゴミを削除
    result.push(new vscode.TextEdit(range, f));
  } else if (spawn.status === 3 && showFormatError) {
    vscode.window.showErrorMessage(
		`grammer error: 文法が間違っている可能性があります`
    );
  } else {
    vscode.window.showErrorMessage(
		`error status ${spawn.status}: ${spawn.stderr.toString()}`
    );
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
