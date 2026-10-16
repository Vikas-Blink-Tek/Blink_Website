from PIL import Image
import sys

img = Image.open(sys.argv[1]).convert("RGBA")
pixels = img.load()

for y in range(img.height):
    for x in range(img.width):
        r, g, b, a = pixels[x, y]
        # Calculate grayscale / brightness
        brightness = (r + g + b) / 3
        
        # If it's mostly white, make it fully transparent
        # If it's darker, make it fully opaque
        # This will create a perfect alpha mask!
        alpha = int(255 - brightness)
        
        # We can also keep the original colors but just set the alpha channel
        pixels[x, y] = (r, g, b, alpha)

img.save(sys.argv[2], "PNG")
