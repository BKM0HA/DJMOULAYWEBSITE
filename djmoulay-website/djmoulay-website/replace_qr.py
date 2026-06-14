import cv2
import numpy as np
from PIL import Image, ImageDraw
import qrcode

def process_image():
    ref_path = r"c:\Users\Mohammed\Desktop\djmoulay-website\assets\reference.jpg"
    output_path = r"c:\Users\Mohammed\Desktop\djmoulay-website\assets\moulay_final.png"
    url = "https://www.djmoulay.com/links.html"
    
    # 1. Detect the QR code area using OpenCV
    img_cv = cv2.imread(ref_path)
    gray = cv2.cvtColor(img_cv, cv2.COLOR_BGR2GRAY)
    
    # Threshold to find bright white areas
    _, thresh = cv2.threshold(gray, 200, 255, cv2.THRESH_BINARY)
    
    # Find contours
    contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    # Find the largest contour that is roughly square
    max_area = 0
    best_rect = None
    
    height, width = img_cv.shape[:2]
    center_x, center_y = width // 2, height // 2
    
    for cnt in contours:
        x, y, w, h = cv2.boundingRect(cnt)
        area = w * h
        aspect_ratio = float(w) / h
        
        # Must be large, roughly square, and near the center
        if area > max_area and 0.8 < aspect_ratio < 1.2 and area > (width * height * 0.1):
            # Check if it's somewhat centralized
            if abs((x + w/2) - center_x) < width * 0.2 and abs((y + h/2) - center_y) < height * 0.2:
                max_area = area
                best_rect = (x, y, w, h)
                
    if not best_rect:
        print("Could not find the QR code bounding box.")
        return
        
    x, y, w, h = best_rect
    print(f"Found QR code at: x={x}, y={y}, w={w}, h={h}")
    
    # Let's add a small padding to w and h to ensure we cover the old QR code completely
    # But wait, if we make it slightly smaller, the original gold border will definitely stay visible
    padding = 4
    x += padding
    y += padding
    w -= padding * 2
    h -= padding * 2
    
    # 2. Extract the central logo (M with crown) using PIL
    img_pil = Image.open(ref_path).convert("RGBA")
    
    # The logo is roughly 25% of the QR code width
    logo_w = int(w * 0.28)
    logo_h = int(h * 0.28)
    logo_x = x + (w - logo_w) // 2
    logo_y = y + (h - logo_h) // 2
    
    # Extract
    central_logo = img_pil.crop((logo_x, logo_y, logo_x + logo_w, logo_y + logo_h))
    
    # Create a circular mask for the logo to make it blend well
    logo_mask = Image.new('L', (logo_w, logo_h), 0)
    draw_mask = ImageDraw.Draw(logo_mask)
    draw_mask.ellipse((0, 0, logo_w, logo_h), fill=255)
    
    central_logo_masked = Image.new('RGBA', (logo_w, logo_h), (0,0,0,0))
    central_logo_masked.paste(central_logo, (0, 0), mask=logo_mask)
    
    # 3. Generate the new QR code
    qr = qrcode.QRCode(
        version=5,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=15,
        border=2,
    )
    qr.add_data(url)
    qr.make(fit=True)
    
    qr_img = qr.make_image(fill_color="black", back_color="white").convert('RGBA')
    qr_img = qr_img.resize((w, h), Image.Resampling.LANCZOS)
    
    # Paste the extracted logo into the new QR code
    paste_x = (w - logo_w) // 2
    paste_y = (h - logo_h) // 2
    qr_img.paste(central_logo_masked, (paste_x, paste_y), mask=central_logo_masked)
    
    # 4. Create a rounded rectangle mask for the new QR code to match the original
    # The original QR code in the reference has rounded corners.
    radius = int(w * 0.08) # Roughly 8% of width for radius
    rounded_mask = Image.new('L', (w, h), 0)
    draw_rounded = ImageDraw.Draw(rounded_mask)
    draw_rounded.rounded_rectangle((0, 0, w, h), radius=radius, fill=255)
    
    # Apply rounded mask to QR code
    qr_rounded = Image.new('RGBA', (w, h), (0,0,0,0))
    qr_rounded.paste(qr_img, (0, 0), mask=rounded_mask)
    
    # 5. Composite everything back together
    img_pil.paste(qr_rounded, (x, y), mask=qr_rounded)
    
    # Save final
    img_pil.convert('RGB').save(output_path, quality=95)
    print(f"Success! Image saved to {output_path}")

if __name__ == "__main__":
    process_image()
