# CodeSpin.AI Chrome Extension

This Chrome Extension allows you to use Claude and ChatGPT to edit your local project - using the new File System APIs available on Chrome. 
This extension is not yet available on the Chrome Web Store (it takes weeks for approval), so it must be installed manually. Installation instructions are given below.

## Screenshots

Select Files to include in the prompt:

![image](https://github.com/user-attachments/assets/1e98b3a4-e9ec-4398-8222-8eb80b186e35)

Add files to prompt, and Sync back with your project

![codespin-features](https://github.com/user-attachments/assets/5f2da8cf-76f0-4c69-8234-a19556765cee)

Write it back!

![Screenshot from 2024-11-03 15-47-29](https://github.com/user-attachments/assets/e68dc74c-76ec-4410-9dfa-f6051d2d743a)


## Installation

Clone this project

```sh
git clone https://github.com/codespin-ai/codespin-chrome-extension
```

Switch to the project directory

```sh
cd codespin-chrome-extension
```

Install deps. Note that you need Node.JS.

```sh
npm i
```

### Linux/macOS

Build it.

```sh
./build.sh
```

Package it (optional).

```sh
./package.sh output.zip
```

### Windows

Build it.

```sh
npm run build:win
```

Or use the batch file for both building and packaging:

```sh
build-package.bat output.zip
```

Alternatively, you can package separately:

```sh
npm run package:win output.zip
```

### Loading the Extension in Chrome

After building the extension, follow these steps to install it in Chrome:

1. Open Chrome web browser
2. Type `chrome://extensions/` in the address bar and press Enter
3. Enable "Developer mode" by toggling the switch in the top-right corner
4. Click on "Load Unpacked" button that appears
5. Navigate to the `codespin-chrome-extension` directory (the main project folder, not the dist folder)
6. Select the folder and click "Open"
7. The extension should now appear in your list of installed extensions

### Using the Extension

Once installed, you can use the extension with ChatGPT and Claude:

1. Go to [ChatGPT](https://chat.openai.com/) or [Claude](https://claude.ai/)
2. Look for the CodeSpin.AI icon in the interface
3. Click on the icon to select files from your local project
4. The selected files will be included in your prompt
5. When AI suggests code changes, you can sync them back to your project

Note: When using the extension for the first time, you may be prompted to grant file system access permissions.

## Troubleshooting

### Windows

If you encounter an error about PowerShell execution policy, you may need to allow script execution:

```powershell
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process
```

Then run the build or package commands again.

### Extension Not Working

If the extension does not appear in ChatGPT or Claude:

1. Make sure you're using a Chromium-based browser (Chrome, Edge, Brave, etc.)
2. Check that the extension is enabled in your extensions page
3. Try refreshing the ChatGPT or Claude page
4. Make sure you're using the correct URLs: `https://chat.openai.com/` or `https://claude.ai/`

### Permissions Issues

If you encounter issues with file access:

1. In Chrome extensions page, click on the "Details" of the CodeSpin extension
2. Go to "Site access" and make sure appropriate permissions are granted
3. You may need to re-authorize file access by clicking on the extension icon again
