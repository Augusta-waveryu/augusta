#!/usr/bin/env python3
# 用 edge-tts（微软神经语音）从国际音标(IPA)精确合成音素音频
# 解决：espeak 机器音难听 + 浏览器 TTS 不识音标 的两难
# 产物：audio/ipa_{safe}.mp3 —— safe 为 IPA 各字符 Unicode codepoint 拼接（页面端用同名函数构造路径）
import re, os, asyncio, sys, json

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
DATA = os.path.join(ROOT, "data")
OUT = os.path.join(ROOT, "audio")
VOICE = "en-US-AriaNeural"   # 清晰女声；可换 en-US-GuyNeural / en-US-JennyNeural

# ASCII 转写 -> 标准 Unicode IPA（多字符优先，最后处理单字符音素）
MULTI = [("i:","iː"),("eI","eɪ"),("aI","aɪ"),("OI","ɔɪ"),("aU","aʊ"),("@U","əʊ"),
         ("i@","ɪə"),("e@","eə"),("U@","ʊə"),("o:","ɔː"),("a:","ɑː"),("u:","uː"),
         ("3:","ɜː"),("ae","æ"),("V","ʌ"),("S","ʃ"),("Z","ʒ"),("T","θ"),("D","ð"),
         ("N","ŋ"),("tS","tʃ"),("dZ","dʒ"),("tr","tr"),("dr","dr"),("ts","ts"),("dz","dz")]
SINGLE = {"e":"e","o":"ɒ","I":"ɪ","U":"ʊ","@":"ə","V":"ʌ"}

def to_ipa(s):
    for a,b in MULTI:
        s = s.replace(a, b)
    if len(s) == 1 and s in SINGLE:
        s = SINGLE[s]
    return s

def safe_ipa(ipa):
    # 小写！线上 Vercel 静态托管大小写敏感，须与页面 day.html 的 safeIpa 一致（全小写）
    return ''.join('u%04x' % ord(c) for c in ipa)

def collect_ipas():
    ipas = set()
    # 1) days-base 目标音
    src = open(os.path.join(DATA, "days-base.js"), encoding="utf-8").read()
    for m in re.findall(r'"ipa"\s*:\s*"/([^/]*)/"', src):
        ipas.add(to_ipa(m))
    # 2) day-NN 的 breakdown.phon（字位音标）
    n_phon = 0
    for fn in sorted(os.listdir(DATA)):
        if not (fn.startswith("day-") and fn.endswith(".js")):
            continue
        c = open(os.path.join(DATA, fn), encoding="utf-8").read()
        for m in re.findall(r'"phon"\s*:\s*"([^"]*)"', c):
            ipas.add(to_ipa(m.strip('/')))
            n_phon += 1
    print("字位 phon 提取条数:", n_phon, flush=True)
    return ipas

async def synth(ph, out):
    text = '<phoneme alphabet="ipa" ph="%s">a</phoneme>' % ph
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
    ipas = sorted(collect_ipas())
    print("唯一 IPA 数:", len(ipas), flush=True)
    ok, fail = 0, []
    for ph in ipas:
        out = os.path.join(OUT, "ipa_" + safe_ipa(ph) + ".mp3")
        if os.path.exists(out) and os.path.getsize(out) > 1500:
            ok += 1
            continue
        if await synth(ph, out):
            ok += 1
        else:
            fail.append(ph)
        await asyncio.sleep(0.15)
    print("成功: %d  失败: %d" % (ok, len(fail)), flush=True)
    for f in fail:
        print("  FAIL", f)

if __name__ == "__main__":
    import edge_tts  # 确保 import 成功
    asyncio.run(run())
