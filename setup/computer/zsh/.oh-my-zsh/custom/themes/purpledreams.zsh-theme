#!/bin/zsh

setopt PROMPT_SUBST

# EPOCHSECONDS is provided by this module, not by zsh itself.
zmodload zsh/datetime

# ------------------------------------------------------------------------------
# Colors
# Purple Dreams palette
# ------------------------------------------------------------------------------

RESET="%f"

# Brand base colors
PD_GRAY="%F{#d4d4d4}"
PD_RED="%F{#ee5f5b}"
PD_BLUE="%F{#19b5fe}"
PD_YELLOW="%F{#f89406}"
PD_AQUA="%F{#7fdbff}"
PD_PURPLE="%F{#3b1f5c}"
PD_TURQUOIS="%F{#33ccba}"
PD_GREEN="%F{#bada55}"
PD_ORANGE="%F{#dfb626}"
PD_PINK="%F{#fe57a1}"

# Prompt role colors
PURPLE="%F{#9b72cf}"
DEEP_PURPLE="%F{#6f3fb2}"
DREAM_ORANGE="%F{#dfb626}"
TEAL="%F{#33ccba}"
FADE="%F{#6f7899}"

# Colombia chevrons
COLOMBIA_YELLOW="%F{#f89406}"
COLOMBIA_BLUE="%F{#19b5fe}"
COLOMBIA_RED="%F{#ee5f5b}"

# Context colors
MINI="%F{#9b72cf}"
AIR="%F{#7fdbff}"
STORAGE="%F{#33ccba}"
LOCK="%F{#dfb626}"
DOCKER="%F{#33ccba}"
SUCCESS="%F{#bada55}"
ERROR="%F{#ee5f5b}"
WARNING="%F{#f89406}"
TIME="%F{#dfb626}"

# Semantic prompt colors
REPO_COLOR="$PURPLE"
BRANCH_COLOR="$TEAL"
SEPARATOR_COLOR="$FADE"
CLEAN_COLOR="$SUCCESS"
DIRTY_COLOR="$ERROR"
STAGED_COLOR="$PD_YELLOW"
UNTRACKED_COLOR="$WARNING"
FAILED_COLOR="$ERROR"
DURATION_COLOR="$TIME"

# Terminal background colors
LOCAL_BG="#1b1224"
SSH_BG="#241d14"

# Autosuggestions
ZSH_AUTOSUGGEST_HIGHLIGHT_STYLE='fg=#8b93b5'

# ------------------------------------------------------------------------------
# Terminal background
# ------------------------------------------------------------------------------

theme_set_terminal_bg() {
  # Background tinting is a Ghostty customization, not a portable prompt hook.
  [[ "$TERM_PROGRAM" == ghostty ]] || return 0
  if [[ -n "$SSH_CONNECTION" ]]; then
    printf '\033]11;%s\033\\' "$SSH_BG"
  else
    printf '\033]111\033\\'
  fi
}

# ------------------------------------------------------------------------------
# Prompt pieces
# ------------------------------------------------------------------------------

theme_delimiter() {
  echo "${COLOMBIA_YELLOW}›${RESET}${COLOMBIA_BLUE}›${RESET}${COLOMBIA_RED}›${RESET}"
}

theme_machine_label() {
  local host
  host="$(scutil --get ComputerName 2>/dev/null || hostname)"

  case "$host" in
    *mini*|*Mini*)
      echo "${MINI}mini${RESET}"
      ;;
    *)
      echo "${AIR}air${RESET}"
      ;;
  esac
}

theme_storage_segment() {
  case "$PWD" in
    /Volumes/DevDrive|/Volumes/DevDrive/*)
      echo "${STORAGE}Dev${RESET}"
      ;;
    /Volumes/PortableDrive|/Volumes/PortableDrive/*)
      echo "${STORAGE}Portable${RESET}"
      ;;
  esac
}

theme_ssh_segment() {
  [[ -n "$SSH_CONNECTION" ]] || return
  echo "${LOCK}🔒${RESET}"
}

theme_docker_segment() {
  [[ -f "/.dockerenv" ]] || return
  echo "${DOCKER}🐳${RESET}"
}

theme_command_status() {
  local exit_code=$1
  [[ $exit_code -eq 0 ]] && return
  echo "${FAILED_COLOR}✕${exit_code}${RESET}"
}

theme_command_duration() {
  [[ -n "${THEME_CMD_START:-}" ]] || return 0
  local duration=$(( EPOCHSECONDS - THEME_CMD_START ))
  [[ $duration -lt 2 ]] && return

  if [[ $duration -lt 60 ]]; then
    echo "${DURATION_COLOR}${duration}s${RESET}"
  else
    local mins=$(( duration / 60 ))
    local secs=$(( duration % 60 ))
    echo "${DURATION_COLOR}${mins}m${secs}s${RESET}"
  fi
}

# ------------------------------------------------------------------------------
# Git helpers
# ------------------------------------------------------------------------------

theme_git_repo_name() {
  command git rev-parse --show-toplevel >/dev/null 2>&1 || return
  basename "$(command git rev-parse --show-toplevel 2>/dev/null)"
}

theme_git_branch() {
  command git symbolic-ref --short HEAD 2>/dev/null \
    || command git rev-parse --short HEAD 2>/dev/null
}

theme_git_state() {
  command git rev-parse --is-inside-work-tree >/dev/null 2>&1 || return

  local dirty staged untracked

  if ! command git diff --quiet 2>/dev/null; then
    dirty="${DIRTY_COLOR}*${RESET}"
  fi

  if ! command git diff --cached --quiet 2>/dev/null; then
    staged="${STAGED_COLOR}+${RESET}"
  fi

  if [[ -n "$(command git ls-files --others --exclude-standard 2>/dev/null)" ]]; then
    untracked="${UNTRACKED_COLOR}?${RESET}"
  fi

  if [[ -z "$dirty$staged$untracked" ]]; then
    echo "${CLEAN_COLOR}✓${RESET}"
    return
  fi

  echo "${dirty}${staged}${untracked}"
}

theme_git_segment() {
  command git rev-parse --is-inside-work-tree >/dev/null 2>&1 || return

  local repo branch git_state

  repo="$(theme_git_repo_name)"
  branch="$(theme_git_branch)"
  git_state="$(theme_git_state)"

  echo "${REPO_COLOR}${repo}${RESET}${SEPARATOR_COLOR}·${RESET}${BRANCH_COLOR}${branch}${git_state}${RESET}"
}

# ------------------------------------------------------------------------------
# Hooks
# ------------------------------------------------------------------------------

theme_preexec() {
  THEME_CMD_START=$EPOCHSECONDS
}

theme_set_prompt() {
  local last_exit=$?
  local delimiter machine storage_segment git_segment ssh_segment docker_segment timing_segment status_segment

  theme_set_terminal_bg

  delimiter="$(theme_delimiter)"
  machine="$(theme_machine_label)"
  storage_segment="$(theme_storage_segment)"
  git_segment="$(theme_git_segment)"
  ssh_segment="$(theme_ssh_segment)"
  docker_segment="$(theme_docker_segment)"
  timing_segment="$(theme_command_duration)"
  unset THEME_CMD_START
  status_segment="$(theme_command_status "$last_exit")"

  PROMPT="${delimiter} "

  RPROMPT="${machine}"
  [[ -n "$storage_segment" ]] && RPROMPT="${RPROMPT}${SEPARATOR_COLOR}·${RESET}${storage_segment}"
  [[ -n "$ssh_segment" ]] && RPROMPT="${RPROMPT}${SEPARATOR_COLOR}·${RESET}${ssh_segment}"
  [[ -n "$docker_segment" ]] && RPROMPT="${RPROMPT}${SEPARATOR_COLOR}·${RESET}${docker_segment}"
  [[ -n "$git_segment" ]] && RPROMPT="${RPROMPT}${SEPARATOR_COLOR}·${RESET}${git_segment}"
  [[ -n "$timing_segment" ]] && RPROMPT="${RPROMPT}${SEPARATOR_COLOR}·${RESET}${timing_segment}"
  [[ -n "$status_segment" ]] && RPROMPT="${RPROMPT}${SEPARATOR_COLOR}·${RESET}${status_segment}"
  return 0
}

autoload -Uz add-zsh-hook

add-zsh-hook preexec theme_preexec
add-zsh-hook -d precmd theme_set_prompt 2>/dev/null
add-zsh-hook precmd theme_set_prompt

theme_set_prompt