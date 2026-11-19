<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

- AI calls go through server routes in src/routes/api/ backed by src/lib/ai/*.server.ts (Lovable AI Gateway, Responses API, streamed); keeps the key and prompts server-side.
- Export the bundled exact logo through the shared site module as a portability exception so every consumer works without Lovable asset serving or hydration-time error recovery.
- Consultation intake writes through the validated server-only AI handler; anonymous clients have no direct database access, and team reads use authenticated server functions plus role-scoped RLS.
- Team membership lives in protected user_roles and is assigned only from an approved email list after confirmation; editable profiles never confer privileges.
- The dashboard uses a client-only authenticated layout and Query-backed loaders; one root session subscriber updates navigation and clears protected caches on sign-out.
