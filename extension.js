'use strict';

const vscode = require('vscode');
const fs = require('fs');
const path = require('path');

const MODEL_CACHE = new Map();
const LAST_MODEL_KEY = 'tokencounter.lastModel';

/**
 * Reads vocab files from the bundled Vocab folder and caches them.
 */
function loadModelVocabs(context) {
  if (MODEL_CACHE.size > 0) {
    return Array.from(MODEL_CACHE.values());
  }

  const vocabDir = path.join(context.extensionPath, 'Vocab');
  let files = [];

  try {
    files = fs.readdirSync(vocabDir).filter((file) => file.endsWith('-vocab.json'));
  } catch (err) {
    vscode.window.showErrorMessage(`Token Counter: 无法读取 Vocab 目录 (${err.message}).`);
    return [];
  }

  for (const file of files) {
    const fullPath = path.join(vocabDir, file);
    try {
      const raw = fs.readFileSync(fullPath, 'utf8');
      const vocab = JSON.parse(raw);
      const maxTokenLength = Object.keys(vocab).reduce((max, key) => Math.max(max, key.length), 0);
      const name = file.replace(/-vocab\.json$/i, '');
      MODEL_CACHE.set(name, { name, vocab, maxTokenLength });
    } catch (err) {
      vscode.window.showWarningMessage(`Token Counter: 读取 ${file} 时出错 (${err.message}).`);
    }
  }

  return Array.from(MODEL_CACHE.values());
}

function normalizeForTokenizer(content) {
  return content
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/ /g, 'Ġ')
    .replace(/\t/g, 'ĉ')
    .replace(/\n/g, 'Ċ');
}

function greedyTokenize(content, vocab, maxTokenLength) {
  const prepared = normalizeForTokenizer(content);
  const tokens = [];
  let index = 0;

  while (index < prepared.length) {
    const remaining = prepared.length - index;
    const windowSize = Math.min(maxTokenLength, remaining);
    let matched = null;

    for (let size = windowSize; size > 0; size -= 1) {
      const candidate = prepared.substr(index, size);
      if (Object.prototype.hasOwnProperty.call(vocab, candidate)) {
        matched = candidate;
        break;
      }
    }

    if (!matched) {
      matched = prepared[index];
    }

    tokens.push(matched);
    index += matched.length;
  }

  return tokens;
}

function countTokens(content, model) {
  const pieces = greedyTokenize(content, model.vocab, model.maxTokenLength);
  return pieces.length;
}

function countWords(content) {
  const matches = content.trim().match(/\S+/g);
  return matches ? matches.length : 0;
}

async function pickModel(context) {
  const models = loadModelVocabs(context);
  if (models.length === 0) {
    vscode.window.showErrorMessage('Token Counter: 没有可用的内置模型词表。请确认 Vocab 目录存在。');
    return undefined;
  }

  const lastModel = context.globalState.get(LAST_MODEL_KEY);
  const items = models
    .map((model) => ({
      label: model.name,
      description: model.name === lastModel ? '上次使用' : '内置词表'
    }))
    .sort((a, b) => {
      if (a.label === lastModel) return -1;
      if (b.label === lastModel) return 1;
      return a.label.localeCompare(b.label);
    });

  const selection = await vscode.window.showQuickPick(items, {
    placeHolder: '选择用于统计的模型'
  });

  if (!selection) {
    return undefined;
  }

  const chosen = models.find((model) => model.name === selection.label);
  if (chosen) {
    await context.globalState.update(LAST_MODEL_KEY, chosen.name);
  }

  return chosen;
}

async function handleSelectModel(context) {
  const model = await pickModel(context);
  if (model) {
    vscode.window.showInformationMessage(`Token Counter: 已选择模型 ${model.name}`);
  }
}

async function handleCountCommand(context) {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showWarningMessage('Token Counter: 请先打开一个文本文件。');
    return;
  }

  const model = await pickModel(context);
  if (!model) {
    return;
  }

  const documentText = editor.document.getText();
  const tokenCount = countTokens(documentText, model);
  const wordCount = countWords(documentText);
  const charCount = documentText.length;

  const messageLines = [
    `模型: ${model.name}`,
    `字符数: ${charCount}`,
    `词数: ${wordCount}`,
    `Token 数: ${tokenCount}`
  ];

  vscode.window.showInformationMessage(messageLines.join('\n'));
  vscode.window.setStatusBarMessage(`Token Counter • ${tokenCount} tokens (${model.name})`, 5000);
}

function activate(context) {
  const countCommand = vscode.commands.registerCommand('tokencounter.countTokens', () =>
    handleCountCommand(context)
  );
  const selectModelCommand = vscode.commands.registerCommand('tokencounter.selectModel', () =>
    handleSelectModel(context)
  );

  context.subscriptions.push(countCommand, selectModelCommand);
}

function deactivate() {
  // No-op
}

module.exports = {
  activate,
  deactivate
};
