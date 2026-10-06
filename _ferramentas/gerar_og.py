"""Gera as imagens de compartilhamento (1200x630) em assets/img/og/.
Uso, na raiz do site:  python _ferramentas/gerar_og.py            (todos os posts + guia + autor)
                       python _ferramentas/gerar_og.py post-slug  (só os slugs informados)
Precisa do Google Chrome instalado e do Pillow (pip install pillow).
"""
import io, os, re, sys, glob, html, subprocess, tempfile
from PIL import Image
sys.stdout.reconfigure(encoding='utf-8')
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CHROME = r'C:\Program Files\Google\Chrome\Application\chrome.exe'
OUT = os.path.join(ROOT, 'assets', 'img', 'og')
os.makedirs(OUT, exist_ok=True)
TMP = tempfile.mkdtemp(prefix='og_')
SO = set(sys.argv[1:])

home = io.open(os.path.join(ROOT, 'index.html'), encoding='utf-8').read()
svg = re.search(r'(?s)<section class="hero".*?(<svg viewBox="0 0 100 97".*?</svg>)', home).group(1)
svg = svg.replace('aria-hidden="true"', 'aria-hidden="true" class="ic"')
IGOR = 'file:///' + os.path.join(ROOT, 'assets', 'img', 'igor.png').replace('\\', '/')

def page(overline, title, rodape, foto=False):
    size = 66 if len(title) <= 60 else (58 if len(title) <= 80 else 52)
    foto_html = f'<img class="foto" src="{IGOR}">' if foto else ''
    return f'''<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,500;1,500&family=Jost:wght@300;400;500&display=swap" rel="stylesheet">
<style>
*{{margin:0;padding:0;box-sizing:border-box}}
html,body{{width:1200px;height:630px;overflow:hidden}}
body{{background:linear-gradient(160deg,#0E1E35 0%,#0A1628 55%,#081525 100%);color:#fff;font-family:'Jost',sans-serif;position:relative}}
body::before{{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 55% 60% at 88% 8%,rgba(36,213,255,.22),transparent 70%),radial-gradient(ellipse 40% 50% at 0% 100%,rgba(22,112,195,.25),transparent 70%)}}
body::after{{content:'';position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.035) 1px,transparent 1px);background-size:60px 60px;mask-image:linear-gradient(180deg,rgba(0,0,0,.9),transparent 85%)}}
.wrap{{position:relative;z-index:2;height:100%;padding:64px 72px 58px;display:flex;flex-direction:column}}
.marca{{display:flex;align-items:center;gap:16px}}
.ic{{width:46px;height:auto;color:#fff}}
.marca span{{font-weight:400;font-size:17px;letter-spacing:.42em;text-transform:uppercase}}
.over{{margin-top:auto;font-weight:500;font-size:17px;letter-spacing:.3em;text-transform:uppercase;color:#24D5FF}}
h1{{font-family:'Cormorant',serif;font-weight:500;font-size:{size}px;line-height:1.08;margin-top:18px;max-width:{'820px' if foto else '1000px'};letter-spacing:-.2px}}
.rod{{margin-top:34px;display:flex;align-items:center;gap:18px;font-size:16px;letter-spacing:.14em;color:rgba(255,255,255,.72);text-transform:uppercase}}
.rod i{{display:block;width:90px;height:3px;border-radius:3px;background:linear-gradient(90deg,#1670C3,#1099E9 48%,#24D5FF)}}
.foto{{position:absolute;z-index:3;right:80px;top:150px;width:250px;height:250px;border-radius:50%;object-fit:cover;border:3px solid rgba(36,213,255,.55);box-shadow:0 30px 80px rgba(0,0,0,.45)}}
</style></head><body>{foto_html}<div class="wrap">
<div class="marca">{svg}<span>Komplexa Hotéis</span></div>
<div class="over">{html.escape(overline)}</div>
<h1>{html.escape(title)}</h1>
<div class="rod"><i></i>{html.escape(rodape)}</div>
</div></body></html>'''

itens = []
for f in sorted(glob.glob(os.path.join(ROOT, 'blog', 'post-*.html'))):
    s = io.open(f, encoding='utf-8').read()
    over = re.search(r'<section class="post-hero">.*?<span class="overline">(.*?)</span>', s, re.S).group(1)
    t = re.sub(r'<[^>]+>', '', re.search(r'(?s)<h1[^>]*>(.*?)</h1>', s).group(1)).strip()
    itens.append((os.path.basename(f)[:-5], page(over, t, 'komplexahoteis.com · Blog')))
itens.append(('guia-reservas-diretas', page('Guia completo', 'Reservas diretas para hotéis e pousadas: o guia completo', 'komplexahoteis.com · Guia 2026')))
itens.append(('calculadora-comissao-booking', page('Ferramenta gratuita', 'Calculadora de comissão do Booking para hotéis e pousadas', 'komplexahoteis.com · Calculadora')))
itens.append(('igor-salomao', page('Fundador · Komplexa Hotéis', 'Igor Salomão', 'Marketing e reservas diretas para hotelaria', foto=True)))

for slug, doc in itens:
    if SO and slug not in SO:
        continue
    hp = os.path.join(TMP, slug + '.html')
    io.open(hp, 'w', encoding='utf-8').write(doc)
    png = os.path.join(TMP, slug + '.png')
    subprocess.run([CHROME, '--headless=new', '--disable-gpu', '--hide-scrollbars', '--allow-file-access-from-files',
                    '--window-size=1200,630', '--virtual-time-budget=6000', f'--screenshot={png}',
                    'file:///' + hp.replace('\\', '/')], capture_output=True, timeout=90)
    im = Image.open(png).convert('RGB')
    assert im.size == (1200, 630), (slug, im.size)
    jpg = os.path.join(OUT, slug + '.jpg')
    im.save(jpg, 'JPEG', quality=84, optimize=True, progressive=True)
    print(f'{slug}.jpg {os.path.getsize(jpg)//1024}KB')
