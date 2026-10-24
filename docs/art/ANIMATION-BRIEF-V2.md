# Animation brief v2 (roster at concept-sheet fidelity)

Maher picked all seven new concepts plus reworks of the current five, at the fidelity of the concept sheets in `docs/characters/concepts/`, and closer to the reference in feel. Each art agent owns two fighters. Read `docs/characters/ROSTER-V2.md` first. CANON section 2 (guardrails) still binds: no blood, modest costumes, no religious symbols, no text on clothing or props, and never name another game in a prompt or a document.

## Style target

Match the concept sheets: bold dark outlines, flat cel shading with one shadow tone, saturated colors, white highlights, chunky cartoon proportions, and one signature shape per fighter that reads as a solid black silhouette. The fighter must look exactly like its concept sheet in every frame.

## Your fighters

| id | Name | Concept (Higgsfield job, also the reference image) | Screen | Notes |
|---|---|---|---|---|
| `vampire-countess` | Vespera | `fac85560-b04b-465a-b95e-fc7cde8b2a42` | green | Fixes required: a whole pomegranate instead of the goblet (no wine glass anywhere), neckline closed up to the collar, one parasol whose tip is the rapier blade. |
| `gorilla-lumberjack` | Timber | `7b681a37-7795-43f9-9f43-71724d57c123` | green | Red plaid. |
| `fennec-host` | Finjan | `e5e6cb28-233a-4dcb-b6ff-a3508de9ee90` | magenta (green scarf) | |
| `clockwork-elephant` | Tiktak | `9fc3c11d-278a-420b-bacd-504ca4ef10ba` | magenta (teal patina) | Upright on two legs like the concept's side view; no numerals on the chest clock. |
| `melting-yeti` | Brrr | `8e43e027-735b-4a8f-8660-047aa697a24a` | green | |
| `baby-roc` | Rukhayy | `fbfb43e2-9a75-4dd1-9091-78059a8aa376` | green | Wings folded in the ready pose so the clip has room. |
| `chameleon-slinger` | Hirba | `d78dca77-40e6-491b-a9fb-2b755ac552c8` | magenta (lime skin) | |
| `djinn-warrior` | Saif (rework) | make a new concept first | green | Keep the indigo swordsman and scimitar, but make the sash djinn Wahaj visible: a living blue-flame face and two small flame arms rising out of his sash, sarcastic and expressive. Saif gets a broader heroic build, a long trailing scarf, and a confident grin. |
| `dune-ghoul` | Abu Sarab (rework) | make a new concept first, using the old sheet `29226d73-3a15-4c28-98b2-849b4c709142` as reference | magenta | Same design, pushed to the new fidelity: bigger lantern glow, more expressive grin, the hunched boulder back even wider. |
| `falcon-rider` | Nawaf (rework) | make a new concept first | green | Lanky teen falconer in an oversized leather falconry gauntlet, with Muzna, a big saker falcon with attitude, perched on his head or shoulder. Muzna steals the scene. Leaf-blade spear. Ivory and gold. |
| `sea-siren` | Dana (rework) | make a new concept first | magenta | Pearl diver: wooden diver's nose clip, a great pearl oyster shell slung on her back like a shield (it is also her thrown weapon), a rope coil, a diving stone on the belt, modest long-sleeved diving clothes and a headscarf. Sea teal. |
| `dagger-dancer` | Marjana (rework) | make a new concept first | green | The clever heroine of the forty thieves tale: twin curved daggers, a big clay oil jar she carries on her back and pops out of, sly fox smile, modest flowing dancer outfit, rose magenta. |

Concept prompt for reworks (Nano Banana Pro, 16:9, 2k): reuse the shape of the existing concept prompts. "Character concept sheet for an original 2D platform fighting game: [design]. Chunky cartoon proportions with a big readable silhouette. Views: a large three-quarter hero pose, a full-body side view facing right in a fighting stance, plus a row of 4 expressions (idle, attack, hurt, victory). Bold dark outlines, flat cel shading with one shadow tone, saturated colors, white highlights. Plain light grey background, no text, no logos." Look at the result; one retake if it misses the brief.

## Pipeline per fighter

1. **Start pose** (Nano Banana Pro, 1:1, 2k, the concept job attached in `medias` as the reference image): "Same character as the reference, exactly the same design and colors. Full body, strict side view facing right, [ready stance], feet flat. The character is small in the frame: the whole body fills only the middle 55% of the image height, centered, with large empty margins on every side. Flat solid pure [green #00FF00 / magenta #FF00FF] background, no ground, no shadow, no text. Bold dark outlines, flat cel shading." Check it, and retake once if needed. This job is the start frame for every clip.
2. **Portrait**: crop the head and shoulders from the start pose locally (key the screen color to transparency with the same logic as `tools/video2sprite.py`), square, about 512 px, saved as `assets/fighters/<id>/source/portrait.png`. Also save the start pose as `source/base-pose.png` (keyed, trimmed) and the concept as `source/concept.jpg` (1600 px wide).
3. **Clips** (Kling 3.0, std, 3 s, 1:1, sound off), in this order, all from the start pose. Use the same job as `end_image` for everything except run.

| Sheet | Frames | Cell | Flags | Prompt core |
|---|---|---|---|---|
| idle | 24 | 256 | none | breathing ready stance with the character's gag (Vespera fans herself with the parasol, Brrr wipes sweat, Tiktak's gears tick, and so on), returns to the start pose |
| run | 16 | 256 | none (start image only) | runs in place like on a treadmill, body stays centered |
| jump | 16 | 384 | `--trim` | crouches, jumps straight up, tucks, falls back and lands in the ready stance, stays inside the frame |
| hurt | 16 | 256 | `--trim` | a big exaggerated cartoon flinch from a hit, no blood, back to ready |
| jab | 16 | 256 | `--trim --motion` | a quick light strike with the signature weapon |
| side_light | 24 | 384 | `--trim --motion` | a lunging forward strike with a step |
| side_heavy | 40 | 384 | `--trim --motion` | the big committed signature attack: a short wind-up, a huge strike at full extension with a smear, then back to ready |
| nair | 24 | 384 | `--trim --motion` | hops up, does a spinning or wide attack in mid-air, lands back in the ready stance, stays centered |

Prompt shape (from v1, it works): "2D cel-shaded fighting game sprite animation, [action: anticipation, the action, follow-through, then back to the exact starting ready stance]. [Weapon] stays in [hand] and is visible in every frame. Strict side view facing right the whole time; [he/she/it] never turns toward the camera. Locked-off static camera, no zoom, no pan, the camera does not follow [him/her/it]. [He/She/It] stays well inside the frame with empty margin on every side. Flat solid pure [green/magenta] background stays unchanged, no ground, no shadow. Bold dark outlines and flat cel shading, crisp clear poses with no motion blur, identical character design in every frame." Attacks must be big and committed, fighting-game style: a short anticipation, never a long hold, and a thin smear arc hugging the weapon.

4. **Convert**: `python3 tools/video2sprite.py <clip>.mp4 <work>/<name> <frames> <cell> [flags] [--magenta]`. The scale comes from the clip's first frame, which is the start pose, so every sheet of a fighter shares one scale. For a loop that begins with a transition, use `--skip=SECONDS`. Copy `<name>.png`, `<name>.json` and `<name>_preview.gif` into `assets/fighters/<id>/anim-v2/`. Never into `anim-test/`.
5. **No cut clips (hard rule).** Run `python3 tools/clip-check.py <clip>.mp4` on every download. A clip where the fighter or an effect touches the video border prints CUT and is a failed take: a fade cannot fix a cut arm, weapon or ear. Shoot attacks, the jump and anything that travels from a WIDE start frame built with `python3 tools/wide-start.py <keyed start pose> <out>.png [--magenta] [--height 0.4] [--x 0.36]` and uploaded with `media_upload`. If credits run out, leave the sheet missing (the game uses a stand-in) rather than keep a cut one.
6. **Check** every clip with `bash tools/contact.sh <out>.jpg <clip>.mp4` and Read it. Pass only if clip-check prints ok, the design matches the concept in every frame, the weapon is visible, the whole body stays inside the frame, it stays in side view facing right for most of the move, the move reads big and clear, and the background stays flat. At most 2 retakes per sheet; then keep the best take and flag it.

## Higgsfield rules (shared account, read carefully)

- Load the tools with ToolSearch: `select:mcp__Higgsfield__generate_image_batch,mcp__Higgsfield__generate_video_batch,mcp__Higgsfield__jobs_wait,mcp__Higgsfield__show_generations,mcp__Higgsfield__balance`.
- **One job in flight at a time per agent.** Six agents share a limit of 8 concurrent jobs. Submit one request, wait for it with `jobs_wait` (repeat until it is terminal; each call waits up to 15 s), then submit the next.
- If a submit returns `submission_failed` with a `preset_recommendation`, resubmit the same request with `declined_preset_id` set to that preset's id. `24bae836-2c4a-48e0-89b6-49fcc0b21612` is a known one to decline up front on video jobs.
- If you hit `Rate limit reached`, wait (call `jobs_wait` on a finished job a few times), then retry.
- On a transport error (Bad Gateway, timeout), do **not** resubmit blindly: check `show_generations` (`only_completed: false`, `size: 10`) for your prompt first.
- **Credit cap: 70 credits per agent** (2 fighters). Costs: image 2, Kling 3 s clip 3.75. Spend in the order above, so if you run short, the fighter still has idle, run, jump, hurt and attacks before anything else.

## Logging

Keep `assets/fighters/<id>/anim-v2/CLIPS.md` with the concept job, the start pose job, then one row per sheet: sheet, kept job ID, takes, pass or flagged, and a one-line note. Only write inside `assets/fighters/<your ids>/` and your scratch folder. Do not edit code, the manifest or other docs, and do not run git.

## Lesson from round 2: side heavies

Every side heavy that failed clip-check failed the same way: Kling adds a big separate impact burst or particles that fly off the edge of the frame. For side heavies (and any big attack) say "a thin smear arc hugging the weapon only; no separate impact burst, no flying particles, no shockwave" in the prompt, and keep the wide start frame.
