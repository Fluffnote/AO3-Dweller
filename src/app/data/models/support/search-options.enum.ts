const completionStatusMap = new Map<string, string>([
  ["", "All works"],
  ["T", "Complete works only"],
  ["F", "Works in progress only"],
]);

const crossoversMap = new Map<string, string>([
  ["", "Include crossovers"],
  ["F", "Exclude crossovers"],
  ["T", "Only crossovers"],
]);

const languageMap = new Map<string, string>([
  ["", "Any"],

  ["so", "af Soomaali"],
  ["afr", "Afrikaans"],
  ["ain", "Aynu itak | アイヌ イタㇰ"],
  ["akk", "𒀝𒅗𒁺𒌑"],
  ["ar", "العربية"],
  ["amh", "አማርኛ"],
  ["egy", "𓂋𓏺𓈖 𓆎𓅓𓏏𓊖"],
  ["oji", "Anishinaabemowin"],
  ["arc", "ܐܪܡܝܐ | ארמיא"],
  ["hy", "հայերեն"],

  ["ase", "American Sign Language"],
  ["ast", "asturianu"],
  ["azj", "Azərbaycan dili | آذربایجان دیلی"],
  ["id", "Bahasa Indonesia"],
  ["ms", "Bahasa Malaysia"],
  ["bg", "Български"],
  ["bn", "বাংলা"],
  ["jv", "Basa Jawa"],
  ["sun", "ᮘᮞ ᮞᮥᮔ᮪ᮓ | Basa Sunda"],
  ["ba", "Башҡорт теле"],

  ["be", "беларуская"],
  ["bar", "Boarisch"],
  ["bos", "Bosanski"],
  ["br", "Brezhoneg"],
  ["bfi", "British Sign Language"],
  ["bua", "Буряад хэлэн | ᠪᠤᠷᠢᠶᠠᠳ ᠮᠣᠩᠭᠣᠯ ᠬᠡᠯᠡ"],
  ["ca", "Català"],
  ["ceb", "Cebuano"],
  ["cs", "Čeština"],
  ["chn", "Chinuk Wawa"],

  ["crh", "къырымтатар тили | qırımtatar tili"],
  ["cy", "Cymraeg"],
  ["da", "Dansk"],
  ["de", "Deutsch"],
  ["div", "ދިވެހި,"],
  ["et", "eesti keel"],
  ["el", "Ελληνικά"],
  ["sux", "𒅴𒂠"],
  ["en", "English"],
  ["ang", "Eald Englisċ"],

  ["es", "Español"],
  ["eo", "Esperanto"],
  ["eu", "Euskara"],
  ["fa", "فارسی"],
  ["fil", "Filipino"],
  ["cha", "Finuʼ Chamorro"],
  ["fr", "Français"],
  ["frr", "Friisk"],
  ["fry", "Frysk"],
  ["fur", "Furlan"],

  ["ga", "Gaeilge"],
  ["gd", "Gàidhlig"],
  ["gl", "Galego"],
  ["got", "𐌲𐌿𐍄𐌹𐍃𐌺𐌰"],
  ["gyn", "Creolese"],
  ["hak", "中文-客家话"],
  ["ko", "한국어"],
  ["hau", "Hausa | هَرْشَن هَوْسَ"],
  ["hi", "हिन्दी"],
  ["mww", "Hmoob dawb"],

  ["hr", "Hrvatski"],
  ["haw", "ʻŌlelo Hawaiʻi"],
  ["ia", "Interlingua"],
  ["zu", "isiZulu"],
  ["is", "Íslenska"],
  ["it", "Italiano"],
  ["he", "עברית"],
  ["kal", "Kalaallisut"],
  ["xal", "Хальмг Өөрдин келн"],
  ["moh", "Kanienʼkéha"],

  ["kan", "ಕನ್ನಡ"],
  ["kat", "ქართული"],
  ["cor", "Kernewek"],
  ["khm", "ភាសាខ្មែរ"],
  ["qkz", "Khuzdul"],
  ["sw", "Kiswahili"],
  ["ht", "kreyòl ayisyen"],
  ["ku", "Kurdî | کوردی"],
  ["kir", "Кыргызча"],
  ["lad", "Ladino / לאדינו"],

  ["fcs", "Langue des signes québécoise"],
  ["lv", "Latviešu valoda"],
  ["lb", "Lëtzebuergesch"],
  ["lt", "Lietuvių kalba"],
  ["la", "Lingua latina"],
  ["hu", "Magyar"],
  ["mk", "македонски"],
  ["ml", "മലയാളം"],
  ["mt", "Malti"],
  ["mnc", "ᠮᠠᠨᠵᡠ ᡤᡳᠰᡠᠨ"],

  ["qmd", "Mando'a"],
  ["mr", "मराठी"],
  ["mic", "Mi'kmaq"],
  ["enm", "Middel Englisch"],
  ["mik", "Mikisúkî"],
  ["hnj", "Moob leeg"],
  ["mon", "ᠮᠣᠩᠭᠣᠯ ᠪᠢᠴᠢᠭ᠌ | Монгол Кирилл үсэг"],
  ["my", "မြန်မာဘာသာ"],
  ["myv", "Эрзянь кель"],
  ["qnv", "Lìʼfya leNaʼvi"],

  ["nah", "Nāhuatl"],
  ["nan", "中文-闽南话 臺語"],
  ["ppl", "Nawat"],
  ["nl", "Nederlands"],
  ["ja", "日本語"],
  ["no", "Norsk"],
  ["ce", "Нохчийн мотт"],
  ["ood", "O’odham Ñiok"],
  ["ota", "لسان عثمانى"],
  ["ps", "پښتو"],

  ["pdc", "Pennsilfaanisch Deitsch"],
  ["nds", "Plattdüütsch"],
  ["pl", "Polski"],
  ["ptBR", "Português brasileiro"],
  ["ptPT", "Português europeu"],
  ["fuc", "Pulaar"],
  ["pa", "ਪੰਜਾਬੀ"],
  ["kaz", "qazaqşa | қазақша"],
  ["qlq", "Uncategorized Constructed Languages"],
  ["qya", "Quenya"],

  ["ro", "Română"],
  ["rom", "RRomani Ćhib"],
  ["ru", "Русский"],
  ["smi", "Sámi"],
  ["sah", "саха тыла"],
  ["sco", "Scots"],
  ["sq", "Shqip"],
  ["sjn", "Sindarin"],
  ["si", "සිංහල"],
  ["sk", "Slovenčina"],

  ["slv", "Slovenščina"],
  ["sla", "Slověnьskъ Językъ"],
  ["gem", "Sprēkō Þiudiskō"],
  ["sr", "Српски"],
  ["fi", "suomi"],
  ["sv", "Svenska"],
  ["ta", "தமிழ்"],
  ["tat", "татар теле"],
  ["mri", "te reo Māori"],
  ["tel", "తెలుగు"],

  ["tir", "ትግርኛ"],
  ["th", "ไทย"],
  ["tqx", "Thermian"],
  ["bod", "བོད་སྐད་"],
  ["vi", "Tiếng Việt"],
  ["cop", "ϯⲙⲉⲧⲣⲉⲙⲛ̀ⲭⲏⲙⲓ"],
  ["tlh", "tlhIngan-Hol"],
  ["tok", "toki pona"],
  ["trf", "Trinidadian Creole"],
  ["tsd", "τσακώνικα"],

  ["chr", "ᏣᎳᎩ ᎦᏬᏂᎯᏍᏗ"],
  ["tr", "Türkçe"],
  ["uk", "Українська"],
  ["ale", "Unangam Tunuu"],
  ["urd", "اُردُو"],
  ["uig", "ئۇيغۇر تىلى"],
  ["vol", "Volapük"],
  ["wuu", "中文-吴语"],
  ["yi", "יידיש"],
  ["yua", "maayaʼ tʼàan"],

  ["yue", "中文-广东话 粵語"],
  ["zh", "中文-普通话 國語"],
]);

const sortColumnMap = new Map<string, string>([
  ["_score","Best Match"],
  ["authors_to_sort_on","Author"],
  ["title_to_sort_on","Title"],
  ["created_at","Date Posted"],
  ["revised_at","Date Updated"],
  ["word_count","Word Count"],
  ["hits","Hits"],
  ["kudos_count","Kudos"],
  ["comments_count","Comments"],
  ["bookmarks_count","Bookmarks"],
]);

const sortDirectionMap = new Map<string, string>([
  ["asc","Ascending"],
  ["desc","Descending"],
]);



export type CompletionStatusOptions = "" | "T" | "F";
export type CrossoversOptions = "" | "T" | "F";
export type LanguageOptions = "" | "so" | "afr" | "ain" | "akk" | "ar" | "amh" | "egy" | "oji" | "arc" | "hy"
                                 | "ase" | "ast" | "azj" | "id" | "ms" | "bg" | "bn" | "jv" | "sun" | "ba"
                                 | "be" | "bar" | "bos" | "br" | "bfi" | "bua" | "ca" | "ceb" | "cs" | "chn"
                                 | "crh" | "cy" | "da" | "de" | "div" | "et" | "el" | "sux" | "en" | "ang"
                                 | "es" | "eo" | "eu" | "fa" | "fil" | "cha" | "fr" | "frr" | "fry" | "fur"
                                 | "ga" | "gd" | "gl" | "got" | "gyn" | "hak" | "ko" | "hau" | "hi" | "mww"
                                 | "hr" | "haw" | "ia" | "zu" | "is" | "it" | "he" | "kal" | "xal" | "moh"
                                 | "kan" | "kat" | "cor" | "khm" | "qkz" | "sw" | "ht" | "ku" | "kir" | "lad"
                                 | "fcs" | "lv" | "lb" | "lt" | "la" | "hu" | "mk" | "ml" | "mt" | "mnc"
                                 | "qmd" | "mr" | "mic" | "enm" | "mik" | "hnj" | "mon" | "my" | "myv" | "qnv"
                                 | "nah" | "nan" | "ppl" | "nl" | "ja" | "no" | "ce" | "ood" | "ota" | "ps"
                                 | "pdc" | "nds" | "pl" | "ptBR" | "ptPT" | "fuc" | "pa" | "kaz" | "qlq" | "qya"
                                 | "ro" | "rom" | "ru" | "smi" | "sah" | "sco" | "sq" | "sjn" | "si" | "sk"
                                 | "slv" | "sla" | "gem" | "sr" | "fi" | "sv" | "ta" | "tat" | "mri" | "tel"
                                 | "tir" | "th" | "tqx" | "bod" | "vi" | "cop" | "tlh" | "tok" | "trf" | "tsd"
                                 | "chr" | "tr" | "uk" | "ale" | "urd" | "uig" | "vol" | "wuu" | "yi" | "yua"
                                 | "yue" | "zh";
export type SortColumnOptions = "_score" | "authors_to_sort_on" | "title_to_sort_on" | "created_at" | "revised_at" | "word_count" | "hits" | "kudos_count" | "comments_count" | "bookmarks_count";
export type SortDirectionOptions = "asc" | "desc";

export { completionStatusMap, crossoversMap, languageMap, sortColumnMap, sortDirectionMap };
