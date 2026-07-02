import paramiko
from dotenv import load_dotenv
import os

load_dotenv("../.env")
SSH_HOST = os.getenv("DB_SSH_HOST")
SSH_USER = os.getenv("DB_SSH_USER")
SSH_PASS = os.getenv("DB_SSH_PASS")
DB_NAME = os.getenv("DB_NAME", "questions")
SQL_FILE = "CS24102_ingest.sql"
REMOTE_PATH = "/tmp/cs_ingest.sql"

print(f"Connecting to {SSH_HOST}...")
ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(SSH_HOST, username=SSH_USER, password=SSH_PASS)

print("Uploading SQL file...")
sftp = ssh.open_sftp()
sftp.put(SQL_FILE, REMOTE_PATH)
sftp.close()

print("Executing SQL via shell...")
shell = ssh.invoke_shell()
import time

def shell_send(cmd: str, wait: float = 1.5):
    shell.send(cmd + "\n")
    time.sleep(wait)
    out = ""
    while shell.recv_ready():
        out += shell.recv(65536).decode("utf-8", errors="replace")
    return out

out1 = shell_send(f"sudo mysql {DB_NAME}", wait=2)
if "password" in out1.lower():
    out1 += shell_send(SSH_PASS, wait=2)

out2 = shell_send(f"source {REMOTE_PATH};", wait=10)
print(out2)
shell_send("exit;", wait=1)
ssh.close()
