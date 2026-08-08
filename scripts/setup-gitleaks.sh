#!/usr/bin/env bash

set -euo pipefail

readonly GITLEAKS_VERSION="8.30.0"
readonly INSTALL_DIR="${GITLEAKS_INSTALL_DIR:-${HOME}/.local/bin}"

if [[ -x "${INSTALL_DIR}/gitleaks" ]] && \
  "${INSTALL_DIR}/gitleaks" version | grep -q "${GITLEAKS_VERSION}"; then
  exit 0
fi

case "$(uname -s)-$(uname -m)" in
  Darwin-arm64)
    readonly ARCHIVE="gitleaks_${GITLEAKS_VERSION}_darwin_arm64.tar.gz"
    readonly CHECKSUM="b251ab2bcd4cd8ba9e56ff37698c033ebf38582b477d21ebd86586d927cf87e7"
    ;;
  Linux-x86_64)
    readonly ARCHIVE="gitleaks_${GITLEAKS_VERSION}_linux_x64.tar.gz"
    readonly CHECKSUM="79a3ab579b53f71efd634f3aaf7e04a0fa0cf206b7ed434638d1547a2470a66e"
    ;;
  *)
    echo "Unsupported platform for Gitleaks: $(uname -s)-$(uname -m)" >&2
    exit 1
    ;;
esac

readonly TEMP_DIR="$(mktemp -d)"
trap 'rm -rf "${TEMP_DIR}"' EXIT

readonly DOWNLOAD_PATH="${TEMP_DIR}/${ARCHIVE}"
readonly DOWNLOAD_URL="https://github.com/gitleaks/gitleaks/releases/download/v${GITLEAKS_VERSION}/${ARCHIVE}"

curl --proto '=https' --tlsv1.2 -fsSL "${DOWNLOAD_URL}" -o "${DOWNLOAD_PATH}"

if [[ "$(uname -s)" == "Darwin" ]]; then
  printf '%s  %s\n' "${CHECKSUM}" "${DOWNLOAD_PATH}" | shasum -a 256 -c >/dev/null
elif command -v sha256sum >/dev/null 2>&1; then
  printf '%s  %s\n' "${CHECKSUM}" "${DOWNLOAD_PATH}" | sha256sum -c >/dev/null
else
  echo "No supported SHA-256 checker found." >&2
  exit 1
fi

tar -xzf "${DOWNLOAD_PATH}" -C "${TEMP_DIR}" gitleaks
mkdir -p "${INSTALL_DIR}"
install -m 0755 "${TEMP_DIR}/gitleaks" "${INSTALL_DIR}/gitleaks"

"${INSTALL_DIR}/gitleaks" version | grep -q "${GITLEAKS_VERSION}"
