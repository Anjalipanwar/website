# Dev helper: tile screenshots into contact sheets. python3 scripts/sheet.py <prefix> <cols> <scale>
import sys, glob
from PIL import Image
prefix, cols, scale = sys.argv[1], int(sys.argv[2]), float(sys.argv[3])
files = sorted(glob.glob(f'shots/{prefix}-[0-9][0-9].png'))
per = cols * 2
for s in range(0, len(files), per):
    ims = [Image.open(f) for f in files[s:s+per]]
    w, h = int(ims[0].width*scale), int(ims[0].height*scale)
    rows = (len(ims)+cols-1)//cols
    sheet = Image.new('RGB', (cols*w + (cols-1)*6, rows*h + (rows-1)*6), '#888')
    for i, im in enumerate(ims):
        sheet.paste(im.resize((w, h), Image.LANCZOS), ((i%cols)*(w+6), (i//cols)*(h+6)))
    sheet.save(f'shots/{prefix}-sheet{s//per}.png')
    print(f'shots/{prefix}-sheet{s//per}.png')
