#!/usr/bin/env python3
# 用 edge-tts（微软神经语音）纯文本合成音素音频
# 重要：edge-tts 不解析 SSML <phoneme> 标签，会把整段 SSML 当文本读（5秒乱音）
#       所以改用纯文本读「字母组合(letter)」或「代表词」——多字母组合 TTS 读得准(tr=/tr/ ee=/iː/ sh=/ʃ/)
# 产物：audio/ipa_{safe}.mp3 —— safe 为 IPA 各字符 Unicode codepoint 拼接（页面端用同名函数构造路径）
import re, os, asyncio

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
DATA = os.path.join(ROOT, "data")
OUT = os.path.join(ROOT, "audio")
VOICE = "en-US-AriaNeural"

# ASCII 转写 -> 标准 Unicode IPA
MULTI = [("i:","iː"),("eI","eɪ"),("aI","aɪ"),("OI","ɔɪ"),("aU","aʊ"),("@U","əʊ"),
         ("i@","ɪə"),("e@","eə"),("U@","ʊə"),("o:","ɔː"),("a:","ɑː"),("u:","uː"),
         ("3:","ɜː"),("ae","æ"),("V","ʌ"),("S","ʃ"),("Z","ʒ"),("T","θ"),("D","ð"),
         ("N","ŋ"),("tS","tʃ"),("dZ","dʒ"),("tr","tr"),("dr","dr"),("ts","ts"),("dz","dz")]
SINGLE = {"e":"e","o":"ɒ","I":"ɪ","U":"ʊ","@":"ə","V":"ʌ"}

def to_ipa(s):
    for a,b in MULTI: s = s.replace(a, b)
    if len(s) == 1 and s in SINGLE: s = SINGLE[s]
    return s

def safe_ipa(ipa):
    return ''.join('u%04x' % ord(c) for c in ipa)

def collect_items():
    """返回 {ipa: speak_text} —— 字位用 letter，目标音用代表词"""
    items = {}  # ipa -> text
    # 1) day-NN breakdown: phon -> letter
    for fn in sorted(os.listdir(DATA)):
        if not (fn.startswith("day-") and fn.endswith(".js")): continue
        c = open(os.path.join(DATA, fn), encoding="utf-8").read()
        # 提取所有 (letter, phon) 对
        for m in re.finditer(r'"letter"\s*:\s*"([^"]*)"[^}]*?"phon"\s*:\s*"([^"]*)"', c):
            letter, phon = m.group(1), m.group(2)
            ipa = to_ipa(phon.strip('/'))
            if ipa not in items and letter:
                items[ipa] = letter
        # 也提取 day 号 -> 第一个 word（用于目标音代表词）
        day_match = re.search(r'"day"\s*:\s*(\d+)', c)
        word_match = re.search(r'"word"\s*:\s*"([^"]*)"', c)
        if day_match and word_match:
            day_items[int(day_match.group(1))] = word_match.group(1)
    # 2) days-base 目标音: ipa -> 代表词
    src = open(os.path.join(DATA, "days-base.js"), encoding="utf-8").read()
    for m in re.finditer(r'"day"\s*:\s*(\d+)[^}]*?"ipa"\s*:\s*"/([^/]*)/"', src):
        day, ipa_raw = int(m.group(1)), m.group(2)
        ipa = to_ipa(ipa_raw)
        if ipa not in items:
            # 用该 day 第一个词作为代表
            rep = day_items.get(day, "")
            if rep:
                items[ipa] = rep
            else:
                items[ipa] = ipa_raw  # 兜底
    return items

day_items = {}  # day -> first word

async def synth(text, out):
    """纯文本合成（不使用 SSML）"""
    for attempt in range(3):
        try:
            c = edge_tts.Communicate(text=text, voice=VOICE)
            await c.save(out)
            if os.path.getsize(out) > 1500:
                return True
        except Exception:
            await asyncio.sleep(0.6)
    return False

async def run():
    os.makedirs(OUT, exist_ok=True)
    items = collect_items()
    print("唯一音标数:", len(items), flush=True)
    ok, fail = 0, []
    for ipa, text in sorted(items.items()):
        out = os.path.join(OUT, "ipa_" + safe_ipa(ipa) + ".mp3")
        # force 覆盖（旧 SSML 乱音必须替换）
        if await synth(text, out):
            ok += 1
        else:
            fail.append((ipa, text))
        await asyncio.sleep(0.15)
    print("成功: %d  失败: %d" % (ok, len(fail)), flush=True)
    for ipa, text in fail:
        print("  FAIL", repr(ipa), text)

if __name__ == "__main__":
    import edge_tts
    asyncio.run(run())
