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
const forbiddenPublicCopyTerms = [
  "뒤꿈치 고정감",
  "와이드 선택지",
  "사이즈 선택 방향",
  "잘 맞을 가능성이 높은 조건",
  "구매 전 확인할 조건",
  "근거 상태",
  "길이 맞음",
  "앞볼 여유",
  "발볼 여유",
  "발등 여유"
];
const internalFieldNames = [
  "lengthFit",
  "forefootRoom",
  "widthFit",
  "instepVolume",
  "heelHold",
  "widthOptionAvailable",
  "sizeActionHint",
  "bestFor",
  "cautionFor",
  "evidenceStatus",
  "sourceAvailability",
  "riskFlags",
  "shoeCharacter"
];
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

const expectedCoreKeys = [
  "status",
  "lengthFit",
  "forefootRoom",
  "widthFit",
  "instepVolume",
  "heelHold",
  "widthOptionAvailable",
  "sizeActionHint",
  "bestFor",
  "cautionFor",
  "evidenceStatus",
  "sourceAvailability",
  "riskFlags",
  "shoeCharacter"
];

const expectedSourceAvailabilityKeys = ["runrepeat", "musinsa", "naver"];
const expectedShoeCharacterKeys = ["cushioning_type", "stability_type", "ride_feel", "weight_feel", "bounce_feel"];
const expectedNeutralPreviewTitle = "사이즈 판단 준비 중";
const expectedNeutralPreviewSummary = "내 발 프로필을 먼저 기준으로 보고 있어요. 리뷰 데이터는 아직 연결 전이에요.";
const expectedNeutralPreviewLines = [
  "사이즈 경향: 준비 중",
  "발 공간감: 준비 중",
  "뒤꿈치 들림: 준비 중",
  "와이드 옵션: 준비 중"
];
const forbiddenLegacyPreviewLabels = [
  "길이 맞음: 준비 중",
  "앞볼 여유: 준비 중",
  "발볼 여유: 준비 중",
  "발등 압박: 준비 중",
  "뒤꿈치 고정: 준비 중",
  "와이드 옵션 여부: 준비 중",
  "구매 사이즈 판단: 준비 중",
  "맞는 발 프로필: 준비 중",
  "사이즈 주의 조건: 준비 중",
  "판단 근거: 준비 중",
  "뒤꿈치 고정감",
  "와이드 선택지",
  "사이즈 선택 방향",
  "잘 맞을 가능성이 높은 조건",
  "구매 전 확인할 조건",
  "근거 상태"
];

for (const shoe of publicShoes) {
  const rootText = [shoe.fitSummary, shoe.sizingTendency].join(" ");
  for (const term of forbiddenTerms) {
    assert(!rootText.includes(term), `${shoe.familyKey ?? shoe.id} root copy leaked forbidden term: ${term}`);
  }
  for (const term of forbiddenPublicCopyTerms) {
    assert(!rootText.includes(term), `${shoe.familyKey ?? shoe.id} root copy leaked public placeholder label: ${term}`);
  }

  const preview = getFitInsightDraftPreview(shoe);
  const previewText = preview ? [preview.title, preview.summary, ...preview.lines].join(" ") : "";

  if (shoe.familyKey === "fujispeed-4") {
    assert(!preview, "FUJISPEED 4 must not render the pilot placeholder block");
    expectEqual(shoe.fitInsightDraft?.status, "launch_visible_not_piloted", "FUJISPEED 4 fitInsight status");
    expectEqual(
      Object.keys(shoe.fitInsightDraft ?? {}).join(","),
      expectedCoreKeys.join(","),
      "FUJISPEED 4 fitInsight keys"
    );
    expectEqual(shoe.fitInsightDraft?.evidenceStatus, "placeholder", "FUJISPEED 4 evidenceStatus");
    expectEqual(
      Object.keys(shoe.fitInsightDraft?.sourceAvailability ?? {}).join(","),
      expectedSourceAvailabilityKeys.join(","),
      "FUJISPEED 4 sourceAvailability keys"
    );
    expectEqual(
      Object.keys(shoe.fitInsightDraft?.shoeCharacter ?? {}).join(","),
      expectedShoeCharacterKeys.join(","),
      "FUJISPEED 4 shoeCharacter keys"
    );
    continue;
  }

  assert(preview, `${shoe.familyKey ?? shoe.id} should render the placeholder block`);
  expectEqual(preview?.title, expectedNeutralPreviewTitle, `${shoe.familyKey ?? shoe.id} preview title`);
  expectEqual(preview?.summary, expectedNeutralPreviewSummary, `${shoe.familyKey ?? shoe.id} preview summary`);
  expectEqual(preview?.lines.length, expectedNeutralPreviewLines.length, `${shoe.familyKey ?? shoe.id} preview line count`);
  expectEqual(shoe.fitInsightDraft?.status, "pilot_candidate", `${shoe.familyKey ?? shoe.id} fitInsight status`);
  expectEqual(
    Object.keys(shoe.fitInsightDraft ?? {}).join(","),
    expectedCoreKeys.join(","),
    `${shoe.familyKey ?? shoe.id} fitInsight keys`
  );
  expectEqual(shoe.fitInsightDraft?.lengthFit, "pending", `${shoe.familyKey ?? shoe.id} lengthFit`);
  expectEqual(shoe.fitInsightDraft?.forefootRoom, "pending", `${shoe.familyKey ?? shoe.id} forefootRoom`);
  expectEqual(shoe.fitInsightDraft?.widthFit, "pending", `${shoe.familyKey ?? shoe.id} widthFit`);
  expectEqual(shoe.fitInsightDraft?.instepVolume, "pending", `${shoe.familyKey ?? shoe.id} instepVolume`);
  expectEqual(shoe.fitInsightDraft?.heelHold, "pending", `${shoe.familyKey ?? shoe.id} heelHold`);
  expectEqual(shoe.fitInsightDraft?.widthOptionAvailable, "pending", `${shoe.familyKey ?? shoe.id} widthOptionAvailable`);
  expectEqual(shoe.fitInsightDraft?.sizeActionHint, "pending", `${shoe.familyKey ?? shoe.id} sizeActionHint`);
  expectEqual(shoe.fitInsightDraft?.bestFor.length, 0, `${shoe.familyKey ?? shoe.id} bestFor length`);
  expectEqual(shoe.fitInsightDraft?.cautionFor.length, 0, `${shoe.familyKey ?? shoe.id} cautionFor length`);
  expectEqual(shoe.fitInsightDraft?.evidenceStatus, "placeholder", `${shoe.familyKey ?? shoe.id} evidenceStatus`);
  expectEqual(
    Object.keys(shoe.fitInsightDraft?.sourceAvailability ?? {}).join(","),
    expectedSourceAvailabilityKeys.join(","),
    `${shoe.familyKey ?? shoe.id} sourceAvailability keys`
  );
  expectEqual(shoe.fitInsightDraft?.sourceAvailability.runrepeat, "not_connected", `${shoe.familyKey ?? shoe.id} sourceAvailability.runrepeat`);
  expectEqual(shoe.fitInsightDraft?.sourceAvailability.musinsa, "not_connected", `${shoe.familyKey ?? shoe.id} sourceAvailability.musinsa`);
  expectEqual(shoe.fitInsightDraft?.sourceAvailability.naver, "not_connected", `${shoe.familyKey ?? shoe.id} sourceAvailability.naver`);
  expectEqual(shoe.fitInsightDraft?.riskFlags.join(","), "no_source_data", `${shoe.familyKey ?? shoe.id} riskFlags`);
  expectEqual(
    Object.keys(shoe.fitInsightDraft?.shoeCharacter ?? {}).join(","),
    expectedShoeCharacterKeys.join(","),
    `${shoe.familyKey ?? shoe.id} shoeCharacter keys`
  );
  expectEqual(shoe.fitInsightDraft?.shoeCharacter.cushioning_type, "pending", `${shoe.familyKey ?? shoe.id} shoeCharacter.cushioning_type`);
  expectEqual(shoe.fitInsightDraft?.shoeCharacter.stability_type, "pending", `${shoe.familyKey ?? shoe.id} shoeCharacter.stability_type`);
  expectEqual(shoe.fitInsightDraft?.shoeCharacter.ride_feel, "pending", `${shoe.familyKey ?? shoe.id} shoeCharacter.ride_feel`);
  expectEqual(shoe.fitInsightDraft?.shoeCharacter.weight_feel, "pending", `${shoe.familyKey ?? shoe.id} shoeCharacter.weight_feel`);
  expectEqual(shoe.fitInsightDraft?.shoeCharacter.bounce_feel, "pending", `${shoe.familyKey ?? shoe.id} shoeCharacter.bounce_feel`);

  for (const term of forbiddenTerms) {
    assert(!previewText.includes(term), `${shoe.familyKey ?? shoe.id} preview leaked forbidden term: ${term}`);
  }
  for (const fieldName of internalFieldNames) {
    assert(!previewText.includes(fieldName), `${shoe.familyKey ?? shoe.id} preview leaked internal field name: ${fieldName}`);
  }
  for (const label of forbiddenLegacyPreviewLabels) {
    assert(!previewText.includes(label), `${shoe.familyKey ?? shoe.id} preview leaked legacy label: ${label}`);
  }

  assert(
    preview?.lines.every((line, index) => line === expectedNeutralPreviewLines[index]),
    `${shoe.familyKey ?? shoe.id} preview should remain neutral and placeholder-only`
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
