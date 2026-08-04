import pytesseract
from PIL import Image
import sys

# Read image path passed from Node.js
image_path = sys.argv[1]

# Read image
image = Image.open(image_path)

# Extract text
text = pytesseract.image_to_string(image)

# Print extracted text
print(text)