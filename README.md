# obsidian-plugin-i18n

A package for introducing internationalization support in Obsidian plugin development.

## Installation

```bash
npm install obsidian-plugin-i18n
```

## Usage

```js
import { ObsidianPluginI18n } from 'obsidian-plugin-i18n';

const messages = {
  en: { greeting: { hello: 'Hello', welcome: 'Welcome, {name}!' } },
  zh: { greeting: { hello: '你好', welcome: '欢迎，{name}！' } },
};

const i18n = new ObsidianPluginI18n(messages, 'en');

console.log(i18n.t('greeting.hello')); // Hello
console.log(i18n.t('greeting.welcome', { name: 'dragonish' })); // Welcome, dragonish!
```

## License

[MIT](./LICENSE)
