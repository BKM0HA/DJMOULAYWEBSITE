from PIL import Image

def convert_png_to_pdf(png_path, pdf_path):
    try:
        # Open the image
        img = Image.open(png_path)
        
        # Convert to RGB (PDF doesn't support RGBA with the default PIL save method easily)
        if img.mode == 'RGBA':
            background = Image.new('RGB', img.size, (255, 255, 255))
            background.paste(img, mask=img.split()[3])
            img = background
        elif img.mode != 'RGB':
            img = img.convert('RGB')
            
        # Save as PDF with high resolution
        img.save(pdf_path, "PDF", resolution=300.0)
        print(f"Successfully converted to PDF: {pdf_path}")
    except Exception as e:
        print(f"Error converting to PDF: {e}")

if __name__ == "__main__":
    png_file = r"c:\Users\Mohammed\Desktop\djmoulay-website\assets\moulay_final.png"
    pdf_file = r"c:\Users\Mohammed\Desktop\djmoulay-website\assets\moulay_final.pdf"
    convert_png_to_pdf(png_file, pdf_file)
