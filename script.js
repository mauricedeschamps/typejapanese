document.addEventListener('DOMContentLoaded', () => {
    // モード切り替え
    const darkModeBtn = document.getElementById('darkModeBtn');
    const lightModeBtn = document.getElementById('lightModeBtn');
    const body = document.body;

    darkModeBtn.addEventListener('click', () => {
        body.classList.remove('light-mode');
        body.classList.add('dark-mode');
        darkModeBtn.classList.add('active');
        lightModeBtn.classList.remove('active');
    });

    lightModeBtn.addEventListener('click', () => {
        body.classList.remove('dark-mode');
        body.classList.add('light-mode');
        lightModeBtn.classList.add('active');
        darkModeBtn.classList.remove('active');
    });

    // 文字体系切り替え
    const hiraganaBtn = document.getElementById('hiraganaBtn');
    const katakanaBtn = document.getElementById('katakanaBtn');
    const alphabetBtn = document.getElementById('alphabetBtn');
    let currentScript = 'hiragana';

    hiraganaBtn.addEventListener('click', () => {
        currentScript = 'hiragana';
        hiraganaBtn.classList.add('active');
        katakanaBtn.classList.remove('active');
        alphabetBtn.classList.remove('active');
        updateKanaButtons();
        renderOutput();
    });

    katakanaBtn.addEventListener('click', () => {
        currentScript = 'katakana';
        katakanaBtn.classList.add('active');
        hiraganaBtn.classList.remove('active');
        alphabetBtn.classList.remove('active');
        updateKanaButtons();
        renderOutput();
    });

    alphabetBtn.addEventListener('click', () => {
        currentScript = 'alphabet';
        alphabetBtn.classList.add('active');
        hiraganaBtn.classList.remove('active');
        katakanaBtn.classList.remove('active');
        updateKanaButtons();
        renderOutput();
    });

    // かなデータ
    const kanaData = {
        'あ': { romaji: 'a', variants: ['あ', 'い', 'う', 'え', 'お', 'ぁ', 'ぃ', 'ぅ', 'ぇ', 'ぉ'] },
        'か': { romaji: 'ka', variants: ['か', 'き', 'く', 'け', 'こ', 'きゃ', 'きゅ', 'きょ'], dakuon: ['が', 'ぎ', 'ぐ', 'げ', 'ご', 'ぎゃ', 'ぎゅ', 'ぎょ'] },
        'さ': { romaji: 'sa', variants: ['さ', 'し', 'す', 'せ', 'そ', 'しゃ', 'しゅ', 'しょ'], dakuon: ['ざ', 'じ', 'ず', 'ぜ', 'ぞ', 'じゃ', 'じゅ', 'じょ'] },
        'た': { romaji: 'ta', variants: ['た', 'ち', 'つ', 'て', 'と', 'ちゃ', 'ちゅ', 'ちょ', 'っ'], dakuon: ['だ', 'ぢ', 'づ', 'で', 'ど', 'ぢゃ', 'ぢゅ', 'ぢょ'] },
        'な': { romaji: 'na', variants: ['な', 'に', 'ぬ', 'ね', 'の', 'にゃ', 'にゅ', 'にょ'] },
        'は': { romaji: 'ha', variants: ['は', 'ひ', 'ふ', 'へ', 'ほ', 'ひゃ', 'ひゅ', 'ひょ'], dakuon: ['ば', 'び', 'ぶ', 'べ', 'ぼ', 'びゃ', 'びゅ', 'びょ'], handakuon: ['ぱ', 'ぴ', 'ぷ', 'ぺ', 'ぽ', 'ぴゃ', 'ぴゅ', 'ぴょ'] },
        'ま': { romaji: 'ma', variants: ['ま', 'み', 'む', 'め', 'も', 'みゃ', 'みゅ', 'みょ'] },
        'や': { romaji: 'ya', variants: ['や', 'ゆ', 'よ', 'ゃ', 'ゅ', 'ょ'] },
        'ら': { romaji: 'ra', variants: ['ら', 'り', 'る', 'れ', 'ろ', 'りゃ', 'りゅ', 'りょ'] },
        'わ': { romaji: 'wa', variants: ['わ', 'を', 'ん'] }
    };

    // カタカナマップ
    const katakanaMap = {
        'あ': 'ア', 'い': 'イ', 'う': 'ウ', 'え': 'エ', 'お': 'オ',
        'か': 'カ', 'き': 'キ', 'く': 'ク', 'け': 'ケ', 'こ': 'コ',
        'さ': 'サ', 'し': 'シ', 'す': 'ス', 'せ': 'セ', 'そ': 'ソ',
        'た': 'タ', 'ち': 'チ', 'つ': 'ツ', 'て': 'テ', 'と': 'ト',
        'な': 'ナ', 'に': 'ニ', 'ぬ': 'ヌ', 'ね': 'ネ', 'の': 'ノ',
        'は': 'ハ', 'ひ': 'ヒ', 'ふ': 'フ', 'へ': 'ヘ', 'ほ': 'ホ',
        'ま': 'マ', 'み': 'ミ', 'む': 'ム', 'め': 'メ', 'も': 'モ',
        'や': 'ヤ', 'ゆ': 'ユ', 'よ': 'ヨ',
        'ら': 'ラ', 'り': 'リ', 'る': 'ル', 'れ': 'レ', 'ろ': 'ロ',
        'わ': 'ワ', 'を': 'ヲ', 'ん': 'ン',
        'が': 'ガ', 'ぎ': 'ギ', 'ぐ': 'グ', 'げ': 'ゲ', 'ご': 'ゴ',
        'ざ': 'ザ', 'じ': 'ジ', 'ず': 'ズ', 'ぜ': 'З', 'ぞ': 'ゾ',
        'だ': 'ダ', 'ぢ': 'ヂ', 'づ': 'ヅ', 'で': 'デ', 'ど': 'ド',
        'ば': 'バ', 'び': 'ビ', 'ぶ': 'ブ', 'べ': 'ベ', 'ぼ': 'ボ',
        'ぱ': 'パ', 'ぴ': 'ピ', 'ぷ': 'プ', 'ぺ': 'ペ', 'ぽ': 'ポ',
        'ぁ': 'ァ', 'ぃ': 'ィ', 'ぅ': 'ゥ', 'ぇ': 'ェ', 'ぉ': 'ォ',
        'ゃ': 'ャ', 'ゅ': 'ュ', 'ょ': 'ョ',
        'っ': 'ッ',
        'きゃ': 'キャ', 'きゅ': 'キュ', 'きょ': 'キョ',
        'しゃ': 'シャ', 'しゅ': 'シュ', 'しょ': 'ショ',
        'ちゃ': 'チャ', 'ちゅ': 'チュ', 'ちょ': 'チョ',
        'にゃ': 'ニャ', 'にゅ': 'ニュ', 'にょ': 'ニョ',
        'ひゃ': 'ヒャ', 'ひゅ': 'ヒュ', 'ひょ': 'ヒョ',
        'みゃ': 'ミャ', 'みゅ': 'ミュ', 'みょ': 'ミョ',
        'りゃ': 'リャ', 'りゅ': 'リュ', 'りょ': 'リョ',
        'ぎゃ': 'ギャ', 'ぎゅ': 'ギュ', 'ぎょ': 'ギョ',
        'じゃ': 'ジャ', 'じゅ': 'ジュ', 'じょ': 'ジョ',
        'びゃ': 'ビャ', 'びゅ': 'ビュ', 'びょ': 'ビョ',
        'ぴゃ': 'ピャ', 'ぴゅ': 'ピュ', 'ぴょ': 'ピョ'
    };

    // ローマ字マップ
    const romajiMap = {
        'あ': 'a', 'い': 'i', 'う': 'u', 'え': 'e', 'お': 'o',
        'か': 'ka', 'き': 'ki', 'く': 'ku', 'け': 'ke', 'こ': 'ko',
        'さ': 'sa', 'し': 'shi', 'す': 'su', 'せ': 'se', 'そ': 'so',
        'た': 'ta', 'ち': 'chi', 'つ': 'tsu', 'て': 'te', 'と': 'to',
        'な': 'na', 'に': 'ni', 'ぬ': 'nu', 'ね': 'ne', 'の': 'no',
        'は': 'ha', 'ひ': 'hi', 'ふ': 'fu', 'へ': 'he', 'ほ': 'ho',
        'ま': 'ma', 'み': 'mi', 'む': 'mu', 'め': 'me', 'も': 'mo',
        'や': 'ya', 'ゆ': 'yu', 'よ': 'yo',
        'ら': 'ra', 'り': 'ri', 'る': 'ru', 'れ': 're', 'ろ': 'ro',
        'わ': 'wa', 'を': 'wo', 'ん': 'n',
        'が': 'ga', 'ぎ': 'gi', 'ぐ': 'gu', 'げ': 'ge', 'ご': 'go',
        'ざ': 'za', 'じ': 'ji', 'ず': 'zu', 'ぜ': 'ze', 'ぞ': 'zo',
        'だ': 'da', 'ぢ': 'ji', 'づ': 'zu', 'で': 'de', 'ど': 'do',
        'ば': 'ba', 'び': 'bi', 'ぶ': 'bu', 'べ': 'be', 'ぼ': 'bo',
        'ぱ': 'pa', 'ぴ': 'pi', 'ぷ': 'pu', 'ぺ': 'pe', 'ぽ': 'po',
        'ぁ': 'a', 'ぃ': 'i', 'ぅ': 'u', 'ぇ': 'e', 'ぉ': 'o',
        'ゃ': 'ya', 'ゅ': 'yu', 'ょ': 'yo',
        'っ': '(pause)',
        'きゃ': 'kya', 'きゅ': 'kyu', 'きょ': 'kyo',
        'しゃ': 'sha', 'しゅ': 'shu', 'しょ': 'sho',
        'ちゃ': 'cha', 'ちゅ': 'chu', 'ちょ': 'cho',
        'にゃ': 'nya', 'にゅ': 'nyu', 'にょ': 'nyo',
        'ひゃ': 'hya', 'ひゅ': 'hyu', 'ひょ': 'hyo',
        'みゃ': 'mya', 'みゅ': 'myu', 'みょ': 'myo',
        'りゃ': 'rya', 'りゅ': 'ryu', 'りょ': 'ryo',
        'ぎゃ': 'gya', 'ぎゅ': 'gyu', 'ぎょ': 'gyo',
        'じゃ': 'ja', 'じゅ': 'ju', 'じょ': 'jo',
        'びゃ': 'bya', 'びゅ': 'byu', 'びょ': 'byo',
        'ぴゃ': 'pya', 'ぴゅ': 'pyu', 'ぴょ': 'pyo'
    };

    // DOM要素
    const outputText = document.getElementById('outputText');
    const romajiOutput = document.getElementById('romajiOutput');
    const speakBtn = document.getElementById('speakBtn');
    const clearBtn = document.getElementById('clearBtn');
    const showRomajiBtn = document.getElementById('showRomajiBtn');
    const subMenu = document.getElementById('subMenu');
    const subMenuButtons = document.querySelector('.sub-menu-buttons');
    const kanaModal = document.getElementById('kanaModal');
    const modalButtons = document.querySelector('.modal-buttons');
    const closeModal = document.querySelector('.close-modal');

    let currentOutput = '';
    let showRomaji = false;

    // かなボタンの更新
    function updateKanaButtons() {
        const buttons = document.querySelectorAll('.kana-btn[data-base]');
        buttons.forEach(button => {
            const baseChar = button.getAttribute('data-base');
            if (currentScript === 'katakana') {
                button.textContent = katakanaMap[baseChar] || baseChar;
            } else if (currentScript === 'alphabet') {
                button.textContent = romajiMap[baseChar] || baseChar;
            } else {
                button.textContent = baseChar;
            }
        });
    }

    // サブメニューの作成
    function createSubMenuButtons(baseChar) {
        subMenuButtons.innerHTML = '';
        const data = kanaData[baseChar];
        
        if (!data) return;
        
        // 基本バリエーション
        if (data.variants && data.variants.length > 0) {
            const baseTitle = document.createElement('div');
            baseTitle.className = 'sub-menu-title';
            baseTitle.textContent = 'Base';
            subMenuButtons.appendChild(baseTitle);
            
            data.variants.forEach(char => {
                createSubMenuButton(char);
            });
        }
        
        // 濁音バリエーション
        if (data.dakuon && data.dakuon.length > 0) {
            const dakuTitle = document.createElement('div');
            dakuTitle.className = 'sub-menu-title';
            dakuTitle.textContent = 'Dakuon';
            subMenuButtons.appendChild(dakuTitle);
            
            data.dakuon.forEach(char => {
                createSubMenuButton(char);
            });
        }
        
        // 半濁音バリエーション
        if (data.handakuon && data.handakuon.length > 0) {
            const handakuTitle = document.createElement('div');
            handakuTitle.className = 'sub-menu-title';
            handakuTitle.textContent = 'Handakuon';
            subMenuButtons.appendChild(handakuTitle);
            
            data.handakuon.forEach(char => {
                createSubMenuButton(char);
            });
        }
        
        subMenu.classList.remove('hidden');
    }

    // サブメニューボタン作成ヘルパー
    function createSubMenuButton(char) {
        const btn = document.createElement('button');
        btn.className = 'kana-btn';
        
        if (currentScript === 'katakana') {
            btn.textContent = katakanaMap[char] || char;
        } else if (currentScript === 'alphabet') {
            btn.textContent = romajiMap[char] || char;
        } else {
            btn.textContent = char;
        }
        
        btn.addEventListener('click', () => {
            addToOutput(char);
            subMenu.classList.add('hidden');
        });
        subMenuButtons.appendChild(btn);
    }

    // 出力に追加
    function addToOutput(char) {
        currentOutput += char;
        renderOutput();
        speakCharacter(char);
    }

    // 出力のレンダリング
    function renderOutput() {
        outputText.innerHTML = '';
        
        const chars = processOutputString(currentOutput);
        
        chars.forEach(char => {
            const span = document.createElement('span');
            
            if (currentScript === 'katakana') {
                span.textContent = katakanaMap[char] || char;
            } else if (currentScript === 'alphabet') {
                span.textContent = romajiMap[char] || char;
            } else {
                span.textContent = char;
            }
            
            span.addEventListener('click', () => {
                speakCharacter(char);
                showCharacterInfo(char);
            });
            outputText.appendChild(span);
        });
        
        updateRomajiOutput();
    }

    // 出力文字列の処理
    function processOutputString(str) {
        const chars = [];
        for (let i = 0; i < str.length; i++) {
            const char = str[i];
            const nextChar = str[i + 1];
            
            // 拗音や小文字の処理
            if (nextChar && (nextChar === 'ゃ' || nextChar === 'ゅ' || nextChar === 'ょ' || 
                            nextChar === 'ぁ' || nextChar === 'ぃ' || nextChar === 'ぅ' || 
                            nextChar === 'ぇ' || nextChar === 'ぉ')) {
                chars.push(char + nextChar);
                i++;
            } 
            // っの処理
            else if (char === 'っ' || char === 'ッ') {
                chars.push('っ');
            } 
            else {
                chars.push(char);
            }
        }
        return chars;
    }

    // ローマ字出力の更新
    function updateRomajiOutput() {
        if (!showRomaji) {
            romajiOutput.textContent = '';
            return;
        }
        
        const chars = processOutputString(currentOutput);
        const romaji = chars.map(char => romajiMap[char] || char).join(' ');
        romajiOutput.textContent = romaji;
    }

    // 文字の発音
    function speakCharacter(char) {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance();
            
            // 「は」を「Ha」と発音するように強制
            if (char === 'は' || char === 'ハ') {
                utterance.text = 'ha';
            } else {
                utterance.text = char;
            }
            
            utterance.lang = 'ja-JP';
            utterance.rate = 0.8;
            speechSynthesis.speak(utterance);
        }
    }

    // 文字情報の表示
    function showCharacterInfo(char) {
        modalButtons.innerHTML = '';
        
        // ひらがな表示
        const hiraganaBtn = document.createElement('button');
        hiraganaBtn.className = 'kana-btn';
        hiraganaBtn.textContent = `Hiragana: ${char}`;
        hiraganaBtn.addEventListener('click', () => {
            currentScript = 'hiragana';
            hiraganaBtn.classList.add('active');
            katakanaBtn.classList.remove('active');
            alphabetBtn.classList.remove('active');
            renderOutput();
            kanaModal.classList.add('hidden');
        });
        modalButtons.appendChild(hiraganaBtn);
        
        // カタカナ表示
        const katakanaChar = katakanaMap[char] || char;
        const katakanaBtn = document.createElement('button');
        katakanaBtn.className = 'kana-btn';
        katakanaBtn.textContent = `Katakana: ${katakanaChar}`;
        katakanaBtn.addEventListener('click', () => {
            currentScript = 'katakana';
            katakanaBtn.classList.add('active');
            hiraganaBtn.classList.remove('active');
            alphabetBtn.classList.remove('active');
            renderOutput();
            kanaModal.classList.add('hidden');
        });
        modalButtons.appendChild(katakanaBtn);
        
        // アルファベット表示
        const romajiChar = romajiMap[char] || char;
        const alphabetBtn = document.createElement('button');
        alphabetBtn.className = 'kana-btn';
        alphabetBtn.textContent = `Alphabet: ${romajiChar}`;
        alphabetBtn.addEventListener('click', () => {
            currentScript = 'alphabet';
            alphabetBtn.classList.add('active');
            hiraganaBtn.classList.remove('active');
            katakanaBtn.classList.remove('active');
            renderOutput();
            kanaModal.classList.add('hidden');
        });
        modalButtons.appendChild(alphabetBtn);
        
        kanaModal.classList.remove('hidden');
    }

    // イベントリスナー
    document.querySelectorAll('.kana-btn[data-base]').forEach(button => {
        button.addEventListener('click', () => {
            const baseChar = button.getAttribute('data-base');
            createSubMenuButtons(baseChar);
        });
    });

    speakBtn.addEventListener('click', () => {
        if (currentOutput) {
            const utterance = new SpeechSynthesisUtterance();
            
            // 出力全体の「は」を「ha」に変換して発音
            let textToSpeak = currentOutput;
            if (currentScript === 'hiragana' || currentScript === 'katakana') {
                textToSpeak = textToSpeak.replace(/は/g, 'ha').replace(/ハ/g, 'ha');
            }
            
            utterance.text = textToSpeak;
            utterance.lang = 'ja-JP';
            utterance.rate = 0.8;
            speechSynthesis.speak(utterance);
        }
    });

    clearBtn.addEventListener('click', () => {
        currentOutput = '';
        renderOutput();
    });

    showRomajiBtn.addEventListener('click', () => {
        showRomaji = !showRomaji;
        showRomajiBtn.textContent = showRomaji ? 'Hide Romaji' : 'Show Romaji';
        updateRomajiOutput();
    });

    closeModal.addEventListener('click', () => {
        kanaModal.classList.add('hidden');
    });

    // 初期化
    updateKanaButtons();
});