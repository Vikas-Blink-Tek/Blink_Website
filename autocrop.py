from PIL import Image
import sys

def crop_transparent(image_path, output_path):
    img = Image.open(image_path)
    img = img.convert("RGBA")
    bbox = img.getbbox()
    if bbox:
        img = img.crop(bbox)
        img.save(output_path, "PNG")
        print("Cropped successfully")
    else:
        print("No bounding box found (image might be completely transparent)")

crop_transparent(sys.argv[1], sys.argv[2])
