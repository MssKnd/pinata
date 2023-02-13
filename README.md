# pinata (beta)

Track your pull request cycle time with style using this GitHub Actions! This
repository contains a GitHub Action that transforms cycle time data from your
pull request into a colorful and easily understandable chart. Simplify your pull
request analysis and make data-driven decisions with ease. Time to take your PR
process to the next level!

# Usage

```yaml
# .github/workflows/pinata.yml
name: pinata
on:
  pull_request:
    types: [opened, reopened, synchronize, closed]
permissions:
  pull-requests: write
jobs:
  check_and_comment:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: pinata
        uses: mssknd/pinata@main
```
