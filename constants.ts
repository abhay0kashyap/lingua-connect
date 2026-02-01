
import { GameType, LanguageConfig } from "./types";

export const GREET_CYCLE_MS = 3000;

export const SUPPORTED_LANGUAGES: LanguageConfig[] = [
  { code: "en", name: "English", nativeName: "English", nativeGreeting: "Hello", transliteration: "Hello", englishTranslation: "Hello", flag: "🇺🇸", locale: "en-US" },
  { code: "es", name: "Spanish", nativeName: "Español", nativeGreeting: "Hola", transliteration: "Hola", englishTranslation: "Hello", flag: "🇪🇸", locale: "es-ES" },
  { code: "fr", name: "French", nativeName: "Français", nativeGreeting: "Bonjour", transliteration: "Bonjour", englishTranslation: "Hello", flag: "🇫🇷", locale: "fr-FR" },
  { code: "de", name: "German", nativeName: "Deutsch", nativeGreeting: "Hallo", transliteration: "Hallo", englishTranslation: "Hello", flag: "🇩🇪", locale: "de-DE" },
  { code: "it", name: "Italian", nativeName: "Italiano", nativeGreeting: "Ciao", transliteration: "Ciao", englishTranslation: "Hello", flag: "🇮🇹", locale: "it-IT" },
  { code: "pt", name: "Portuguese", nativeName: "Português", nativeGreeting: "Olá", transliteration: "Olá", englishTranslation: "Hello", flag: "🇵🇹", locale: "pt-PT" },
  { code: "ru", name: "Russian", nativeName: "Русский", nativeGreeting: "Привет", transliteration: "Privet", englishTranslation: "Hello", flag: "🇷🇺", locale: "ru-RU" },
  { code: "ja", name: "Japanese", nativeName: "日本語", nativeGreeting: "こんにちは", transliteration: "Konnichiwa", englishTranslation: "Hello", flag: "🇯🇵", locale: "ja-JP" },
  { code: "zh", name: "Chinese", nativeName: "中文", nativeGreeting: "你好", transliteration: "Nǐ hǎo", englishTranslation: "Hello", flag: "🇨🇳", locale: "zh-CN" },
  { code: "ko", name: "Korean", nativeName: "한국어", nativeGreeting: "안녕하세요", transliteration: "Annyeonghaseyo", englishTranslation: "Hello", flag: "🇰🇷", locale: "ko-KR" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", nativeGreeting: "नमस्ते", transliteration: "Namaste", englishTranslation: "Hello", flag: "🇮🇳", locale: "hi-IN" },
  { code: "ar", name: "Arabic", nativeName: "العربية", nativeGreeting: "مرحبا", transliteration: "Marhaba", englishTranslation: "Hello", flag: "🇸🇦", locale: "ar-SA" },
  { code: "tr", name: "Turkish", nativeName: "Türkçe", nativeGreeting: "Merhaba", transliteration: "Merhaba", englishTranslation: "Hello", flag: "🇹🇷", locale: "tr-TR" },
  { code: "nl", name: "Dutch", nativeName: "Nederlands", nativeGreeting: "Hallo", transliteration: "Hallo", englishTranslation: "Hello", flag: "🇳🇱", locale: "nl-NL" },
  { code: "pl", name: "Polish", nativeName: "Polski", nativeGreeting: "Cześć", transliteration: "Cześć", englishTranslation: "Hello", flag: "🇵🇱", locale: "pl-PL" },
];

export const ORBIT_GREETINGS = SUPPORTED_LANGUAGES.map(l => ({
  lang: l.code,
  flag: l.flag,
  native: l.nativeGreeting,
  translit: l.transliteration,
  translation: l.englishTranslation
}));

export const HELLO_LANGUAGES = SUPPORTED_LANGUAGES; // Alias for legacy support if needed

export const HUMAN_PERSONAS = [
  { name: "Alex", flag: "🇺🇸" },
  { name: "Sofia", flag: "🇫🇷" },
  { name: "Rahul", flag: "🇮🇳" },
  { name: "Marco", flag: "🇪🇸" },
  { name: "Aisha", flag: "🇸🇦" },
  { name: "Leo", flag: "🇩🇪" },
  { name: "Hana", flag: "🇯🇵" },
  { name: "Chen", flag: "🇨🇳" },
  { name: "Olga", flag: "🇷🇺" },
  { name: "Maria", flag: "🇧🇷" },
];

export const AVAILABLE_GAMES: GameType[] = [
  { id: 'blitz', title: 'Word Blitz', description: 'Rapid-fire vocabulary translation.', icon: 'Zap', difficulty: 'Easy', xpReward: 50, tag: 'Daily' },
  { id: 'scramble', title: 'Sentence Scramble', description: 'Reorder blocks to form correct sentences.', icon: 'Layers', difficulty: 'Medium', xpReward: 100 },
  { id: 'detective', title: 'Audio Detective', description: 'Listen carefully and choose the meaning.', icon: 'Search', difficulty: 'Medium', xpReward: 80, tag: 'Hot' },
  { id: 'simulator', title: 'Roleplay Sim', description: 'Interact with personas in real-life scenarios.', icon: 'MessageSquare', difficulty: 'Hard', xpReward: 150 },
  { id: 'emoji', title: 'Emoji Translator', description: 'Guess the sentence from emoji sequences.', icon: 'Smile', difficulty: 'Easy', xpReward: 40 },
  { id: 'blanks', title: 'Fill the Blanks', description: 'Complete sentences with context.', icon: 'Type', difficulty: 'Medium', xpReward: 70 },
  { id: 'listening', title: 'Speed Listening', description: 'One-time audio play. Type what you heard.', icon: 'Volume2', difficulty: 'Hard', xpReward: 120 },
  { id: 'challenge', title: 'Real-Life Mode', description: 'Speak the requested phrase perfectly.', icon: 'Target', difficulty: 'Insane', xpReward: 250, tag: 'Boss' },
];

export const GEMINI_MODEL = "gemini-2.5-flash";

// --- DYNAMIC CONTENT GENERATOR ---
// In a real app, this would fetch from DB. Here we simulate a large dataset.
export const getGameContent = (gameId: string, targetCode: string, nativeCode: string) => {
  // 1. Define base content in English/Universal format
  const baseContent: Record<string, any[]> = {
    blitz: [
      { key: "apple", en: "Apple", type: "Noun" },
      { key: "book", en: "Book", type: "Noun" },
      { key: "friend", en: "Friend", type: "Noun" },
      { key: "house", en: "House", type: "Noun" },
      { key: "water", en: "Water", type: "Noun" },
    ],
    scramble: [
      { key: "coffee", en: "I want a coffee" },
      { key: "beach", en: "Where is the beach?" },
      { key: "hello", en: "Hello, how are you?" },
    ],
    challenge: [
      { key: "order_coffee", en: "Order a coffee", context: "You are at a cafe." },
      { key: "greeting", en: "Introduce yourself", context: "You are meeting a new friend." }
    ]
  };

  // 2. Define simple dictionaries for our supported languages (Mock Data)
  const dictionaries: Record<string, Record<string, string>> = {
    es: { apple: "Manzana", book: "Libro", friend: "Amigo", house: "Casa", water: "Agua", coffee: "Yo quiero un café", beach: "¿Dónde está la playa?", hello: "Hola, ¿cómo estás?", order_coffee: "Un café, por favor", greeting: "Hola, me llamo..." },
    fr: { apple: "Pomme", book: "Livre", friend: "Ami", house: "Maison", water: "Eau", coffee: "Je veux un café", beach: "Où est la plage ?", hello: "Bonjour, comment ça va ?", order_coffee: "Un café, s'il vous plaît", greeting: "Bonjour, je m'appelle..." },
    de: { apple: "Apfel", book: "Buch", friend: "Freund", house: "Haus", water: "Wasser", coffee: "Ich möchte einen Kaffee", beach: "Wo ist der Strand?", hello: "Hallo, wie geht es dir?", order_coffee: "Einen Kaffee, bitte", greeting: "Hallo, ich heiße..." },
    hi: { apple: "सेब (Seb)", book: "किताब (Kitaab)", friend: "दोस्त (Dost)", house: "घर (Ghar)", water: "पानी (Paani)", coffee: "मुझे कॉफी चाहिए", beach: "समुद्र तट कहाँ है?", hello: "नमस्ते, आप कैसे हैं?", order_coffee: "एक कॉफी कृपया", greeting: "नमस्ते, मेरा नाम..." },
    ja: { apple: "りんご (Ringo)", book: "本 (Hon)", friend: "友達 (Tomodachi)", house: "家 (Ie)", water: "水 (Mizu)", coffee: "コーヒーが欲しいです", beach: "ビーチはどこですか？", hello: "こんにちは、お元気ですか？", order_coffee: "コーヒーをください", greeting: "こんにちは、私の名前は..." },
    // Fallback for others to generic "Translated [Word]" for demo purposes if not explicitly listed
  };

  const targetDict = dictionaries[targetCode] || {};
  const nativeDict = dictionaries[nativeCode] || {};

  // 3. Transform into game-specific format
  const pool = baseContent[gameId] || [];
  
  return pool.map(item => {
    const targetText = targetDict[item.key] || `[${targetCode}] ${item.en}`;
    const nativeText = nativeDict[item.key] || item.en; // Fallback to English key if native missing

    if (gameId === 'blitz') {
      return {
        question: nativeText, // Show native
        answer: targetText,   // Expect target
        options: [targetText, "Foo", "Bar", "Baz"].sort(() => Math.random() - 0.5), // Mock options
        meta: { meaning: item.en, pron: "...", type: item.type }
      };
    } else if (gameId === 'scramble') {
      return {
        original: nativeText,
        segments: targetText.split(' ').map((t: string) => ({ text: t, meaning: "...", pron: "...", type: "Word" })).sort(() => Math.random() - 0.5),
        level: 1
      };
    } else if (gameId === 'challenge') {
       return {
         title: item.en,
         context: item.context,
         text: targetText,
         hint: `Say '${targetText}'`,
         description: item.context
       };
    }
    return item;
  });
};

export const TUTORIAL_STEPS: Record<string, any[]> = {
  scramble: [
    { title: "Sentence Scramble", description: "Reorder the words to match the translation." },
    { title: "Hover for Help", description: "Long press words to see meanings." },
  ],
  blitz: [
    { title: "Word Blitz", description: "Select the correct translation before time runs out." },
  ],
  challenge: [
    { title: "Real-Life Practice", description: "Read the scenario and speak the phrase." },
  ]
};
