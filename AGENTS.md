# FootMatch AGENTS.md

## Product
FootMatch is a shoe size decision assistant.
The core loop is:
landing -> onboarding -> upload -> foot profile -> shoes -> shoe detail purchase decision

The first-priority user action is:
create a foot profile to start size judgment.

## UX direction
The landing page should make users immediately understand:
"I can create a light foot profile and quickly get shoe-size judgment based on my foot."

Preferred result order:
1. Recommended size
2. Reason
3. Reference profile

Avoid overclaiming photo-based foot analysis.
Photo-based foot width / shape judgment is only supportive.

Use consistent wording:
- 발 프로필
- 사이즈 판단
- 내 발 기준
- 신발 선택하기
- 사이즈 판단 시작하기

## OMX workflow
Use this 4-step workflow by default:
1. deep-interview
2. ralplan
3. autopilot
4. ralph

### deep-interview
Clarify the real user problem first.
Do not jump to UI patching without defining:
- what users misunderstand
- what first action is unclear
- what wording or screen element causes friction

### ralplan
Turn the problem into a concrete change plan.
Specify:
- scope
- files to edit
- expected UX effect
- constraints
- verification method

### autopilot
Implement only within approved scope.
Prefer minimal, targeted edits over broad rewrites.

### ralph
Re-check:
- scope drift
- wording consistency
- CTA consistency
- whether the first action is clearer
- whether recommendation flow still matches the product loop

## Engineering
Project path:
~/projects/footmatch-mvp

Before making major edits:
- inspect relevant files first
- explain scope briefly
- avoid unnecessary rewrites

After edits:
- run the dev server if needed
- verify landing/onboarding/shoes/shoe detail flow
- summarize changed files and why

## Important product constraint
This is not a precise foot measuring tool.
It is a size judgment support service.