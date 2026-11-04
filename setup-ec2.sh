#!/usr/bin/env bash
# BitHub Jaipur backend: provision / update an Ubuntu EC2 host.
# Caddy (HTTPS via <ip>.nip.io) -> Express on :3001, code cloned from this repo's main.
# usage: sudo bash setup-ec2.sh <public-ip>   (expects backend.env, i.e. Backend/.env, next to this script)
# Re-run to deploy the latest main.
set -euo pipefail
IP=$1; HOST="$IP.nip.io"; APP=/srv/bithub/app; SRC=$(dirname "$(readlink -f "$0")")

if ! swapon --show | grep -q /swapfile; then
  fallocate -l 1G /swapfile && chmod 600 /swapfile && mkswap -q /swapfile && swapon /swapfile
  echo '/swapfile none swap sw 0 0' >> /etc/fstab
fi
timedatectl set-timezone Asia/Kolkata

apt-get update -qq
DEBIAN_FRONTEND=noninteractive apt-get install -y -qq nodejs npm caddy git >/dev/null

id bithub >/dev/null 2>&1 || useradd --system --home /srv/bithub --shell /usr/sbin/nologin bithub
install -d -o bithub -g bithub /srv/bithub
if [ -d $APP/.git ]; then
  sudo -u bithub git -C $APP fetch -q --depth 1 origin main
  sudo -u bithub git -C $APP reset -q --hard origin/main
else
  sudo -u bithub git clone -q --depth 1 https://github.com/ananttheacharya/BitHub-Jaipur.git $APP
fi
install -o bithub -g bithub -m 600 "$SRC/backend.env" $APP/Backend/.env
(cd $APP/Backend && sudo -u bithub HOME=/srv/bithub npm ci --omit=dev --no-audit --no-fund --loglevel=error)

cat > /etc/systemd/system/bithub-backend.service <<UNIT
[Unit]
Description=BitHub Jaipur backend (Express)
After=network-online.target
Wants=network-online.target

[Service]
User=bithub
WorkingDirectory=$APP/Backend
ExecStart=/usr/bin/node index.js
Environment=NODE_ENV=production
Restart=always
RestartSec=3
NoNewPrivileges=true
ProtectSystem=full
ProtectHome=true
PrivateTmp=true

[Install]
WantedBy=multi-user.target
UNIT

cat > /etc/caddy/Caddyfile <<CADDY
$HOST {
	encode zstd gzip
	route {
		# local-dev / admin endpoints: never public (dev-root would expose Backend/.env)
		@private path /dev-root /dev-root/* /api/admin /api/admin/*
		respond @private 404

		handle_path /study-material/* {
			root * "$APP/Study Material"
			header Access-Control-Allow-Origin *
			header Cache-Control "public, max-age=86400"
			file_server
		}

		reverse_proxy 127.0.0.1:3001
	}
}
CADDY
# caddy (not root) must be able to read the study material
chmod o+rx /srv/bithub $APP

systemctl daemon-reload
systemctl enable -q bithub-backend caddy
systemctl restart bithub-backend caddy
echo "deployed: https://$HOST"
