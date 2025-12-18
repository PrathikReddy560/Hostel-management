from cairosvg import svg2png
import os

# Ensure the images directory exists
os.makedirs('static/images', exist_ok=True)

# Convert SVG to PNG
svg2png(url='static/images/logo.svg',
        write_to='static/images/logo.png',
        output_width=200,
        output_height=200) 