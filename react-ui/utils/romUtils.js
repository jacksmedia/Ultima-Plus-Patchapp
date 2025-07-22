export async function applyIpsPatch(romData, ipsData, showSpinner, hideSpinner) {
  const IPS_HEADER = "PATCH";
  const IPS_FOOTER = "EOF";

  let offset = 0;
  showSpinner?.();

  try {
    const header = new TextDecoder().decode(ipsData.slice(0, 5));
    if (header !== IPS_HEADER) throw new Error("Invalid IPS file: Incorrect header.");
    offset += 5;

    while (offset < ipsData.length) {
      const footer = new TextDecoder().decode(ipsData.slice(offset, offset + 3));
      if (footer === IPS_FOOTER) return romData;

      const address = (ipsData[offset] << 16) | (ipsData[offset + 1] << 8) | ipsData[offset + 2];
      offset += 3;
      const size = (ipsData[offset] << 8) | ipsData[offset + 1];
      offset += 2;

      if (size === 0) {
        const rleSize = (ipsData[offset] << 8) | ipsData[offset + 1];
        const value = ipsData[offset + 2];
        offset += 3;

        const end = address + rleSize;
        if (end > romData.length) {
          const expanded = new Uint8Array(end);
          expanded.set(romData);
          romData = expanded;
        }

        romData.fill(value, address, address + rleSize);
      } else {
        const patch = ipsData.slice(offset, offset + size);
        offset += size;

        const end = address + size;
        if (end > romData.length) {
          const expanded = new Uint8Array(end);
          expanded.set(romData);
          romData = expanded;
        }

        romData.set(patch, address);
      }
    }

    throw new Error("Invalid IPS file: Missing EOF footer.");
  } finally {
    hideSpinner?.();
  }
}

export function downloadPatchedRom(data, filename = "patched.sfc") {
  const blob = new Blob([data], { type: 'application/octet-stream' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();

  URL.revokeObjectURL(url);
}
