# ASICS fitInsight source strategy

This document defines the FootMatch MVP 1st source strategy for ASICS fitInsight.

## Source lanes
### 1) RunRepeat
Treat RunRepeat as:
- structure evidence
- measurements evidence
- expert-review evidence

Examples:
- true-to-size
- toebox / forefoot width
- heel / lockdown
- internal length
- width options

### 2) Naver Shopping
Treat Naver Shopping as the domestic buyer fit / size-perception lane.
Use the internal source name `naverShopping`.

Examples:
- 착화감
- 정사이즈 / 반업 / 크게 / 작게 느낌
- 발볼 / 발등 / 뒤꿈치 관련 체감
- 구매 사이즈 체감

### 3) Musinsa
Musinsa is not part of the MVP 1st primary-source lane.
It may remain an optional backup source later for models that have enough review volume.

## Platform handling rule
Platform identity should not change the meaning of the fit logic.
Platform differences are only tracked in:
- `sourceBreakdown`
- `evidenceCount`
- `evidenceQuality`
- `conflictLevel`

## Sentence-signal mapping
Map sentence signals to fit fields, not platform labels.

| Signal | Fit field |
|---|---|
| 정사이즈 / 반업 / 작게 나옴 | `lengthFit` |
| 앞볼 압박 / 새끼발가락 압박 | `forefootRoom` |
| 발볼 좁음 / 발볼 넓음 | `widthFit` |
| 발등 눌림 / 발등 압박 | `instepVolume` |
| 뒤꿈치 헐떡임 / heel slip / 뒤꿈치 뜸 | `heelHold` |
| 와이드 모델 존재 / 와이드 구매 후기 | `widthOptionAvailable` or `widthFit` adjustment |

## Source availability contract
The internal source availability structure should use:
- `runrepeat`
- `naverShopping`
- `musinsa` (backup / deferred)

## Evidence controls
- `evidenceCount`: how many usable signals were found
- `evidenceQuality`: how strong / clear the evidence is
- `conflictLevel`: how much sources disagree

Suggested levels:
- `evidenceQuality`: `high`, `medium`, `low`, `placeholder`
- `conflictLevel`: `none`, `mild`, `moderate`, `high`

## How to think about the sources
- RunRepeat is the structured evidence lane.
- Naver Shopping is the domestic buyer lane.
- Musinsa is deferred from MVP 1st primary source handling.

## Manual sampling template
Use hand-labeled samples before any implementation:

### Sample record
- `shoeId`
- `source`
- `rawSentence`
- `mappedFitField`
- `direction` (`positive` / `negative` / `ambiguous`)
- `evidenceQuality`
- `conflictLevel`
- `notes`

### Example sample categories
- clear positive fit signal
- clear negative fit signal
- mixed or ambiguous fit signal
- wide-option mention
- disagreement between RunRepeat and Naver Shopping

## Import-agent / review-agent split
### import-agent
Responsibility:
- normalize source evidence into a stable structure
- preserve source provenance
- do not decide final fit judgments alone

### review-agent
Responsibility:
- inspect mapped evidence
- calibrate confidence / conflict
- flag samples that need manual review
- do not invent new source behavior

## Next implementation checklist
1. Define the agent I/O contract for source ingestion.
2. Define the review-agent output schema for confidence / conflict.
3. Add a small set of manual samples for pilot ASICS models.
4. Validate that source metadata stays separate from fit meaning.
5. Only then add any crawler or parser implementation.

## Explicit non-goals
- No crawling
- No scraping
- No automatic analysis implementation
- No public UI changes
- No runtime data contract changes
