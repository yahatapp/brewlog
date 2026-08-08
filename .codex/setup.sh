#!/usr/bin/env bash

set -euo pipefail

source ./scripts/setup-vp.sh

# Make the installed vp binary available in this setup shell and future agent
# shells. Codex runs setup and agent commands in separate Bash sessions.
export PATH="${VP_HOME}/bin:${PATH}"

touch "${HOME}/.bashrc"
grep -qxF "export VP_HOME=\"${VP_HOME}\"" "${HOME}/.bashrc" || \
  echo "export VP_HOME=\"${VP_HOME}\"" >> "${HOME}/.bashrc"
grep -qxF 'export PATH="${VP_HOME}/bin:${PATH}"' "${HOME}/.bashrc" || \
  echo 'export PATH="${VP_HOME}/bin:${PATH}"' >> "${HOME}/.bashrc"

pnpm install --frozen-lockfile
