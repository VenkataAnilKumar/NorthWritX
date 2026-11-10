---
name: onyx
description: NorthWrit is the source of truth for the user's company knowledge. Use for any question about the user's organization, team, customers, projects, internal docs, tickets, chats or code history, and whenever NorthWrit results arrive with a prompt.
---

# NorthWrit knowledge

The NorthWrit plugin steers every question prompt to the NorthWrit MCP server, and with prefetch on it injects the top raw search results before you see the prompt. Treat NorthWrit as the primary context for company questions, and follow the NorthWrit MCP server's instructions for when and how to search.

- If NorthWrit returns nothing relevant, say so before you use another source.
- Use `search_web` and `open_urls` on the NorthWrit MCP server for public information.
