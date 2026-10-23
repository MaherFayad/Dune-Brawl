# Animation brief (for animation agents)

How to make one fighter's remaining animation sheets. Read `docs/art/README.md` for background and your fighter's bible `docs/characters/<id>.md` (section 10 lists every sheet with its description and frame count; section 4 has the visual design).

## Inputs per fighter

Use the **margin start frame** for every new clip: the fighter is smaller in frame, so moves that travel stay inside the shot.

| Fighter | id | Margin start frame (Higgsfield media_id) | Screen color | Converter flag |
|---|---|---|---|---|
| Saif | `djinn-warrior` | `f88e1b98-68d4-48b0-94bd-bf3353249ec0` | pure green | (none) |
| Abu Sarab | `dune-ghoul` | `da15444b-6338-4680-8ae7-46cd5af055ba` | pure magenta | `--magenta` |
| Nawaf | `falcon-rider` | `430e5423-556a-4f1e-9411-97dee4321de6` | pure green | (none) |
| Dana | `sea-siren` | `efa3642d-b997-476d-9866-16e7831e2dbc` | pure green | (none) |
| Marjana | `dagger-dancer` | `b4824c92-87d3-4c17-9027-43b4b0ad5749` | pure green | (none) |

## Higgsfield rules (shared account, read carefully)

- Load tools first: `ToolSearch` with `select:mcp__Higgsfield__generate_video_batch,mcp__Higgsfield__jobs_wait,mcp__Higgsfield__show_generations,mcp__Higgsfield__balance`.
- **One job in flight at a time per agent.** Five agents share a hard limit of 8 concurrent jobs. Submit one clip with `generate_video_batch` (a single request), wait for it with `jobs_wait` (repeat until terminal; each call waits up to 15 s), then submit the next.
- If a submit says `Rate limit reached`, call `jobs_wait` on your last finished job a few times as a delay, then retry. Never submit more than one at once.
- If a submit returns `submission_failed` with a `preset_recommendation`, resubmit the same request with `declined_preset_id` set to that preset's id.
- On a transport error (Bad Gateway, timeout) do **not** resubmit blindly: check `show_generations` (`only_completed: false`, `size: 10`, `type: video`) for your prompt first.
- Respect your credit cap. Each clip costs 3.75 credits (3 s) or 6.25 (5 s).

## Clip parameters

`model: kling3_0`, `duration: 3` (5 only for victory and taunt), `mode: std`, `sound: off`, `aspect_ratio: 1:1`.
Medias: `start_image` = your margin frame. Also set `end_image` = the same margin frame for every move that returns to the ready stance (almost all). Use `start_image` only for run and for loops that must not snap back.

## Prompt template

Write each prompt from the bible's description, in this shape:

> 2D cel-shaded fighting game sprite animation, [move in plain words: anticipation, the action, follow-through, then back to the exact starting ready stance]. [Weapon] stays in [hand] and is visible in every frame. Strict side view facing right the whole time; [he/she] never turns toward the camera. Locked-off static camera, no zoom, no pan, the camera does not follow [him/her]. [He/She] stays well inside the frame with empty margin on every side. Flat solid pure [green/magenta] background stays unchanged, no ground, no shadow. Bold dark outlines and flat cel shading, identical character design in every frame.

Attacks must be big and committed, fighting-game style: a short, quick anticipation (never a long hold), a strike with full extension and a step where the move has one, then a clear return to the ready stance. Add a thin smear arc that hugs the weapon or limb edge (never a detached white shape) or the fighter's effect (sand, water, feathers). Aerials: "hops up, does X in mid-air, lands back in the ready stance, stays centered". Run: "runs in place like on a treadmill, body stays centered". Jump: "crouches, jumps straight up, rises and falls back, lands in the ready stance, stays inside the frame". Hurt: "a big exaggerated cartoon flinch, no blood". Never name another game. Keep costumes modest. Folklore only, no religious symbols.

## Converting

```
curl -sS -o <work>/<name>.mp4 <result_url>
python3 tools/video2sprite.py <work>/<name>.mp4 <work>/<name> <frames> <cell> [--trim] [--magenta]
```

- `<frames>`: the bible's generate count, capped at 48.
- `<cell>`: 384 for side heavy, down heavy, recovery, neutral air, victory and any move that reaches far; 256 otherwise.
- `--trim` for one-shot moves (attacks, land, victory, taunt, hook); no `--trim` for loops (idle, run, fall, tumble).
- `--motion` for every attack: it spends frames on the movement instead of on held poses.
- Then copy `<name>.png`, `<name>.json`, `<name>_preview.gif` into `assets/fighters/<id>/anim-test/`. Do not copy `_64px.png` or the mp4.

File names: `idle, run, jump, fall, land, hurt, tumble, victory, taunt, jab, side_light, down_light, up_light, nair, side_heavy, recovery, down_heavy, dair, hook_<short_name>`.

## Quality check (every clip)

Run `bash tools/contact.sh <work>/<name>_contact.jpg <work>/<name>.mp4` and look at the image with Read. **Pass** only if all are true:

1. Same character design in every frame (no costume, color or proportion drift).
2. The weapon is visible in every frame where it should be.
3. The whole body stays inside the frame (nothing cut by the clip edge).
4. Side view facing right for most of the move (a brief turn during a spin is fine).
5. The move reads as described, with a clear anticipation pose and strike, and the strike pose is clearly bigger than the ready pose (no timid reach, no waving in place).
6. The background stays flat green or magenta.

If it fails, retake it with a sharper prompt that addresses the failure. You get **2 retakes per sheet**; after that keep the best take and flag it.

## Logging

Keep `assets/fighters/<id>/anim-test/CLIPS.md`: one row per sheet with the sheet name, the job ID of the take you kept, how many takes it needed, pass or flagged, and a one-line note. Only write inside `assets/fighters/<id>/anim-test/` and your scratch work folder. Do not edit any other file and do not run git commands.
