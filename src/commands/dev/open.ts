import { execSync } from 'child_process';
import { require_cwd } from '@omni-door/utils';

export default async function (url: string) {
  if (process.platform === 'darwin') {
    // Will use the first open browser found from list
    const supportedChromiumBrowsers = [
      'Google Chrome Canary',
      'Google Chrome',
      'Microsoft Edge',
      'Brave Browser',
      'Vivaldi',
      'Chromium',
    ];

    for (const chromiumBrowser of supportedChromiumBrowsers) {
      try {
        // Try our best to reuse existing tab
        // on OSX Chromium-based browser with AppleScript
        execSync('ps cax | grep "' + chromiumBrowser + '"');
        execSync(
          'osascript open.chrome.applescript "' +
            encodeURI(url) +
            '" "' +
            chromiumBrowser +
            '"',
          {
            cwd: __dirname,
            stdio: 'ignore',
          }
        );
        return true;
      } catch (err) {
        // Ignore errors.
      }
    }
  }

  // Fallback to open
  // (It will always open new tab)
  try {
    const open = require_cwd('open');
    await open(url, { wait: false, url: true });
    return true;
  } catch (err) {
    return false;
  }
}