# Specification

## Summary
**Goal:** Rebuild the “Namaz Öğretici” tutorial for Turkey Hanafi practice from scratch for both men and women using the provided PDF as the authoritative reference, including fully replaced, gender-specific step illustrations.

**Planned changes:**
- Recreate the full men’s and women’s Namaz Öğretici step flows (step count, order, titles/descriptions, and any arabicText where applicable) to match the PDF’s Turkey Hanafi sequence.
- Replace all existing tutorial illustrations with a new from-scratch, gender-specific image set stored under `frontend/public/assets/generated`, and update code to reference only the new filenames.
- Update `frontend/src/features/namaz-ogretici/namazTutorialContent.ts` with new `menNamazSteps` and `womenNamazSteps`, ensuring each step has a stable `id` and a valid `imagePath`.
- Ensure the Namaz Öğretici UI continues to work with the rebuilt step lists (switching men/women flows, swipe navigation, dots, previous/next controls) without out-of-range or blank-step errors.

**User-visible outcome:** Users can choose men or women flows and follow a corrected Turkey Hanafi Namaz tutorial that matches the PDF, with correct step ordering/text and brand-new gender-specific illustrations for every step.
