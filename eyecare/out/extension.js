"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = exports.showNotificationAlert = void 0;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
let activeJob = null;
function showNotificationAlert(message, showExcercisePage, keepItRunningAlways) {
    vscode.window
        .showInformationMessage(message + ``, {
        modal: true,
    }, ...["Ok"])
        .then(selection => {
        if (selection === "Ok") {
            const panel = vscode.window.createWebviewPanel('eyecare', 'Blink your eyes', vscode.ViewColumn.One, { enableScripts: true });
            panel.webview.html = getWebviewContent();
            const timeout = setTimeout(() => panel.dispose(), 21000);
            panel.onDidDispose(() => {
                clearTimeout(timeout);
            }, null);
        }
    });
    if (showExcercisePage) {
        //TODO
    }
    if (!keepItRunningAlways) {
        clearInterval(activeJob);
    }
}
exports.showNotificationAlert = showNotificationAlert;
function getWebviewContent() {
    return `

<!DOCTYPE html>
<html lang="en" >
<head>
  <meta charset="UTF-8">
  <title>CodePen - JS Countdown Timer</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/5.0.0/normalize.min.css">
  
<style type="text/css">
  
      body {
      font-family: sans-serif;
      display: grid;
      height: 100vh;
      place-items: center;
    }

    .base-timer {
      position: relative;
      width: 300px;
      height: 300px;
    }

    .base-timer__svg {
      transform: scaleX(-1);
    }

    .base-timer__circle {
      fill: none;
      stroke: none;
    }

    .base-timer__path-elapsed {
      stroke-width: 7px;
      stroke: grey;
    }

    .base-timer__path-remaining {
      stroke-width: 7px;
      stroke-linecap: round;
      transform: rotate(90deg);
      transform-origin: center;
      transition: 1s linear all;
      fill-rule: nonzero;
      stroke: currentColor;
    }

    .base-timer__path-remaining.green {
      color: orange;
    }

    .base-timer__path-remaining.orange {
      color: orange;
    }

    .base-timer__path-remaining.red {
      color: rgb(65, 184, 131);
    }

    .base-timer__label {
      position: absolute;
      width: 300px;
      height: 300px;
      top: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 48px;
    }
</style>
</head>
<body>
<!-- partial:index.partial.html -->
<div id="app"></div>
<h1> Please blink your eyes for 20 Seconds</h1>
<!-- partial -->
  <script type="text/javascript">
      // Credit: Mateusz Rybczonec

      const FULL_DASH_ARRAY = 283;
      const WARNING_THRESHOLD = 10;
      const ALERT_THRESHOLD = 5;

      const COLOR_CODES = {
        info: {
          color: "green"
        },
        warning: {
          color: "orange",
          threshold: WARNING_THRESHOLD
        },
        alert: {
          color: "red",
          threshold: ALERT_THRESHOLD
        }
      };

      const TIME_LIMIT = 20;
      let timePassed = 0;
      let timeLeft = TIME_LIMIT;
      let timerInterval = null;
      let remainingPathColor = COLOR_CODES.info.color;

      document.getElementById("app").innerHTML = \`
      <div class="base-timer">
        <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <g class="base-timer__circle">
            <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
            <path
              id="base-timer-path-remaining"
              stroke-dasharray="283"
              class="base-timer__path-remaining \${remainingPathColor}"
              d="
                M 50, 50
                m -45, 0
                a 45,45 0 1,0 90,0
                a 45,45 0 1,0 -90,0
              "
            ></path>
          </g>
        </svg>
        <span id="base-timer-label" class="base-timer__label">\${formatTime(
          timeLeft
        )}</span>
      </div>
      \`;

      startTimer();

      function onTimesUp() {
        clearInterval(timerInterval);
      }

      function startTimer() {
        timerInterval = setInterval(() => {
          timePassed = timePassed += 1;
          timeLeft = TIME_LIMIT - timePassed;
          document.getElementById("base-timer-label").innerHTML = formatTime(
            timeLeft
          );
          setCircleDasharray();
          setRemainingPathColor(timeLeft);

          if (timeLeft === 0) {
            onTimesUp();
          }
        }, 1000);
      }

      function formatTime(time) {
        const minutes = Math.floor(time / 60);
        let seconds = time % 60;

        if (seconds < 10) {
          seconds = \`0\${seconds}\`;
        }

        return \`\${minutes}:\${seconds}\`;
      }

      function setRemainingPathColor(timeLeft) {
        const { alert, warning, info } = COLOR_CODES;
        if (timeLeft <= alert.threshold) {
          document
            .getElementById("base-timer-path-remaining")
            .classList.remove(warning.color);
          document
            .getElementById("base-timer-path-remaining")
            .classList.add(alert.color);
        } else if (timeLeft <= warning.threshold) {
          document
            .getElementById("base-timer-path-remaining")
            .classList.remove(info.color);
          document
            .getElementById("base-timer-path-remaining")
            .classList.add(warning.color);
        }
      }

      function calculateTimeFraction() {
        const rawTimeFraction = timeLeft / TIME_LIMIT;
        return rawTimeFraction - (1 / TIME_LIMIT) * (1 - rawTimeFraction);
      }

      function setCircleDasharray() {
        const circleDasharray = \`\${(
          calculateTimeFraction() * FULL_DASH_ARRAY
        ).toFixed(0)} 283\`;
        document
          .getElementById("base-timer-path-remaining")
          .setAttribute("stroke-dasharray", circleDasharray);
      }

      //startTimeout();

      function startTimeout(){
         setTimeout("window.close();", 21000);
      }

  </script>
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