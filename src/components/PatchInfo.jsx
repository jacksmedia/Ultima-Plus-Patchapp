export default function PatchInfo(romData, ipsData) {

    async function applyIpsPatch(romData, ipsData) {
        const IPS_HEADER = "PATCH";
        const IPS_FOOTER = "EOF";
    
        let offset = 0;
    
        // Shows spinner at the start
        showSpinner();
    
        try {
            // Verifies header
            const header = new TextDecoder().decode(ipsData.slice(0, 5));
            if (header !== IPS_HEADER) throw new Error("Invalid IPS file: Incorrect header.");
            offset += 5;
    
            while (offset < ipsData.length) {
                // Checks for footer
                if (offset + 3 <= ipsData.length) {
                    const footer = new TextDecoder().decode(ipsData.slice(offset, offset + 3));
                    if (footer === IPS_FOOTER) {
                        // Valid footer, end of process
                        return romData;
                    }
                }
    
                // Reads patch address
                if (offset + 3 > ipsData.length) throw new Error("Invalid IPS file: Unexpected end of data while reading address.");
                const address = (ipsData[offset] << 16) | (ipsData[offset + 1] << 8) | ipsData[offset + 2];
                offset += 3;
    
                // Reads patch size
                if (offset + 2 > ipsData.length) throw new Error("Invalid IPS file: Unexpected end of data while reading size.");
                const size = (ipsData[offset] << 8) | ipsData[offset + 1];
                offset += 2;
    
                if (size === 0) {
                    // RLE (Run Length Encoding)
                    if (offset + 3 > ipsData.length) throw new Error("Invalid IPS file: Unexpected end of data in RLE encoding.");
                    const rleSize = (ipsData[offset] << 8) | ipsData[offset + 1];
                    const value = ipsData[offset + 2];
                    offset += 3;
    
                    // Checks and expands ROM size if necessary
                    const endAddress = address + rleSize;
                    if (endAddress > romData.length) {
                        console.warn(`Expanding ROM size to accommodate address: ${endAddress}`);
                        const expandedRom = new Uint8Array(endAddress);
                        expandedRom.set(romData);
                        romData = expandedRom;
                    }
    
                    // Applies RLE to ROM data
                    for (let i = 0; i < rleSize; i++) {
                        romData[address + i] = value;
                    }
                } else {
                    // Normal patch
                    if (offset + size > ipsData.length) throw new Error("Invalid IPS file: Unexpected end of data in normal patch.");
                    const patchData = ipsData.slice(offset, offset + size);
                    offset += size;
    
                    // Checks and expands ROM size if necessary
                    const endAddress = address + size;
                    if (endAddress > romData.length) {
                        console.warn(`Expanding ROM size to accommodate address: ${endAddress}`);
                        const expandedRom = new Uint8Array(endAddress);
                        expandedRom.set(romData);
                        romData = expandedRom;
                    }
    
                    // Apply patch to ROM data
                    for (let i = 0; i < size; i++) {
                        romData[address + i] = patchData[i];
                    }
                }
            }
    
            throw new Error("Invalid IPS file: Missing footer.");
        } finally {
            // Always hides spinner, whether successful or errored out
            hideSpinner();
        }
    }
    
    // Apply the Patch <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    async function applySelectedPatch() {
        if (!romData) {
            alert('Please upload a ROM file first!');
            return;
        }
    
        const patchDropdown = document.getElementById('patch-dropdown');
        const selectedPatch = patchDropdown.value;
        if (!selectedPatch) {
            alert('Please select a patch to apply!');
            return;
        }
    
        if (!zip) {
            alert('Patch archive not loaded yet!');
            return;
        }
    
        try {
            showSpinner();
    
            // Fetches the IPS file from ZIP
            const patchFile = zip.files[selectedPatch];
            if (!patchFile) {
                throw new Error('Patch file not found in ZIP!');
            }
    
            const patchData = await patchFile.async('uint8array');
    
            // Employs bytecode changing logic
            const patchedRom = await applyIpsPatch(romData, patchData);
            console.log('Patch applied successfully.');
    
            // Downloads patched ROM
            downloadPatchedRom(patchedRom, 'FF4 Ultima Plus.sfc');
        } catch (error) {
            console.error('Error applying patch:', error);
            alert(`Error applying patch: ${error.message}`);
        } finally {
            hideSpinner();
        }
    }
    // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    
    
// Download the patched ROM
function downloadPatchedRom(data, filename) {
    const blob = new Blob([data], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();

    URL.revokeObjectURL(url);
    console.log('Patched ROM downloaded as:', filename);
}

// Load IPS Patch ZIP File
async function loadLocalZip() {
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

// Populate the Dropdown with Patch Files
function populateDropdown(patchFiles) {
    const patchDropdown = document.getElementById('patch-dropdown');
    if (!patchDropdown) {
        console.error('Dropdown element not found');
        return;
    }

    patchDropdown.innerHTML = ''; // Clear previous entries

    patchFiles.forEach(relativePath => {
        const option = document.createElement("option");
        option.value = relativePath;
        option.textContent = relativePath.split('/').pop();
        patchDropdown.appendChild(option);
        console.log('Added to dropdown:', relativePath);
    });

    console.log('Dropdown options populated:', patchDropdown.options.length);
}   
}