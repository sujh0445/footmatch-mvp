# ASICS fitInsight source strategy checklist

## Before implementation
- [ ] Confirm the source strategy doc is the agreed reference
- [ ] Confirm `naverShopping` is the internal source name for Naver Shopping
- [ ] Confirm Musinsa is deferred from MVP 1st primary handling
- [ ] Confirm the sentence-signal mapping table is approved
- [ ] Confirm `sourceBreakdown`, `evidenceCount`, `evidenceQuality`, `conflictLevel` are the only source-difference controls

## Before import-agent work
- [ ] Create a tiny hand-labeled sample set for each source lane
- [ ] Define import-agent input schema
- [ ] Define import-agent output schema
- [ ] Decide how raw source provenance is carried through

## Before review-agent work
- [ ] Define review-agent input schema
- [ ] Define review-agent output schema
- [ ] Define when `evidenceStatus` can move beyond placeholder
- [ ] Define when `conflictLevel` should block promotion

## Before any crawl or parser implementation
- [ ] Verify manual sampling on a few ASICS pilot models
- [ ] Check that RunRepeat and Naver Shopping agreement is captured separately from source identity
- [ ] Confirm Musinsa remains optional backup only
- [ ] Confirm no UI or runtime catalog changes are needed for the contract docs
