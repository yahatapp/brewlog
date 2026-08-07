#!/usr/bin/env bash

set -euo pipefail

configure_github_push_auth() {
  local github_token="${CODEX_GITHUB_TOKEN:-${GH_TOKEN:-${GITHUB_TOKEN:-}}}"
  local remote_url
  local repository_path

  if [[ -z "${github_token}" ]]; then
    echo "GitHub push authentication was not configured." >&2
    echo "Add CODEX_GITHUB_TOKEN as a Codex environment variable to enable git push." >&2
    return
  fi

  remote_url="$(git remote get-url --push origin)"
  if [[ "${remote_url}" != https://github.com/* ]]; then
    echo "GitHub token authentication requires an HTTPS origin remote: ${remote_url}" >&2
    return 1
  fi

  repository_path="${remote_url#https://github.com/}"

  # Keep the token out of both the repository and Git's config. Codex environment
  # variables remain available during the agent phase, unlike Codex secrets.
  git config --local credential.helper ""
  git config --local --add credential.helper \
    '!f() { test "$1" = get || exit 0; token="${CODEX_GITHUB_TOKEN:-${GH_TOKEN:-${GITHUB_TOKEN:-}}}"; test -n "$token" || exit 0; printf "%s\n" "username=x-access-token" "password=$token"; }; f'
  git config --local credential.useHttpPath true

  echo "GitHub push authentication is configured for ${repository_path}."
}

configure_github_push_auth

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
