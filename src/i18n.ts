import { getLanguage } from 'obsidian';

type NestedStringObject = {
  [key: string]: string | NestedStringObject;
};

type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & string]: ObjectType[Key] extends object ? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}` : `${Key}`;
}[keyof ObjectType & string];

/**
 * Language code type.
 *
 * @link https://github.com/obsidianmd/obsidian-translations?tab=readme-ov-file#existing-languages
 */
export type LanguageCodeType =
  | 'en'
  | 'af'
  | 'am'
  | 'ar'
  | 'eu'
  | 'be'
  | 'bg'
  | 'bn'
  | 'ca'
  | 'cs'
  | 'da'
  | 'de'
  | 'dv'
  | 'el'
  | 'en-GB'
  | 'eo'
  | 'es'
  | 'fa'
  | 'fi-fi'
  | 'fr'
  | 'gl'
  | 'he'
  | 'hi'
  | 'hu'
  | 'id'
  | 'it'
  | 'ja'
  | 'ko'
  | 'lv'
  | 'ml'
  | 'ms'
  | 'ne'
  | 'nl'
  | 'no'
  | 'oc'
  | 'pl'
  | 'pt'
  | 'pt-BR'
  | 'ro'
  | 'ru'
  | 'sa'
  | 'sr'
  | 'sv'
  | 'sk'
  | 'sq'
  | 'ta'
  | 'te'
  | 'th'
  | 'tl'
  | 'tr'
  | 'uk'
  | 'ur'
  | 'vi'
  | 'zh'
  | 'zh-TW';

type MessagesWithRequiredEn<Schema> = { en: Schema } & Partial<Record<Exclude<LanguageCodeType, 'en'>, Schema>>;

export class ObsidianPluginI18n<Schema extends NestedStringObject> {
  private messages: MessagesWithRequiredEn<Schema>;
  private locale: LanguageCodeType;
  private currentMessage: Schema;

  /**
   * Constructor for ObsidianPluginI18n.
   *
   * @param messages A record of language codes and their corresponding message objects.
   * @param locale The language code. If not provided, the current language will be used.
   */
  constructor(messages: MessagesWithRequiredEn<Schema>, locale?: LanguageCodeType) {
    this.messages = messages;
    this.locale = locale ?? (getLanguage() as LanguageCodeType);
    const currentMessage = this.messages[this.locale];
    if (typeof currentMessage === 'undefined') {
      //? Fallback to en.
      this.currentMessage = this.messages['en'];
    } else {
      this.currentMessage = currentMessage;
    }
  }

  /**
   * Sets the new language code.
   *
   * @param locale The new language code. If not provided, the current language will be used.
   */
  setLocale(locale?: LanguageCodeType): void {
    this.locale = locale ?? (getLanguage() as LanguageCodeType);
    const currentMessage = this.messages[this.locale];
    if (typeof currentMessage === 'undefined') {
      //? Fallback to en.
      this.currentMessage = this.messages['en'];
    } else {
      this.currentMessage = currentMessage;
    }
  }

  /**
   * Translates a key to the current language.
   *
   * @param key The key to translate. It can be a dot-separated path to.
   * @param params Optional parameters to replace placeholders in the message.
   * @returns The translated message.
   */
  t(key: NestedKeyOf<Schema>, params?: Record<string, unknown>): string {
    const keys = key.split('.');
    let message: string | NestedStringObject | undefined = this.currentMessage;

    for (const k of keys) {
      if (typeof message === 'object' && message) {
        message = message[k];
      } else {
        break;
      }
    }

    if (typeof message === 'undefined' || typeof message === 'object') {
      return key;
    }

    return message.replace(/\{(\w+)\}/g, (_, p1) => {
      if (params && params[p1] != undefined) {
        return String(params[p1]);
      }
      return `{${p1}}`;
    });
  }

  /**
   * Gets the translation tuple based on the split using the placeholder.
   *
   * @param key The key to translate. It can be a dot-separated path to.
   * @param placeholder the placeholder to split the text. Default is '{placeholder}'.
   * @returns The translation tuple.
   */
  getPlaceholderTuple(key: NestedKeyOf<Schema>, placeholder = '{placeholder}'): [string, string] {
    const text = this.t(key);
    const parts = text.split(placeholder);
    if (parts.length === 1) {
      return [parts[0], ''];
    } else if (parts.length >= 2) {
      return [parts[0], parts[1]];
    }

    return ['', ''];
  }
}
