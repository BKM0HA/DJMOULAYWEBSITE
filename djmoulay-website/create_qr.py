import qrcode
from PIL import Image

def generate_qr_with_logo(url, logo_path, output_path):
    # Load the logo
    logo = Image.open(logo_path)
    
    # Adjust logo size
    basewidth = 150
    wpercent = (basewidth / float(logo.size[0]))
    hsize = int((float(logo.size[1]) * float(wpercent)))
    logo = logo.resize((basewidth, hsize), Image.Resampling.LANCZOS)
    
    # Create the QR Code object with High Error Correction (allows up to 30% of QR to be covered)
    qr = qrcode.QRCode(
        version=5,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=15,
        border=2,
    )
    
    qr.add_data(url)
    qr.make(fit=True)
    
    # Create the QR code image
    qr_img = qr.make_image(fill_color="black", back_color="white").convert('RGB')
    
    # Calculate position to center the logo
    pos = ((qr_img.size[0] - logo.size[0]) // 2, (qr_img.size[1] - logo.size[1]) // 2)
    
    # If logo has an alpha channel, use it as a mask to support transparency
    if logo.mode == 'RGBA':
        qr_img.paste(logo, pos, mask=logo)
    else:
        qr_img.paste(logo, pos)
        
    # Save the final image
    qr_img.save(output_path)
    print(f"QR code successfully generated and saved at: {output_path}")

if __name__ == "__main__":
    generate_qr_with_logo(
        url="https://www.djmoulay.com/links.html",
        logo_path="assets/logo.png",
        output_path="assets/qr_code_links.png"
    )
