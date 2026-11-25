# Catalog Entity Lifecycle Rules

Status: accepted for the current implementation. Updated: 2026-11-02.

Categories, attributes, and attribute values have their own Draft / Active
lifecycle. These rules apply to the catalog entity regardless of whether it is
activated in catalog management or while preparing a product. They do not define
the lifecycle or sale availability of products and product variants.

## Status meaning

**Draft** means the entity is still editable and is not eligible for assignment
to a product. A draft remains a saved catalog record; it is not an unsaved form.

**Active** means the entity is eligible for product assignment, subject to service
validation. Activation is permanent and changes the shared catalog record, not
just its use in the current form. Cancelling a product or abandoning an editor
does not roll it back.

## Entity-specific rules

| Entity | Consequence of activation | Prerequisite or related behavior |
| --- | --- | --- |
| Category | The category is no longer editable. | The service decides activation eligibility. The current product selection flow does not infer a parent-category status requirement. |
| Attribute | The attribute name is no longer editable. Values can still be added and managed according to their own lifecycle. | Activating the attribute does not activate its existing values. |
| Attribute value | The value is no longer editable. | Its parent attribute must be Active. Activating one value does not activate sibling values or its parent. |

“Values remain manageable” does not mean an Active value can be renamed. Draft
values remain editable; Active values retain the restrictions above. An Active
attribute can therefore contain both Draft and Active values.

## Activation contract

- Explain the permanent consequence before requesting activation. Confirmation
  must identify the entity whose catalog record will change.
- A request is not proof of activation. Treat activation as successful only when
  the returned entity confirms Active; a failure must not be presented as success.
- The service remains authoritative for permissions, current state, and whether
  activation is allowed. Do not infer additional eligibility rules from names,
  hierarchy, or the fact that an entity is visible in a selector.
- Previously loaded status can become stale. The product review checks current
  data before offering confirmation; final service validation still applies.
- An entity may already be Active by the time it is reviewed. Selecting it then
  requires no further activation write.

The current workflow has no deactivation or activation-undo action. Any future
reversal, renaming, or migration policy requires an explicit change to these rules.

## Workflow-specific interaction

The product creation interaction is documented in
[Selecting draft catalog entities](product-generation.md#selecting-draft-catalog-entities).
That section owns selector visibility, review layout, loading and error states,
Apply/Cancel boundaries, and focus behavior. Those UI decisions are not general
restrictions on every resource selector: other workflows may need to select Draft
entities without activating them.

## Evidence and implementation references

These rules reflect the current management and product-creation interfaces,
reviewed on 2026-11-02. They are accepted product rules, not usability research
findings or a complete specification of every backend constraint.

- [Category activation](../../apps/store/src/features/categories/detail/CategoryDetail/ActivateCategoryDialog.tsx)
  and its [tests](../../apps/store/src/features/categories/detail/CategoryDetail/ActivateCategoryDialog.test.tsx)
  document the permanent edit restriction and request outcomes.
- [Attribute activation](../../apps/store/src/features/attributes/detail/ActivateAttribute/ActivateAttributeDialog.tsx)
  and its [tests](../../apps/store/src/features/attributes/detail/ActivateAttribute/ActivateAttributeDialog.test.tsx)
  distinguish the locked name from management of values.
- [Value activation](../../apps/store/src/features/attributes/detail/ActivateAttributeValue/ActivateAttributeValueDialog.tsx)
  and its [tests](../../apps/store/src/features/attributes/detail/ActivateAttributeValue/ActivateAttributeValueDialog.test.tsx)
  cover the value's permanent edit restriction.
- [Value creation tests](../../apps/store/src/features/attributes/detail/CreateAttributeValues/CreateAttributeValuesDialog.test.tsx)
  cover the restriction on Active values under a Draft attribute.

## Keeping this specification current

Update this document when status meaning, activation prerequisites, edit
restrictions, or permanent effects change. Update the affected workflow documents
and tests in the same change. Keep interaction details in the workflow specification
and cache mechanics in implementation comments and tests.
