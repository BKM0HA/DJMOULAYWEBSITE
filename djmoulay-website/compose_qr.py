import sys
from PIL import Image, ImageDraw

def create_rounded_qr(qr_path, size, border_color="#D4AF37", border_width=10, radius=30):
    qr_img = Image.open(qr_path).convert("RGBA")
    qr_img = qr_img.resize((size, size), Image.Resampling.LANCZOS)
    
    # Create a mask for rounded corners
    mask = Image.new('L', (size, size), 0)
    draw = ImageDraw.Draw(mask)
    draw.rounded_rectangle((0, 0, size, size), radius=radius, fill=255)
    
    # Apply rounded corners to QR
    rounded_qr = Image.new('RGBA', (size, size), (0,0,0,0))
    rounded_qr.paste(qr_img, (0, 0), mask=mask)
    
    # Add border
    if border_width > 0:
        border_overlay = Image.new('RGBA', (size, size), (0,0,0,0))
        border_draw = ImageDraw.Draw(border_overlay)
        border_draw.rounded_rectangle((0, 0, size, size), radius=radius, outline=border_color, width=border_width)
        rounded_qr = Image.alpha_composite(rounded_qr, border_overlay)
        
    return rounded_qr

def compose_image(bg_path, qr_path, output_path):
    bg = Image.open(bg_path).convert("RGBA")
    
    # Calculate target QR size based on the background size
    # Assuming we want the QR code to take up about 45% of the background width
    qr_target_size = int(bg.size[0] * 0.45)
    
    # Create the stylized QR code
    rounded_qr = create_rounded_qr(qr_path, size=qr_target_size, border_color="#cda852", border_width=15, radius=40)
    
    # Calculate center position
    x = (bg.size[0] - rounded_qr.size[0]) // 2
    y = (bg.size[1] - rounded_qr.size[1]) // 2
    
    # Paste QR code onto background
    bg.paste(rounded_qr, (x, y), rounded_qr)
    
    # Save final image
    bg.convert("RGB").save(output_path)
    print(f"Final composed image saved to {output_path}")

if __name__ == "__main__":
    bg_path = r"C:\Users\Mohammed\.gemini\antigravity\brain\02572d72-073d-4262-8ebc-8aa8f8ef2843\moulay_qr_bg_1781463595362.png"
    qr_path = r"c:\Users\Mohammed\Desktop\djmoulay-website\assets\qr_code_links.png"
    output_path = r"c:\Users\Mohammed\Desktop\djmoulay-website\assets\moulay_pro_qr.png"
    
    compose_image(bg_path, qr_path, output_path)
