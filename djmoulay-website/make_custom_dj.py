import os
import qrcode
from PIL import Image, ImageDraw, ImageFont, ImageFilter

def create_rounded_qr_with_logo(url, logo_path, size, border_color="#D4AF37", border_width=10, radius=30):
    # Create QR
    qr = qrcode.QRCode(
        version=5,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=15,
        border=2,
    )
    qr.add_data(url)
    qr.make(fit=True)
    qr_img = qr.make_image(fill_color="black", back_color="white").convert('RGBA')
    qr_img = qr_img.resize((size, size), Image.Resampling.LANCZOS)
    
    # Add logo
    try:
        logo = Image.open(logo_path).convert("RGBA")
        logo_size = int(size * 0.25)
        logo = logo.resize((logo_size, logo_size), Image.Resampling.LANCZOS)
        
        # Mask for logo
        logo_mask = Image.new('L', (logo_size, logo_size), 0)
        draw_mask = ImageDraw.Draw(logo_mask)
        draw_mask.ellipse((0, 0, logo_size, logo_size), fill=255)
        
        logo_masked = Image.new('RGBA', (logo_size, logo_size), (0,0,0,0))
        logo_masked.paste(logo, (0, 0), mask=logo_mask)
        
        paste_pos = ((size - logo_size)//2, (size - logo_size)//2)
        qr_img.paste(logo_masked, paste_pos, mask=logo_masked)
    except Exception as e:
        print("Could not add logo:", e)
    
    # Rounded mask
    mask = Image.new('L', (size, size), 0)
    draw = ImageDraw.Draw(mask)
    draw.rounded_rectangle((0, 0, size, size), radius=radius, fill=255)
    
    rounded_qr = Image.new('RGBA', (size, size), (0,0,0,0))
    rounded_qr.paste(qr_img, (0, 0), mask=mask)
    
    # Border
    if border_width > 0:
        border_overlay = Image.new('RGBA', (size, size), (0,0,0,0))
        border_draw = ImageDraw.Draw(border_overlay)
        border_draw.rounded_rectangle((0, 0, size, size), radius=radius, outline=border_color, width=border_width)
        rounded_qr = Image.alpha_composite(rounded_qr, border_overlay)
        
    return rounded_qr

def add_glow_text(text, font, fill_color, glow_color, max_width):
    # Create a temporary image for the glowing text
    # Make it very tall to accommodate the glow
    txt_img = Image.new('RGBA', (max_width, int(font.size * 3)), (0,0,0,0))
    txt_draw = ImageDraw.Draw(txt_img)
    
    # Get text bounding box to center it
    bbox = txt_draw.textbbox((0, 0), text, font=font)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]
    
    tx = (max_width - tw) // 2
    ty = int(font.size * 0.5)
    
    # Draw glow (multiple layers of text with increasing blur)
    for offset in range(1, 4):
        txt_draw.text((tx-offset, ty-offset), text, font=font, fill=glow_color)
        txt_draw.text((tx+offset, ty+offset), text, font=font, fill=glow_color)
        txt_draw.text((tx-offset, ty+offset), text, font=font, fill=glow_color)
        txt_draw.text((tx+offset, ty-offset), text, font=font, fill=glow_color)
    
    # Blur the glow layer
    txt_img = txt_img.filter(ImageFilter.GaussianBlur(3))
    
    # Draw main text
    txt_draw_main = ImageDraw.Draw(txt_img)
    txt_draw_main.text((tx, ty), text, font=font, fill=fill_color)
    
    return txt_img

def main():
    bg_path = r"C:\Users\Mohammed\.gemini\antigravity\brain\02572d72-073d-4262-8ebc-8aa8f8ef2843\rai_dj_6_luxury_1781464616529.png"
    logo_path = r"c:\Users\Mohammed\Desktop\djmoulay-website\assets\logo.png"
    output_path = r"c:\Users\Mohammed\Desktop\djmoulay-website\assets\dj_moulay_rai.png"
    url = "https://www.djmoulay.com/links.html"
    
    # Load background
    bg = Image.open(bg_path).convert("RGBA")
    width, height = bg.size
    
    # QR Code size
    qr_size = int(width * 0.40)
    qr = create_rounded_qr_with_logo(url, logo_path, qr_size, border_color="#D4AF37", border_width=12, radius=40)
    
    # Paste QR in center
    qx = (width - qr_size) // 2
    qy = (height - qr_size) // 2
    bg.paste(qr, (qx, qy), qr)
    
    # Add Text "DJ MOULAY"
    font_path = r"C:\Windows\Fonts\impact.ttf"
    font_size = int(width * 0.09)
    try:
        font = ImageFont.truetype(font_path, font_size)
    except:
        font = ImageFont.load_default()
        
    text = "DJ MOULAY"
    
    # Create the text image with glow
    txt_img = add_glow_text(text, font, fill_color="#ffffff", glow_color="#D4AF37", max_width=width)
    
    # Paste text above the QR code
    txt_y = int(qy / 2) - (txt_img.size[1] // 2)
    if txt_y < 0: txt_y = 10
    
    bg.paste(txt_img, (0, txt_y), txt_img)
    
    # Add subtitle
    subtitle = "SCAN TO CONNECT"
    sub_font_size = int(width * 0.04)
    try:
        sub_font = ImageFont.truetype(font_path, sub_font_size)
    except:
        sub_font = ImageFont.load_default()
        
    sub_img = add_glow_text(subtitle, sub_font, fill_color="#D4AF37", glow_color="#000000", max_width=width)
    
    # Paste subtitle below QR code
    sub_y = qy + qr_size + int((height - (qy + qr_size)) / 2) - (sub_img.size[1] // 2)
    bg.paste(sub_img, (0, sub_y), sub_img)
    
    # Save
    bg.convert("RGB").save(output_path, quality=95)
    print(f"Generated successfully: {output_path}")

if __name__ == "__main__":
    main()
