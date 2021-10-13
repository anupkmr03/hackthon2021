"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = exports.showNotificationAlert = void 0;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
let activeJob = null;
function showNotificationAlert(message, showExcercisePage, keepItRunningAlways) {
    vscode.window.showInformationMessage(message + ``, {
        modal: true,
    });
    if (showExcercisePage) {
        const panel = vscode.window.createWebviewPanel('eyecare', 'Eye Excercise', vscode.ViewColumn.One, {});
        // And set its HTML content
        panel.webview.html = getWebviewContent();
    }
    if (!keepItRunningAlways) {
        clearInterval(activeJob);
    }
}
exports.showNotificationAlert = showNotificationAlert;
function getWebviewContent() {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Excercise Page</title>
</head>
<body>
    <img src="https://uploads-ssl.webflow.com/5ff8126e9f80b718dc63f907/60ed6b991608b628bd642cb5_How%20to%20Exercise%20Eyes.jpg" width="500" />
</body>
</html>`;
}
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "eyecare" is now active!');
    let notificationMessage = vscode.workspace.getConfiguration().get('eyeCare.notificationMessage') + "";
    let keepItRunningAlways = vscode.workspace.getConfiguration().get('eyeCare.keepItRunningAlways') + "";
    let breakDuration = vscode.workspace.getConfiguration().get('eyeCare.breakDuration') + "";
    let showExcercisePage = vscode.workspace.getConfiguration().get('eyeCare.showExcercisePage') + "";
    var keepItRunningAlwaysBoolValue = (keepItRunningAlways === "true");
    var showExcercisePageBoolValue = (showExcercisePage === "true");
    console.log(notificationMessage + keepItRunningAlways + breakDuration + showExcercisePage);
    console.log("values " + keepItRunningAlwaysBoolValue + " " + showExcercisePageBoolValue);
    if (isNaN(Number(breakDuration))) {
        breakDuration = `20`;
    }
    let breakDurationInMillis = (Number(breakDuration) * 60000);
    activeJob = setInterval(showNotificationAlert.bind(null, notificationMessage, showExcercisePageBoolValue, keepItRunningAlwaysBoolValue), Number(breakDurationInMillis));
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('eyecare.helloWorld', () => {
        // The code you place here will be executed every time your command is executed
        // Display a message box to the user
        vscode.window.showInformationMessage('Default settings for extension Eye Care has been enabled!');
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() {
    clearInterval(activeJob);
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map