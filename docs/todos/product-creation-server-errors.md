# Temporary TODO: Product creation server errors

Status: deferred until the server-error contract and UX are decided.

Continue the product-creation redesign with client-side validation. The
existing request-error toast and legacy form error mapping remain in place.
The additional server-driven editor reopening, manual registration of common
field errors, and unchanged server-rejected-value check have been removed.

Decide later:

- Which server errors map to common fields, variants, or a general message.
- Whether and when a server response should open the product details editor.
- How errors persist or clear after editing, Cancel, Apply, and retries.
- Whether resubmitting an unchanged value is allowed after a service rejection.
- How to preserve errors for unmounted fields: the installed TanStack
  `setErrorMap` implementation updates known field metadata, so fields present
  only in default values can be skipped. This was observed for product status.

Once agreed, implement the mapping deliberately and add regression coverage
for those decisions. Coordinate reusable validation policy work with
[the application-wide form validation TODO](form-validation.md).
