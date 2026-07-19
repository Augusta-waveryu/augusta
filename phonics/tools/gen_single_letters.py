#!/usr/bin/env python3
# 单字母字位改读"字母名"（w -> "double u" 读达不溜，a -> "ay"，e -> "ee"）
# 多字母字位(tr/ee/sh)已正确，不动
import re, os, asyncio, glob

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
DATA = os.path.join(ROOT, "data")
OUT = os.path.join(ROOT, "audio")
VOICE = "en-US-AriaNeural"

MULTI = [("i:","iː"),("eI","eɪ"),("aI","aɪ"),("OI","ɔɪ"),("aU","aʊ"),("@U","əʊ"),
         ("i@","ɪə"),("e@","eə"),("U@","ʊə"),("o:","ɔː"),("a:","ɑː"),("u:","uː"),
         ("3:","ɜː"),("ae","æ"),("V","ʌ"),("S","ʃ"),("Z","ʒ"),("T","θ"),("D","ð"),
         ("N","ŋ"),("tS","tʃ"),("dZ","dʒ"),("tr","tr"),("dr","dr"),("ts","ts"),("dz","dz")]
SINGLE = {"e":"e","o":"ɒ","I":"ɪ","U":"ʊ","@":"ə","V":"ʌ"}
def to_ipa(s):
    for a,b in MULTI: s=s.replace(a,b)
    if len(s)==1 and s in SINGLE: s=SINGLE[s]
    return s
def safe_ipa(ipa):
    return ''.join('u%04x'%ord(c) for c in ipa)

# 单字母 -> 字母名拼写（TTS 读出即字母名）
LETTER_NAME = {
  "a":"ay","b":"bee","c":"see","d":"dee","e":"ee","f":"ef","g":"gee",
  "h":"aitch","i":"eye","j":"jay","k":"kay","l":"el","m":"em","n":"en",
  "o":"oh","p":"pee","q":"cue","r":"ar","s":"ess","t":"tee","u":"you",
  "v":"vee","w":"double u","x":"ex","y":"why","z":"zee"
}

def collect_single_letter_items():
    """返回 {ipa: letter_name_text}，只含单字母字位"""
    items = {}
    for fn in sorted(glob.glob(os.path.join(DATA, "day-*.js"))):
        c = open(fn, encoding="utf-8").read()
        for m in re.finditer(r'"letter"\s*:\s*"([^"]*)"[^}]*?"phon"\s*:\s*"([^"]*)"', c):
            letter, phon = m.group(1), m.group(2)
            if len(letter) == 1 and len(phon.strip('/')) == 1 and letter in LETTER_NAME:
                ipa = to_ipa(phon.strip('/'))
                if ipa not in items:
                    items[ipa] = LETTER_NAME[letter]
    return items

async def synth(text, out):
    for _ in range(3):
        try:
            c = edge_tts.Communicate(text=text, voice=VOICE)
            await c.save(out)
            if os.path.getsize(out) > 1500:
                return True
        except Exception:
            await asyncio.sleep(0.6)
    return False

async def main():
    items = collect_single_letter_items()
    print("单字母字位数:", len(items))
    ok = 0
    for ipa, text in sorted(items.items()):
        out = os.path.join(OUT, "ipa_" + safe_ipa(ipa) + ".mp3")
        if await synth(text, out):
            ok += 1
            print(f"  OK {ipa} -> '{text}' -> {os.path.basename(out)}")
        else:
            print(f"  FAIL {ipa} -> '{text}'")
        await asyncio.sleep(0.15)
    print(f"成功 {ok}/{len(items)}")

if __name__ == "__main__":
    import edge_tts
    asyncio.run(main())
