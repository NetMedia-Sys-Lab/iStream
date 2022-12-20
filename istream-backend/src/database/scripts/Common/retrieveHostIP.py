import socket

socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
socket .connect(("8.8.8.8", 80))
serverMachineIp = socket.getsockname()[0]
socket.close()

print(serverMachineIp)
