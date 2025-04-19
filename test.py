import socketio
import base64

# Connect to the NestJS WebSocket server
sio = socketio.Client()
sio.connect('http://localhost:4000')  # use your public IP or ngrok if remote

# Load image and convert to base64
# with open('./image_362.jpg', 'rb') as f:
#     image_data_1 = f.read()
#     base64_str_1 = 'data:image/jpeg;base64,' + base64.b64encode(image_data_1).decode('utf-8')

with open('./image_308.jpg', 'rb') as f:
    image_data_2 = f.read()
    base64_str_2 = 'data:image/jpeg;base64,' + base64.b64encode(image_data_2).decode('utf-8')

# Emit to socket
# sio.emit('image', {
#     'filename': '1_1.jpg',
#     'buffer': base64_str_1
# })

sio.emit('image', {
    'filename': '1_2_.jpg',
    'buffer': base64_str_2
})

print("Image sent to server.")