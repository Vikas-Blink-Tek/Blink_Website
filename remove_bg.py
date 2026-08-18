from PIL import Image
import sys

img = Image.open(sys.argv[1])
img = img.convert("RGBA")
datas = img.getdata()

newData = []
for item in datas:
    # If the pixel is close to white, make it transparent
    if item[0] > 230 and item[1] > 230 and item[2] > 230:
        newData.append((255, 255, 255, 0))
    else:
        # Optional: anti-aliasing edge softening could be done, but keep simple
        newData.append(item)

img.putdata(newData)
img.save(sys.argv[2], "PNG")
