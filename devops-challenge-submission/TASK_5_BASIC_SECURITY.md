# Task 5: Basic Security

## Two Foundational Practices

1. Access hardening (SSH):
   - Use SSH keys; disable password auth (`PasswordAuthentication no`).
   - Non-root sudo user; optionally restrict with `AllowUsers`.
   - Restrict SSH via UFW and/or DigitalOcean firewall.
   - Enforce MFA on provider accounts; consider hardware keys for admins.

2. Firewall and exposure:
   - UFW deny-by-default; allow only 22, 80, 443 (and needed ports). Apply DO firewall as defense-in-depth.

## Additional Hardening

- Timely security updates; consider unattended upgrades.
- Fail2ban to mitigate brute-force.
- Secrets via vault/provider store; never in VCS.
- Backups encrypted and tested; least-privilege DB users.
- Central logging and alerting for anomalies.

UFW example:

```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
sudo ufw status verbose
```

SSH hardening (`/etc/ssh/sshd_config`):

```conf
PasswordAuthentication no
PermitRootLogin prohibit-password
PubkeyAuthentication yes
# AllowUsers adminuser
```

```bash
sudo systemctl reload sshd
```
