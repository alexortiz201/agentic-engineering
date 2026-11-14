#!/bin/zsh

# ------------------------------------------------------------------------------
# Environment
# ------------------------------------------------------------------------------

# USER_NAME and optional AE_PROJECT_HOME are machine-local overrides.

# Editors
export EDITOR="code -w"
export VISUAL="$EDITOR"

# Startup does not probe the network. Navigation rechecks the actual mount each time.
export PROJECT_HOME="$HOME"
[[ -d "$HOME/Github" && ! -L "$HOME/Github" ]] && export PROJECT_HOME="$HOME/Github"
export GITHUB="$PROJECT_HOME" # transitional compatibility; refreshed by project_cd

project_root() {
  local fallback="$HOME"
  [[ -d "$HOME/Github" && ! -L "$HOME/Github" ]] && fallback="$HOME/Github"
  # No implicit network mounts or host identity embedded in portable defaults.
  [[ -n "${AE_PROJECT_HOME:-}" && -d "$AE_PROJECT_HOME" && ! -L "$AE_PROJECT_HOME" ]] && fallback="$AE_PROJECT_HOME"
  print -r -- "$fallback"
}

project_cd() {
  local root="$(project_root)" destination
  destination="$root${1:+/$1}"
  [[ -d "$destination" && ! -L "$destination" ]] || { print -u2 -- "project directory unavailable: $destination"; return 1; }
  cd -- "$destination" || return
  export PROJECT_HOME="$root" GITHUB="$root"
}

# Python virtualenvwrapper-style paths
export WORKON_HOME="$HOME/.virtualenvs"

# Backspace sanity for some terminal/SSH sessions
stty erase '^?' 2>/dev/null || true

# ------------------------------------------------------------------------------
# Bun
# ------------------------------------------------------------------------------

if [ -s "$HOME/.bun/_bun" ]; then
  source "$HOME/.bun/_bun"
fi

# ------------------------------------------------------------------------------
# Tool initialization
# ------------------------------------------------------------------------------

if command -v rbenv >/dev/null 2>&1; then
  eval "$(rbenv init -)"
fi

# ------------------------------------------------------------------------------
# Helper functions
# ------------------------------------------------------------------------------

f() {
  find . -iname "*$1*" "${@:2}"
}

r() {
  grep -R "$1" . "${@:2}"
}

mkcd() {
  mkdir -p "$1" && cd "$1"
}

_new_interview() {
  if [ -z "$1" ]; then
    echo "Usage: _new_interview <name>"
    return 1
  fi

  local name
  name="$(tr '[:lower:]' '[:upper:]' <<< "${1:0:1}")${1:1}"

  project_cd Interviews || return
  mkdir -p "$name"
  cd "$name" || return
}

# ------------------------------------------------------------------------------
# Terminal / app awareness
# ------------------------------------------------------------------------------

supports_ghostty_bg_tint() {
  [[ "$TERM_PROGRAM" == "ghostty" ]]
}

# ------------------------------------------------------------------------------
# Ghostty SSH background tinting
# ------------------------------------------------------------------------------

ghostty_bg() {
  supports_ghostty_bg_tint || return
  printf '\033]11;%s\033\\' "$1"
}

ghostty_bg_reset() {
  supports_ghostty_bg_tint || return
  printf '\033]111\033\\'
}

ssh() {
  ghostty_bg "#241d14"

  command ssh "$@"

  local exit_code=$?

  ghostty_bg_reset

  return "$exit_code"
}

# ------------------------------------------------------------------------------
# Config aliases
# ------------------------------------------------------------------------------

alias zshconfig='code ~/.zshrc'
alias envconfig='code ~/.oh-my-zsh/custom/env.sh'
alias sshconfig='code ~/.ssh/config'
alias hostconfig='sudo code /etc/hosts'

alias ghosttyconfig='code "$HOME/.config/ghostty/config"'
alias ghosttytheme='code "$HOME/.config/ghostty/config/themes/purpledreams"'

# ------------------------------------------------------------------------------
# Git aliases
# ------------------------------------------------------------------------------

alias gdl='git branch -D'
alias gdr='git push origin --delete'
alias gbda='git branch --no-color --merged | command grep -vE "^(\*|\s*(master|dev|qa|next)\s*$)" | command xargs -n 1 git branch -d'
alias gsyncf='gf upstream && grb upstream/master && gp origin master --force'

# ------------------------------------------------------------------------------
# Project navigation
# ------------------------------------------------------------------------------

alias _github='project_cd'
alias _epic='project_cd EpicWebDev'
alias _rust='project_cd Rust'
alias _interviews='project_cd Interviews'

alias _dreams='project_cd Purpledreams.io'
alias _site='project_cd Purpledreams.io/remix.purpledreams.io'
alias _notes='project_cd Purpledreams.io/notes.purpledreams.io'
alias _lifeos='project_cd Purpledreams.io/lifeos.purpledreams.io'
alias _agentic='project_cd Agentic'
alias _tac='project_cd Agentic/TAC'

# ------------------------------------------------------------------------------
# Dev shortcuts
# ------------------------------------------------------------------------------

alias reload='source ~/.zshrc'
alias yolo='rm -rf node_modules package-lock.json bun.lock bun.lockb'
alias server='python3 -m http.server 8000'
alias bup='brew update && brew upgrade'
alias pn='pnpm'

# ------------------------------------------------------------------------------
# Global aliases
# ------------------------------------------------------------------------------

alias -g L='| less'
alias -g G='| grep'