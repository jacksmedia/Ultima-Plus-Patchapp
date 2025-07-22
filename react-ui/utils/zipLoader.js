export async function loadLocalZip() {
    const zipFilePath = 'FF4UP.zip';
    try {
        const response = await fetch(zipFilePath);
        if (!response.ok) {
            throw new Error(`Failed to fetch ZIP file: ${response.statusText}`);
        }

        const zipBlob = await response.blob();
        zip = await JSZip.loadAsync(zipBlob);

        console.log('ZIP file loaded successfully:', zip);

        // Extract `.ips` files from ZIP
        const patchFiles = Object.keys(zip.files).filter(relativePath =>
            relativePath.endsWith('.ips') && !zip.files[relativePath].dir
        );

        console.log('Filtered patch files:', patchFiles);
        populateDropdown(patchFiles);
    } catch (error) {
        console.error('Error loading ZIP file:', error);
    }
}