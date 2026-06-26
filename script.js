// ============================================================
// KONFIGURASI - API SERVER
// ============================================================
const API_BASE_URL = 'http://szxennofficialid.qoupayid.xyz:3529';
const API_CHAT = '/chat';
const API_GENERATE_KEY = '/generate-key';
const API_VERIFY = '/verify-key';
const API_TTS = '/tts';
const API_VOICE_TO_TEXT = '/voice-to-text';

// API Key Default
const DEFAULT_API_KEY = 'ziferr_ZMw1cPDj1kvzwOtAXWQC4KhLwVrmVgu0';

let currentApiKey = localStorage.getItem('ziferr_api_key') || DEFAULT_API_KEY;

console.log('🤖 Ziferr Assistant Running');
console.log('🔑 API Key:', currentApiKey);

// ============================================================
// FUNGSI CHAT
// ============================================================
async function chatWithZiferr(message) {
    try {
        const response = await fetch(API_BASE_URL + API_CHAT, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + currentApiKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: message,
                model: 'llama-3.3-70b-versatile'
            })
        });

        const data = await response.json();

        if (data.success) {
            console.log('🤖 Ziferr:', data.response);
            return data.response;
        } else {
            console.error('❌ Error:', data.error);
            return '❌ Error: ' + (data.error || 'Unknown error');
        }
    } catch (error) {
        console.error('❌ Fetch Error:', error.message);
        return '❌ Error: ' + error.message;
    }
}

// ============================================================
// FUNGSI GENERATE API KEY
// ============================================================
async function generateApiKey(name) {
    try {
        const response = await fetch(API_BASE_URL + API_GENERATE_KEY, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name || 'myapp'
            })
        });

        const data = await response.json();

        if (data.success) {
            console.log('✅ API Key:', data.apiKey);
            return data.apiKey;
        } else {
            console.error('❌ Error:', data.error);
            return null;
        }
    } catch (error) {
        console.error('❌ Error:', error.message);
        return null;
    }
}

// ============================================================
// FUNGSI VERIFY API KEY
// ============================================================
async function verifyApiKey(apiKey) {
    try {
        const response = await fetch(API_BASE_URL + API_VERIFY, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + (apiKey || currentApiKey)
            }
        });

        const data = await response.json();

        if (data.success && data.valid) {
            console.log('✅ API Key VALID!');
            console.log('📌 Nama:', data.data.name);
            console.log('📊 Used:', data.data.used, 'kali');
            return true;
        } else {
            console.error('❌ API Key TIDAK VALID!');
            return false;
        }
    } catch (error) {
        console.error('❌ Error:', error.message);
        return false;
    }
}

// ============================================================
// FUNGSI TTS (Text-to-Speech)
// ============================================================
async function textToSpeech(text) {
    try {
        const response = await fetch(API_BASE_URL + API_TTS, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text: text
            })
        });

        const data = await response.json();

        if (data.success && data.audio) {
            const audio = new Audio('data:audio/mp3;base64,' + data.audio);
            audio.play();
            console.log('🔊 Playing TTS...');
            return true;
        } else {
            console.error('❌ TTS Error:', data.error);
            return false;
        }
    } catch (error) {
        console.error('❌ TTS Error:', error.message);
        return false;
    }
}

// ============================================================
// SET API KEY
// ============================================================
function setApiKey(newKey) {
    if (!newKey || !newKey.startsWith('ziferr_')) {
        console.error('❌ API Key harus dimulai dengan "ziferr_"!');
        return false;
    }
    currentApiKey = newKey;
    localStorage.setItem('ziferr_api_key', newKey);
    console.log('✅ API Key updated:', newKey);
    return true;
}

// ============================================================
// CONTOH PENGGUNAAN DI CONSOLE
// ============================================================
console.log('\n📌 CONTOH PENGGUNAAN:');
console.log('1. Chat: await chatWithZiferr("Halo Ziferr!")');
console.log('2. Generate Key: await generateApiKey("myapp")');
console.log('3. Verify Key: await verifyApiKey()');
console.log('4. TTS: await textToSpeech("Halo Bang")');
console.log('5. Set Key: setApiKey("ziferr_xxxxx")');
console.log('\n💡 Buka Console Browser (F12) untuk mencoba!\n');

// ============================================================
// AUTO TEST
// ============================================================
(async function autoTest() {
    console.log('🔍 Verifikasi API Key...');
    const valid = await verifyApiKey(currentApiKey);
    if (valid) {
        console.log('✅ API Key siap digunakan!');
        console.log('💬 Coba: await chatWithZiferr("Halo Ziferr!")');
    } else {
        console.log('⚠️ API Key tidak valid!');
        console.log('💡 Set API Key: setApiKey("ziferr_xxxxx")');
        console.log('💡 Atau buat baru: await generateApiKey("myapp")');
    }
})();