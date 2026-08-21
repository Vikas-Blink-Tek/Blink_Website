import urllib.request
import json
import os

banks = {
    "HDFC Bank": "https://upload.wikimedia.org/wikipedia/commons/2/28/HDFC_Bank_Logo.svg",
    "ICICI Bank": "https://upload.wikimedia.org/wikipedia/commons/1/12/ICICI_Bank_Logo.svg",
    "SBI": "https://upload.wikimedia.org/wikipedia/commons/c/cc/SBI-logo.svg",
    "Axis Bank": "https://upload.wikimedia.org/wikipedia/commons/1/1a/Axis_Bank_logo.svg",
    "Kotak Mahindra": "https://upload.wikimedia.org/wikipedia/commons/c/c3/Kotak_Mahindra_Bank_logo.svg",
    "IDFC First": "https://upload.wikimedia.org/wikipedia/commons/2/22/IDFC_First_Bank_logo.svg",
    "Bank of Baroda": "https://upload.wikimedia.org/wikipedia/en/e/eb/Bank_of_Baroda_logo.svg",
    "Punjab National Bank": "https://upload.wikimedia.org/wikipedia/commons/1/1b/Punjab_National_Bank_logo.svg"
}

os.makedirs("public/banks", exist_ok=True)

for name, url in banks.items():
    safe_name = name.replace(" ", "_").lower()
    path = f"public/banks/{safe_name}.svg"
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response:
            with open(path, 'wb') as f:
                f.write(response.read())
        print(f"Downloaded {name} to {path}")
    except Exception as e:
        print(f"Failed to download {name} from {url}: {e}")

