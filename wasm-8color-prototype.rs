use wasm_bindgen::prelude::*;
use image::{DynamicImage, RgbaImage};
use imagequant::{Remapper, ImageQuant};

#[wasm_bindgen]
pub fn requantize_png(input: &[u8]) -> Vec<u8> {
    let img = match image::load_from_memory(input) {
        Ok(DynamicImage::ImageRgba8(img)) => img,
        Ok(other) => other.to_rgba8(),
        Err(_) => return Vec::new(), // Return empty Vec on error
    };

    let (width, height) = img.dimensions();
    let pixels = img.clone().into_raw(); // Get pixel data in RGBA format

    // Use ImageQuant to reduce to exactly 8 colors
    let mut iq = ImageQuant::new();
    iq.set_quality(0, 100).unwrap();
    iq.set_max_colors(8).unwrap();
    let mut quantized = iq.quantize(&pixels, width as usize, height as usize, 4).unwrap();

    let remapper = Remapper::new(&quantized).unwrap();
    let indexed_pixels = remapper.remap(&pixels, 4).unwrap();

    // Extract the optimized palette, ensuring it has exactly 8 colors
    let palette = quantized.palette();
    let mut final_palette = Vec::with_capacity(8 * 4);
    
    for (i, color) in palette.iter().enumerate().take(8) {
        final_palette.extend_from_slice(&[color.r, color.g, color.b, color.a]);
    }

    // Ensure we always have exactly 8 colors in the palette (padding with transparent if needed)
    while final_palette.len() < 8 * 4 {
        final_palette.extend_from_slice(&[0, 0, 0, 0]); // Transparent RGBA
    }

    // Create new RGBA image using indexed pixels
    let mut output_img = RgbaImage::new(width, height);
    for (i, pixel) in indexed_pixels.iter().enumerate() {
        let rgba_offset = (*pixel as usize) * 4;
        let rgba = &final_palette[rgba_offset..rgba_offset + 4];

        let x = (i as u32) % width;
        let y = (i as u32) / width;
        output_img.put_pixel(x, y, image::Rgba([rgba[0], rgba[1], rgba[2], rgba[3]]));
    }

    // Encode the output image back into PNG format
    let mut output_buf = Vec::new();
    let _ = image::codecs::png::PngEncoder::new(&mut output_buf)
        .encode(&output_img, width, height, image::ColorType::Rgba8);

    output_buf
}
