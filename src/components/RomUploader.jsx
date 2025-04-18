import PatchDropdown from PatchDropdown.jsx
export default function RomUploader(props) {
    
// Handles ROM Upload & CRC Calculation
document.getElementById('romUpload').addEventListener('change', async (event) => {
    let file = event.target.files[0];
    if (!file) return;

    let reader = new FileReader();
    reader.onload = function (e) {
        romData = new Uint8Array(e.target.result); // Use global `romData`
        let crc = computeCRC32(romData);
        let crcHex = crc.toString(16).toUpperCase();
        console.log("Computed CRC32:", crcHex);
        crcHighlighter(crcHex); // updates webapp

        // Auto-select matching patch
        if (romPatchMap[crcHex]) {
            const patchDropdown = document.getElementById('patch-dropdown');
            for (let option of patchDropdown.options) {
                if (option.value === romPatchMap[crcHex]) {
                    option.selected = true;
                    console.log(`Auto-selected patch: ${option.value}`);
                    break;
                }
            }
        }
    };
    reader.readAsArrayBuffer(file);
});

return(
        <div class="col-12 col-sm-6">

            <div class="col g-col-6">
                <p>Upload a FFII or FF4J rom and this patcher will change it to FF4 Ultima Plus. If you have any trouble, reach out in the FF4 Ultima Discord!</p>
                {/* <!-- ROM Upload --> */}
            </div>
            <div class="file-upload col g-col-6">
                <label for="rom">ROM File (.sfc or .smc):</label>
                <input type="file" id="romUpload" accept=".sfc,.smc" />
            </div>

            <div>Valid CRC32 values:
                <span class="possible-match">65D0A825</span>,
                <span class="possible-match">23084FCD</span>,
                <span class="possible-match">6CDA700C</span>,
                <span class="possible-match">CAA15E97</span>,
                <span class="possible-match">E73564DB</span>,
                <span class="possible-match">A1ED8333</span>,
                <span class="possible-match">EE3FBCF2</span>,
                <span class="possible-match">48449269</span>
            </div>
            <div id="crc-display" style="color:gold;">Your rom's CRC: (waiting for upload...)</div>
            <PatchDropdown/>

        </div>
);}
  