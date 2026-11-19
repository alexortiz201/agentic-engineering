# ------------------------------------------------------------------------------
# ZSH / Oh My Zsh
# ------------------------------------------------------------------------------

export ZSH="$HOME/.oh-my-zsh"
ZSH_THEME="purpledreams"

# Automated Herdr panes must reach readiness without an update question.
if [[ "${HERDR_ENV:-}" == 1 ]]; then
  zstyle ':omz:update' mode disabled
fi

# ------------------------------------------------------------------------------
# Environment
# ------------------------------------------------------------------------------

# Set USER_EMAIL privately in ~/.config/ae/shell.local.zsh when needed.
export SSH_KEY_PATH="$HOME/.ssh/id_ed25519"

# Package manager homes
# pnpm global packages
export PNPM_HOME="$HOME/Library/pnpm"
export BUN_INSTALL_GLOBAL_DIR="$HOME/.bun/install/global"

# ------------------------------------------------------------------------------
# PATH
# ------------------------------------------------------------------------------

typeset -U path PATH

path=(
  # Prefer managed Pi and other user-local launchers over legacy npm/pnpm bins.
  "$HOME/.local/bin"
  "$HOME/.bun/bin"
  "$HOME/.n/bin"
  "$PNPM_HOME/bin"
  /opt/homebrew/bin
  /opt/homebrew/sbin
  /usr/local/bin
  /usr/local/sbin
  /usr/local/share/python
  /usr/bin
  /bin
  /usr/sbin
  /sbin
  /Library/Frameworks/Mono.framework/Versions/Current/bin
  "$HOME/.cargo/bin"
  "$HOME/.node/bin"
  "$path[@]"
)

export PATH

# ------------------------------------------------------------------------------
# Node / N
# ------------------------------------------------------------------------------

export PREFIX="$HOME/.n"
export N_CACHE_PREFIX="$PREFIX"
export N_PREFIX="$PREFIX"

# ------------------------------------------------------------------------------
# YVM
# ------------------------------------------------------------------------------

export YVM_DIR="/opt/homebrew/opt/yvm"

if [ -r "$YVM_DIR/yvm.sh" ]; then
  source "$YVM_DIR/yvm.sh"
fi

# ------------------------------------------------------------------------------
# Terminal sanity
# ------------------------------------------------------------------------------

[[ -t 0 ]] && stty erase '^?' 2>/dev/null

# ------------------------------------------------------------------------------
# Plugins
# ------------------------------------------------------------------------------

plugins=(
  git
  gh
  docker
  vscode
  ssh-agent
  colored-man-pages
)

# ------------------------------------------------------------------------------
# Oh My Zsh
# ------------------------------------------------------------------------------

if [ -f "$ZSH/oh-my-zsh.sh" ]; then
  source "$ZSH/oh-my-zsh.sh"
fi

# ------------------------------------------------------------------------------
# Homebrew zsh plugins
# ------------------------------------------------------------------------------

ZSH_AUTOSUGGEST_HIGHLIGHT_STYLE='fg=#8b93b5'
ZSH_AUTOSUGGEST_USE_ASYNC=true

ZSH_AUTOSUGGEST_CLEAR_WIDGETS+=(
  expand-or-complete
  complete-word
  menu-complete
  reverse-menu-complete
)

# Resolve the prefix once, and remain usable when Homebrew isn't installed.
if (( $+commands[brew] )); then
  typeset _zsh_brew_prefix="${HOMEBREW_PREFIX:-$(brew --prefix)}"
  if [[ -f "$_zsh_brew_prefix/share/zsh-autosuggestions/zsh-autosuggestions.zsh" ]]; then
    source "$_zsh_brew_prefix/share/zsh-autosuggestions/zsh-autosuggestions.zsh"
  fi
  if [[ -f "$_zsh_brew_prefix/share/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh" ]]; then
    source "$_zsh_brew_prefix/share/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh"
  fi
  unset _zsh_brew_prefix
fi

export PROMPT_EOL_MARK=""

# ------------------------------------------------------------------------------
# Custom Environment
# ------------------------------------------------------------------------------

if [ -f "$ZSH/custom/env.sh" ]; then
  source "$ZSH/custom/env.sh"
fi

# ------------------------------------------------------------------------------
# LifeOS Devcontainer
# ------------------------------------------------------------------------------

lifeos() {
  local repo="$GITHUB/PurpleDreams/purpledreams.io/lifeos.purpledreams.io"
  local container="life-os-dev"

  cd "$repo" || return 1

  if docker ps --format '{{.Names}}' | grep -q "^${container}$"; then
    docker exec -it "$container" zsh -lc "cd /workspace/life-os && exec zsh"
  else
    echo "Starting devcontainer..."

    devcontainer up --workspace-folder . >/dev/null

    docker exec -it "$container" zsh -lc "cd /workspace/life-os && exec zsh"
  fi

  code "$repo"

  echo "In VSCode -> Cmd + Shift + P -> 'Dev Containers: Attach to Running Container'"
}

# ------------------------------------------------------------------------------
# LastPass API Key Loader
# ------------------------------------------------------------------------------

load_lpass_api_keys() {
  local mapping env_var lp_entry secret
  local failed=0

  local mappings=(
    "OPENAI_API_KEY=OpenAI: Pi"
    # "ANTHROPIC_API_KEY=Anthropic: Pi"
  )

  if ! command -v lpass >/dev/null 2>&1; then
    echo "lpass is not installed or not in PATH."
    return 1
  fi

  if ! lpass status >/dev/null 2>&1; then
    printf "LastPass not logged in. Login? [y/N]: "

    read -r reply

    case "$reply" in
      [yY]|[yY][eE][sS])
        lpass login "$USER_EMAIL" || return 1
        ;;
      *)
        echo "Skipping LastPass login."
        return 0
        ;;
    esac
  fi

  for mapping in "${mappings[@]}"; do
    env_var="${mapping%%=*}"
    lp_entry="${mapping#*=}"

    if [[ -n "${(P)env_var}" ]]; then
      continue
    fi

    if ! secret="$(lpass show "$lp_entry" --password)"; then
      echo "Could not retrieve $env_var from LastPass entry '$lp_entry'."
      failed=1
      continue
    fi

    if [[ -z "$secret" ]]; then
      echo "LastPass entry '$lp_entry' returned an empty value for $env_var."
      failed=1
      continue
    fi

    export "$env_var=$secret"
    unset secret

    echo "$env_var loaded."
  done

  return "$failed"
}

lpass_login_and_load_keys() {
  if ! command -v lpass >/dev/null 2>&1; then
    echo "lpass is not installed or not in PATH."
    return 1
  fi

  lpass login "$USER_EMAIL" || return 1

  load_lpass_api_keys
}

# Optional machine-local overrides, never supplied by setup.
[[ -f "$HOME/.config/ae/shell.local.zsh" ]] && source "$HOME/.config/ae/shell.local.zsh"

# Don't need the api keys for now, auth'ing via /login and using subs.
# if [[ -o interactive ]]; then
#   load_lpass_api_keys
# fi

# ------------------------------------------------------------------------------
# LastPass aliases
# ------------------------------------------------------------------------------

alias lpkeys='load_lpass_api_keys'
alias lplogin='lpass_login_and_load_keys'
alias lplogout='lpass logout --keep-session'
