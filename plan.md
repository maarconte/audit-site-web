1. **Analyze performance issue**:
   - `FormQuestion.tsx` receives the entire `errors` and `touched` objects from Formik and also does a synchronous `document.getElementById` to check if a specific radio option is checked.
   - It re-renders every time ANY value in the form changes because it relies on the `FormikTouched` and `FormikErrors` types containing everything.
   - Using `document.getElementById` inside the render function of a React component is an anti-pattern, causes a DOM read during render phase, which breaks the React loop and leads to poor performance.

2. **Proposed changes in `FormQuestion.tsx`**:
   - Change the component to receive specific primitive values `error: string | undefined`, `isTouched: boolean | undefined` and `value: string | undefined`.
   - Use `React.memo` for `FormQuestion` to prevent re-renders unless these specific primitives change.
   - Remove the `document.getElementById` synchronous call and use `value === option.score.toString()` to check if the option is checked.

3. **Proposed changes in `FormContainer.tsx`**:
   - Change the `FormQuestion` rendering inside `FormContainer.tsx` to pass the primitive properties: `error={errors[question.id]}`, `isTouched={touched[question.id]}`, and `value={values[question.id]}`.

4. **Verify**:
   - Ensure the app builds and lints successfully.
