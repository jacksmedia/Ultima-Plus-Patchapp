import os
import json

# navigates thru all subfolders and generates manifest.json files for each
# that list all the .ips files' names
#
# this is for use w the new /custom app;
# per-character subfolders for map, battle, portrait must be created
# from the patch archive prior to using this...

def generate_manifests(base_dir="."):
    for folder_name in os.listdir(base_dir):
        folder_path = os.path.join(base_dir, folder_name)

        if os.path.isdir(folder_path):
            ips_files = [
                f for f in os.listdir(folder_path)
                if f.lower().endswith(".ips") and os.path.isfile(os.path.join(folder_path, f))
            ]

            if ips_files:
                manifest_path = os.path.join(folder_path, "manifest.json")
                with open(manifest_path, "w", encoding="utf-8") as f:
                    json.dump(ips_files, f, indent=2)
                print(f"✓ Wrote manifest for '{folder_name}' with {len(ips_files)} patch(es).")

if __name__ == "__main__":
    generate_manifests()
