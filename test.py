import socketio
import base64

# Connect to the NestJS WebSocket server
sio = socketio.Client()
sio.connect('http://localhost:4000')  # use your public IP or ngrok if remote

# Load image and convert to base64
with open('./image_362.jpg', 'rb') as f:
    image_data = f.read()
    base64_str = 'data:image/jpeg;base64,' + base64.b64encode(image_data).decode('utf-8')

# Emit to socket
sio.emit('image', {
    'filename': '1_1_1200.jpg',
    'buffer': base64_str
})

print("Image sent to server.")