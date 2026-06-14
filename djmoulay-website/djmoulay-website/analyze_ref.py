from PIL import Image

img = Image.open(r"c:\Users\Mohammed\Desktop\djmoulay-website\assets\reference.jpg")
print("Size:", img.size)

# Find the bounding box of the white area (the QR code)
# We start from the center and move outwards until we hit non-white/non-black (the gold border or background)
width, height = img.size
cx, cy = width // 2, height // 2

# We also need the logo in the center. Let's crop a central square for the logo.
# The logo is probably around 15-20% of the image width.
logo_size = int(width * 0.15)
logo_box = (cx - logo_size//2, cy - logo_size//2, cx + logo_size//2, cy + logo_size//2)
logo = img.crop(logo_box)
logo.save(r"c:\Users\Mohammed\Desktop\djmoulay-website\assets\extracted_logo.png")

print("Logo extracted.")

# Let's find the boundaries of the white QR code area.
# Scan left from cx, cy
left = cx
while left > 0:
    r,g,b = img.getpixel((left, cy))
    if r < 50 and g < 50 and b < 50: # hit black module, keep going
        left -= 1
        continue
    if r > 200 and g > 200 and b > 200: # hit white background, keep going
        left -= 1
        continue
    if r > 100 and g > 80 and b < 100: # hit gold border
        break
    left -= 1

print("Approximate QR code left bound from center:", left)
