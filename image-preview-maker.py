from pathlib import Path
from PIL import Image
import re

# Define the clipping sizes and y-offsets for each type
CLIPPING_RULES = {
    r"^portrait": {"size": (32, 32), "y_offset": 0},    # Portraits at the top
    r"^map": {"size": (16, 16), "y_offset": 56},        # Maps at the bottom
    r"^(?!p|m)": {"size": (16, 24), "y_offset": 32},  # Type A in the middle
}

# Define horizontal spacing for rows
HORIZONTAL_SPACING = {
    0: 0,   # Row 1 (portrait) has no spacing
    32: 16, # Row 2 (type a) has 16px spacing
    56: 16  # Row 3 (map) has 16px spacing
}

# Function to determine clipping size and y-offset based on filename
def get_clipping_info(filename):
    for pattern, info in CLIPPING_RULES.items():
        if re.match(pattern, filename.lower()):
            return info
    return {"size": (16, 24), "y_offset": 32}  # Default values

# Function to create a preview for a single subfolder
def create_preview(subfolder, output_dir):
    # Collect all .png files in the subfolder
    png_files = list(subfolder.glob("*.png"))
    if not png_files:
        print(f"No PNG files found in {subfolder}.")
        return

    # Organize clippings into rows
    clippings_by_row = {0: [], 32: [], 56: []}  # Rows for y_offsets 0, 32, and 56
    for png_file in png_files:
        try:
            # Determine clipping size and y-offset based on filename
            clipping_info = get_clipping_info(png_file.stem)
            clipping_size = clipping_info["size"]
            y_offset = clipping_info["y_offset"]

            # Open the image and crop the desired region
            with Image.open(png_file) as img:
                clipping = img.crop((0, 0, clipping_size[0], clipping_size[1]))
                clippings_by_row[y_offset].append(clipping)
        except Exception as e:
            print(f"Error processing {png_file}: {e}")

    # Determine grid size for preview
    cols = max(len(row) for row in clippings_by_row.values())
    grid_width = cols * max(clip.width for row in clippings_by_row.values() for clip in row) + sum(HORIZONTAL_SPACING.values())
    grid_height = 72  # 3 rows: 32px + 24px + 16px

    # Create a blank image for the grid
    preview_image = Image.new("RGBA", (grid_width, grid_height), (0, 0, 0, 0))

    # Paste clippings into the grid
    for y_offset, clippings in clippings_by_row.items():
        x_offset = 8 if y_offset in (32, 56) else 0 # Adds 8px left margin for rows 2 & 3
        for clipping in clippings:
            preview_image.paste(clipping, (x_offset, y_offset))
            x_offset += clipping.width + HORIZONTAL_SPACING[y_offset]  # Add spacing after each image

    # Save the preview
    output_file = output_dir / f"previews-{subfolder.name}.png"
    preview_image.save(output_file)
    print(f"Preview saved: {output_file}")

# Main function to process all subfolders
def main():
    # Define directories
    script_dir = Path(__file__).parent
    output_dir = script_dir  # Save previews in the same directory as the script

    # Iterate over all subfolders
    for subfolder in script_dir.iterdir():
        if subfolder.is_dir():
            print(f"Processing subfolder: {subfolder}")
            create_preview(subfolder, output_dir)

if __name__ == "__main__":
    main()
