from PIL import Image
import sys

img = Image.open(sys.argv[1])
width, height = img.size

# The user wants the banners and shops. In the original image, this is the bottom ~50-60%.
# Let's crop the bottom 60% of the image.
crop_top = int(height * 0.45)
crop_bottom = int(height * 0.95) # Maybe cut a bit of the empty floor at the very bottom
cropped = img.crop((0, crop_top, width, crop_bottom))
cropped.save(sys.argv[2], quality=95)
print(f"Cropped to {width}x{crop_bottom - crop_top}")
