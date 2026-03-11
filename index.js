#!/usr/bin/env node
const chokidar = require('chokidar');
const simpleGit = require('simple-git');
const chalk = require('chalk');
const git = simpleGit();

/**
 * Clears the terminal screen.
 */
function clearScreen() {
  process.stdout.write('\x1Bc');
}

/**
 * Maps Git status shorthand to human-readable colored labels.
 */
function formatStatus(status) {
  const codes = {
    'M': chalk.yellow('Modified'),
    'A': chalk.green('Added   '),
    'D': chalk.red('Deleted '),
    'R': chalk.blue('Renamed '),
    'C': chalk.magenta('Copied  '),
    'U': chalk.red('Updated '),
    '?': chalk.gray('Untracked')
  };
  return codes[status.slice(0, 1)] || status;
}

/**
 * Fetches and displays the current git status.
 */
async function updateStatus() {
  try {
    const status = await git.status();
    clearScreen();
    console.log(chalk.bold.cyan('>>> Git Real-Time Tracker <<<'));
    console.log(chalk.gray(`Watching: ${process.cwd()}\n`));

    if (status.files.length === 0) {
      console.log(chalk.green('Everything is clean. No changes detected.'));
    } else {
      console.log(chalk.underline('Changed Files:'));
      status.files.forEach(file => {
        const path = file.path;
        const statusLabel = formatStatus(file.working_dir !== ' ' ? file.working_dir : file.index);
        console.log(`${statusLabel}  ${path}`);
      });
    }

    console.log('\n' + chalk.gray('Press Ctrl+C to exit...'));
  } catch (err) {
    console.error(chalk.red('Error fetching git status:'), err.message);
  }
}

// Check if current directory is a git repository
git.checkIsRepo().then(isRepo => {
  if (!isRepo) {
    console.error(chalk.red('Error: Not a git repository. Run "git init" first.'));
    process.exit(1);
  }

  // Initial status check
  updateStatus();

  // Watch for file changes
  const watcher = chokidar.watch('.', {
    ignored: [/(^|[\/\\])\../, 'node_modules'], // ignore dotfiles and node_modules
    persistent: true,
    ignoreInitial: true
  });

  watcher
    .on('add', updateStatus)
    .on('change', updateStatus)
    .on('unlink', updateStatus)
    .on('error', error => console.log(`Watcher error: ${error}`));

  console.log(chalk.blue('Watcher active... Waiting for changes.'));
});
