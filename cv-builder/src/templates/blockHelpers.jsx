import { BlockWrap, AddBlockButton, factories } from "../components/BlockControls";

/**
 * For a given data+update pair, returns render helpers that handle add/delete
 * for each known array section. Templates just call e.g. blocks.experience(renderFn).
 *
 *   blocks.experience((exp, i) => <div>...</div>)
 *
 * This emits the array of items each wrapped with a hover delete + an Add button.
 */
export function makeBlocks(data, update) {
  const renderArr = (key, factory, renderItem, addLabel) => (
    <>
      {(data[key] || []).map((item, i) => (
        <BlockWrap key={i} onDelete={() => update([key], data[key].filter((_, idx) => idx !== i))}>
          {renderItem(item, i)}
        </BlockWrap>
      ))}
      <AddBlockButton
        onClick={() => update([key], [...(data[key] || []), factory()])}
        label={addLabel}
      />
    </>
  );

  return {
    experience: (render) => renderArr("experience", factories.experience, render, "+ Add experience"),
    education: (render) => renderArr("education", factories.education, render, "+ Add education"),
    achievements: (render) => renderArr("achievements", factories.achievement, render, "+ Add achievement"),
    courses: (render) => renderArr("courses", factories.course, render, "+ Add course"),
    languages: (render) => renderArr("languages", factories.language, render, "+ Add language"),
    references: (render) => renderArr("references", factories.reference, render, "+ Add reference"),
  };
}
