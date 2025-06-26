import socketio
import base64
import os
import time
from datetime import datetime

# --- CONFIGURATION ---
BASE_DIR = './'  # or specify full path
TL_FOLDERS = ['tl-1', 'tl-2', 'tl-3', 'tl-4']
SOCKET_URL = 'http://localhost:4001'
SOCKET_EVENT = 'image-sending'
CAMERA_ID = 'cr-1'
SLEEP_SECONDS = 3

# --- CONNECT TO SOCKET.IO SERVER ---
sio = socketio.Client()
sio.connect(SOCKET_URL)

# --- FUNCTION TO LOAD IMAGES FROM A FOLDER ---
def load_images_from_folder(folder_path):
    images = []
    for filename in sorted(os.listdir(folder_path)):  # sort for consistency
        if filename.lower().endswith(('.jpg', '.jpeg', '.png')):
            full_path = os.path.join(folder_path, filename)
            images.append(full_path)
    return images

# --- LOAD IMAGES FROM EACH FOLDER INTO DICT ---
image_paths = {tl: load_images_from_folder(os.path.join(BASE_DIR, tl)) for tl in TL_FOLDERS}
min_length = min(len(paths) for paths in image_paths.values())

# --- MAIN LOOP: SEND BATCHES OF 4 IMAGES ---
for i in range(min_length):
    for tl_id in TL_FOLDERS:
        img_path = image_paths[tl_id][i]
        with open(img_path, 'rb') as f:
            encoded = base64.b64encode(f.read()).decode('utf-8')
            timestamp = datetime.now().isoformat()
            filename = f"{CAMERA_ID}_{tl_id}_{timestamp}.jpg"
            sio.emit(SOCKET_EVENT, {
                'filename': filename,
                'buffer': f'data:image/jpeg;base64,{encoded}'
            })
            print(f"Sent: {filename}")
    print(f"Batch {i+1} sent. Waiting {SLEEP_SECONDS} seconds...\n")
    time.sleep(SLEEP_SECONDS)

print("All image batches sent.")