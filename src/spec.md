# Specification

## Summary
**Goal:** Convert the Namaz Öğretici tab into a text-only, single-page tutorial that shows all steps in one scrollable view for the selected gender (Men/Women), removing the swipe/step UI and all tutorial images.

**Planned changes:**
- Remove the step-by-step/swipe tutorial UI from Namaz Öğretici (no swipe gestures, no current-step pagination state, no step indicator dots, and no previous/next controls).
- Render a single long, scrollable page that lists all tutorial steps in order for the selected gender, and update content immediately when switching Men/Women.
- Refactor `frontend/src/features/namaz-ogretici/namazTutorialContent.ts` to remove per-step `imagePath` usage/requirement while keeping stable step ids and the text fields needed (title, description, optional arabicText).
- Remove runtime references to tutorial step image assets (`/assets/generated/namaz-*.png`) from the Namaz Öğretici screen.

**User-visible outcome:** In Namaz Öğretici, users can choose Men or Women and read the full ordered tutorial as text on a single scrollable page, with no images and no swipe/paging controls.
