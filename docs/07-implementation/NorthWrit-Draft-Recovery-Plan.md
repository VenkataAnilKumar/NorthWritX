# Private draft recovery increment

Prepared November 17, 2026 on `fd26fb9`.

Add automatic server-side checkpoints for unsaved matter-draft edits. Recovery copies belong to one authenticated user and matter, require current editor access, and expire after 24 hours. Keep draft text out of browser persistent storage. Existing explicit Save still creates an immutable revision; a recovery checkpoint has no approval/export status.

Each editor view uses a separate recovery identifier and increasing sequence. Older writes cannot replace newer checkpoints. Explicit discard creates a content-free tombstone so delayed requests cannot resurrect a discarded copy. Account expectations on writes prevent queued callbacks from checkpointing old text into a newly signed-in account. Expired copies are hidden immediately and removed by bounded worker maintenance; backups retain their separately governed retention.

Offer explicit Recover/Discard actions on return. Recovery retains the original saved revision as its compare-and-save base; a newer current revision causes a visible conflict instead of silent overwrite. Successful explicit Save or discard clears this view's recovery copy. Other users and other views' copies remain separate.

Checkpoint after a short idle delay and make a best-effort flush on navigation. Display saving/saved/unavailable status. Only acknowledged checkpoints are guaranteed recoverable: sudden closure, offline operation or a failed checkpoint may lose the latest uncheckpointed keystrokes. Existing unsaved-change warnings stay in place.

Implement additive schema/API contracts, a scoped web controller and recovery controls. Test two-user/matter isolation, expired/discarded/stale writes, recovered edit conflicts, reload/back recovery and cleanup. Run isolated fresh/upgrade integration and real-browser journeys without AI or deployment, then commit this increment separately.
