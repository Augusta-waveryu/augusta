#!/usr/bin/env python3
# 用 espeak 从 IPA [[...]] 精确合成音素音频（音素准，机器音）
# 解决：edge-tts/espeak 读字母组合都读字母名(S-H)，只有从 IPA 直接合成才发音素
# 产物：audio/ipa_{safe}.mp3 —— 文件名与页面 safeIpa 一致(全小写)
import re, os, glob, subprocess

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
DATA = os.path.join(ROOT, "data")
OUT = os.path.join(ROOT, "audio")

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

# Unicode IPA -> espeak 音素符号(多字符优先)
UNI_TO_ESP = [
  ("iː","i:"),("ɔː","O:"),("ɑː","A:"),("uː","u:"),("ɜː","3:"),
  ("eɪ","eI"),("aɪ","aI"),("ɔɪ","OI"),("aʊ","aU"),("əʊ","@U"),
  ("ɪə","I@"),("eə","e@"),("ʊə","U@"),
  ("tʃ","tS"),("dʒ","dZ"),("tr","tr"),("dr","dr"),("ts","ts"),("dz","dz"),
  ("ɪ","I"),("æ","a"),("ʌ","V"),("ɒ","Q"),("ʊ","U"),("ə","@"),
  ("ʃ","S"),("ʒ","Z"),("θ","T"),("ð","D"),("ŋ","N"),("ɡ","g"),
  ("ɑ","A:"),("ɔ","O:"),
]
def uni_to_espeak(s):
    for u,e in UNI_TO_ESP: s=s.replace(u,e)
    return s

def collect_phons():
    phons=set()
    for fn in sorted(glob.glob(os.path.join(DATA,"day-*.js"))):
        c=open(fn,encoding="utf-8").read()
        for m in re.findall(r'"phon"\s*:\s*"([^"]*)"', c):
            phons.add(to_ipa(m.strip('/')))
    src=open(os.path.join(DATA,"days-base.js"),encoding="utf-8").read()
    for m in re.findall(r'"ipa"\s*:\s*"/([^/]*)/"', src):
        phons.add(to_ipa(m))
    return phons

def synth(ipa, out_mp3):
    esp = uni_to_espeak(ipa)
    wav = "/tmp/espeak_tmp.wav"
    try:
        subprocess.run(["espeak","-v","en-us","-w",wav,f"[[{esp}]]"],
                       capture_output=True, timeout=10)
        if not os.path.exists(wav) or os.path.getsize(wav) < 1000:
            return False
        subprocess.run(["lame","--quiet","-m","m","-b","32",wav,out_mp3],
                       capture_output=True, timeout=10)
        return os.path.exists(out_mp3) and os.path.getsize(out_mp3) > 500
    except Exception:
        return False

def main():
    os.makedirs(OUT, exist_ok=True)
    phons = collect_phons()
    print("唯一音标数:", len(phons), flush=True)
    ok, fail = 0, []
    for ipa in sorted(phons):
        out = os.path.join(OUT, "ipa_" + safe_ipa(ipa) + ".mp3")
        esp = uni_to_espeak(ipa)
        if synth(ipa, out):
            ok += 1
        else:
            fail.append((ipa, esp))
    print(f"成功 {ok}/{len(phons)}  失败 {len(fail)}", flush=True)
    for ipa, esp in fail[:10]:
        print(f"  FAIL ipa={ipa!r} espeak=[[{esp}]]")

if __name__ == "__main__":
    main()
