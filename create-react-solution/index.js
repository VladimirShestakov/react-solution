#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import prompts from 'prompts';
import colors from 'picocolors';
import mc from 'merge-change';

async function isDirectoryEmpty(dirPath) {
  try {
    const files = await fs.readdir(dirPath);
    return files.length === 0  || (files.length === 1 && files[0] === '.git');
  } catch (error) {
    console.error('Error reading directory:', error);
    return false;
  }
}

const ignoreDirNames = new Set(['node_modules', '.idea', 'dist']);

async function copy(from, to) {
  const stat = await fs.stat(from);
  if (stat.isDirectory()) {
    if (ignoreDirNames.has(path.basename(from))) return;
    await fs.mkdir(to, { recursive: true });
    for (const file of await fs.readdir(from)) {
      await copy(path.resolve(from, file), path.resolve(to, file));
    }
  } else {
    if (to.endsWith('_gitignore')) to = to.replace('_gitignore', '.gitignore')
    await fs.copyFile(from, to);
  }
}

function isSafeName(name) {
  return /^[a-z\d\-~][a-z\d\-._~]*$/.test(name)
}

async function patchJson(filePath, patch) {
  const content = await fs.readFile(filePath, 'utf-8');
  const data = mc.merge(JSON.parse(content), patch);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2) + '\n');
}



try {
  const currentPath = process.cwd();
  const templatePath = path.resolve(fileURLToPath(import.meta.url), '../template');
  const response = await prompts([
    {
      message: 'Use current directory?',
      name: 'useCurrentPath',
      initial: true,
      type: async () => await isDirectoryEmpty(currentPath) ? 'confirm' : false,
    },
    {
      message: 'Enter the directory name for new project',
      name: 'customPath',
      type: async (prev, values) => values.useCurrentPath ? false : 'text',
      format: value => path.resolve(currentPath, value),
      validate: async (newPath) => {
        if (!isSafeName(path.basename(newPath))) return 'Invalid characters in directory name'
        // Если путь существует, то должен указывать на пустую директорию
        try {
          await fs.access(newPath, fs.constants.W_OK);
          const stats = await fs.stat(newPath);
          switch (true) {
            case !stats.isDirectory():
              return 'Please specify the directory name';
            case !await isDirectoryEmpty(newPath):
              return 'Directory is not empty';
            default:
              return true;
          }
        } catch {
          // Возможно директории нет и это нормально
        }

        // Попытка создать новую директорию
        try {
          await fs.mkdir(newPath, { recursive: true });
          return true;
        } catch {
          return 'Failed to create the specified directory';
        }
      },
    },
    // {
    //   message: 'Do you need Server-side rendering (SSR)?',
    //   name: 'addSSR',
    //   type: 'confirm',
    // },
  ], {
    onCancel: () => {
      throw new Error(colors.red('✖') + ' Operation cancelled');
    },
  });

  const projectPath = response.customPath || currentPath;

  await copy(templatePath, projectPath);

  // Название проекта по имени директории
  const name = path.basename(projectPath)
  await patchJson(path.join(projectPath, 'package.json'), { name });
  // await patchJson(path.join(projectPath, 'src/package.json'), { name: `@${name}/client` });
  await patchJson(path.join(projectPath, 'server/package.json'), { name: `@${name}/server` });

  // SSR?
  // Порт для дев сервера?

} catch (e) {
  console.error(e.message);
}


// const defaultTargetDir = 'vite-project'
// const argTargetDir = formatTargetDir(argv._[0])
// const argTemplate = argv.template || argv.t


// + 0. Текущая директория, где запущен скрипт?
// + 1. Куда копировать (развертывать) проекта.
// + 1.1. Если текущая директория пустая, то предложить её?
// + 1.2. Запросить название проекта, чтобы создать по названию директорию?
// + 2. Скопировать все файлы из папки шаблона в папку нового проекта
// 3. Инициализировать git ?
// 3.1 Добавить ветку master
// 3.2 Сделать комит

// 4. Нужен ли SSR
// 4.1 Скопировать (или удалить?) папку server

// + 5. Для правки package.json и других json настроек, возможно проще считывать файлы и перезаписывать.
// 6. Выбор шаблона, если их будет несколько
// 6.1 Пустой проект
// 6.2 Проект со всеми базовыми фичами - роутинг, авторизация, заготовка под фичи, пакеты.

// ---7. Запрашивать автора?
// ---8. Запрашивать тип лицензии?
