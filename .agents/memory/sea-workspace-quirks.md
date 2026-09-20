---
name: SEA workspace quirks
description: Non-obvious setup constraints encountered while building the SEA marketplace.
---

The generated browser client uses `Headers.entries()`, so its TypeScript library configuration must include `dom.iterable` alongside `dom`.

**Why:** Orval generation succeeds, but the shared declaration build fails without the iterable DOM definitions.

**How to apply:** If generated client typechecking reports missing `Headers.entries`, inspect the client package `tsconfig.json` before changing generated output.