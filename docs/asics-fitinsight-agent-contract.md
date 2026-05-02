# ASICS fitInsight agent contracts

This document defines the future input/output contracts for `scripts/import-agent` and `scripts/review-agent`.

## Goals
- Keep source handling repeatable.
- Keep fit mapping sentence-based rather than platform-based.
- Keep source identity in metadata, not in the final fit meaning.

## Shared data model concepts
- `sourceBreakdown`
- `evidenceCount`
- `evidenceQuality`
- `conflictLevel`
- `sourceAvailability`
- `evidenceStatus`

## import-agent contract
### Input
The import agent should accept:
- `shoeId`
- `sourceName`
- `rawSourceUrl` or `rawSourceReference`
- `rawText`
- optional source metadata such as review date or measurement labels

### Output
The import agent should produce:
- normalized evidence snippets
- source provenance
- candidate fit signal(s)
- raw confidence hints

### Responsibilities
- Normalize source content
- Preserve provenance
- Tag sentence signals
- Avoid final judgment language
- Avoid inventing evidence

### Non-responsibilities
- No crawl orchestration
- No final fit decision ownership
- No UI copy generation

## review-agent contract
### Input
The review agent should accept:
- normalized snippets from import-agent
- the current fitInsight mapping spec
- per-source evidence metadata
- manual sample annotations where available

### Output
The review agent should produce:
- fit field confirmations / rejections
- `sourceBreakdown`
- `evidenceCount`
- `evidenceQuality`
- `conflictLevel`
- `evidenceStatus`
- notes for manual follow-up

### Responsibilities
- Validate mappings against the sentence-signal spec
- Surface disagreements between RunRepeat and Naver Shopping
- Decide whether a model has enough evidence for a stronger fitInsight status

### Non-responsibilities
- No crawling
- No scraping
- No direct public UI changes
- No creation of new source lanes

## Example output expectations
A review-agent result should be able to answer:
- Which source contributed to which fit field?
- How many usable signals were found?
- How strong was the evidence?
- Did the sources disagree?
- Is the result still placeholder-level or ready for stronger use?

## Manual sampling template
For each model, record:
- `shoeId`
- `sourceName`
- `sentence`
- `mappedField`
- `evidenceQuality`
- `conflictLevel`
- `reviewerNote`

## Transition rules
- If `evidenceStatus` is `placeholder`, keep the model in a draft / pre-validated state.
- If evidence is sparse or conflicting, keep the model in a review-required state.
- If multiple sources agree and enough samples exist, allow a stronger fitInsight status later.

## Implementation note
These contracts are reference-only for future scripts. They should remain docs until the crawler / parser implementation is intentionally started.
