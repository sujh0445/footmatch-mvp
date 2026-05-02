import * as shoesModule from "../data/shoes";

const {
  getFitInsightDraftPreview,
  getFitInsightPilotShoes,
  getPublicCatalogShoes
} = ((shoesModule as unknown as { default?: typeof import("../data/shoes") }).default ?? shoesModule) as typeof import("../data/shoes");

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

function expectEqual(actual: unknown, expected: unknown, label: string) {
  assert(
    Object.is(actual, expected),
    `${label} mismatch: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`
  );
}

const forbiddenTerms = ["RunRepeat", "Musinsa", "Naver", "runrepeat", "musinsa", "naver"];
const publicShoes = getPublicCatalogShoes();
const pilotShoes = getFitInsightPilotShoes();

expectEqual(publicShoes.length, 6, "public catalog size");
expectEqual(pilotShoes.length, 5, "fitInsight pilot size");

const expectedPilotFamilies = [
  "gel-nimbus-28",
  "gel-kayano-32",
  "novablast-5",
  "magic-speed-5",
  "trabuco-14"
];

expectEqual(
  pilotShoes.map((shoe) => shoe.familyKey).join(","),
  expectedPilotFamilies.join(","),
  "pilot family order"
);

for (const shoe of publicShoes) {
  const rootText = [shoe.fitSummary, shoe.sizingTendency].join(" ");
  for (const term of forbiddenTerms) {
    assert(!rootText.includes(term), `${shoe.familyKey ?? shoe.id} root copy leaked forbidden term: ${term}`);
  }

  const preview = getFitInsightDraftPreview(shoe);
  const previewText = preview ? [preview.title, preview.summary, ...preview.lines].join(" ") : "";

  if (shoe.familyKey === "fujispeed-4") {
    assert(!preview, "FUJISPEED 4 must not render the pilot placeholder block");
    expectEqual(shoe.fitInsightDraft?.status, "launch_visible_not_piloted", "FUJISPEED 4 fitInsight status");
    expectEqual(
      Object.keys(shoe.fitInsightDraft?.objective ?? {}).join(","),
      "size_tendency,forefoot_tendency,width_tendency,instep_tendency,cushioning_type,stability_type,ride_feel",
      "FUJISPEED 4 fitInsight objective keys"
    );
    continue;
  }

  assert(preview, `${shoe.familyKey ?? shoe.id} should render the placeholder block`);
  expectEqual(preview?.title, "리뷰 기반 핏 인사이트 준비 중", `${shoe.familyKey ?? shoe.id} preview title`);
  expectEqual(preview?.summary, "아직 실제 리뷰 근거를 연결하지 않았어요.", `${shoe.familyKey ?? shoe.id} preview summary`);
  expectEqual(shoe.fitInsightDraft?.status, "pilot_candidate", `${shoe.familyKey ?? shoe.id} fitInsight status`);
  expectEqual(
    Object.keys(shoe.fitInsightDraft?.objective ?? {}).join(","),
    "size_tendency,forefoot_tendency,width_tendency,instep_tendency,cushioning_type,stability_type,ride_feel",
    `${shoe.familyKey ?? shoe.id} fitInsight objective keys`
  );
  expectEqual(
    Object.keys(shoe.fitInsightDraft?.recommendation ?? {}).join(","),
    "recommended_user_foot_profile,caution_notes",
    `${shoe.familyKey ?? shoe.id} fitInsight recommendation keys`
  );
  expectEqual(
    Object.keys(shoe.fitInsightDraft?.evidence_placeholders ?? {}).join(","),
    "placeholder_notes",
    `${shoe.familyKey ?? shoe.id} fitInsight evidence placeholder keys`
  );

  const joined = previewText;
  for (const term of forbiddenTerms) {
    assert(!joined.includes(term), `${shoe.familyKey ?? shoe.id} preview leaked forbidden term: ${term}`);
  }

  assert(
    preview?.lines.every((line) => line.includes("아직 입력 전")),
    `${shoe.familyKey ?? shoe.id} preview should remain placeholder-only`
  );
}

const pilotPreviewOutput = pilotShoes.map((shoe) => getFitInsightDraftPreview(shoe));
expectEqual(pilotPreviewOutput.every(Boolean), true, "pilot preview presence");

console.log(
  JSON.stringify(
    {
      publicCount: publicShoes.length,
      pilotCount: pilotShoes.length,
      publicFamilies: publicShoes.map((shoe) => shoe.familyKey),
      pilotFamilies: pilotShoes.map((shoe) => shoe.familyKey)
    },
    null,
    2
  )
);
