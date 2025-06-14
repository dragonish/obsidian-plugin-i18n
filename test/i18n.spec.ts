import 'mocha';
import { expect } from 'chai';
import { type ObsidianPluginI18n as ObsidianPluginI18nType } from '@/i18n';
import { loadWithMockedObsidian } from './helpers/obsidianMock';

const i18nModule = loadWithMockedObsidian('@/i18n');

describe('ObsidianPluginI18n', () => {
  const ObsidianPluginI18n = i18nModule.ObsidianPluginI18n as typeof ObsidianPluginI18nType;

  const messages = {
    en: { greeting: { hello: 'Hello', welcome: 'Welcome, {name}!' } },
    zh: { greeting: { hello: '你好', welcome: '欢迎，{name}！' } },
  };

  it('should translate a key', () => {
    const i18n = new ObsidianPluginI18n(messages, 'en');

    expect(i18n.t('greeting.hello')).to.eq('Hello');
    expect(i18n.t('greeting.welcome', { name: 'dragonish' })).to.eq('Welcome, dragonish!');

    i18n.setLocale('zh');
    expect(i18n.t('greeting.hello')).to.eq('你好');
    expect(i18n.t('greeting.welcome', { name: 'dragonish' })).to.eq('欢迎，dragonish！');
  });

  it('should translate a key without locale parameter', () => {
    const i18n = new ObsidianPluginI18n(messages);

    expect(i18n.t('greeting.hello')).to.eq('Hello');
    expect(i18n.t('greeting.welcome', { name: 'dragonish' })).to.eq('Welcome, dragonish!');
  });

  it('should translate a key that is missing a localized property', () => {
    const i18n = new ObsidianPluginI18n(messages, 'ja');

    expect(i18n.t('greeting.hello')).to.eq('Hello');
    expect(i18n.t('greeting.welcome', { name: 'dragonish' })).to.eq('Welcome, dragonish!');
  });
});
