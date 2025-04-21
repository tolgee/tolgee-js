#!/usr/bin/env bash
set -euo pipefail

project="$1"
app_dir="testapps/$project"

header="<p align=\"center\"><strong>🚨🚨🚨 This repo is just a dummy 🚨🚨🚨</strong><br>Submit issues in the <a href=\"https://github.com/tolgee/tolgee-js\" target=\"_blank\"><strong>monorepo</strong></a> or <a href=\"https://github.com/tolgee/tolgee-js/tree/main/testapps/$project\" target=\"_blank\"><strong>check the source code here</strong></a>.</p>"

tmp=$(mktemp)
echo "$header" | cat - "$app_dir/README.md" > "$tmp"
mv "$tmp" "$app_dir/README.md"