import * as shoesModule from "../data/shoes";

const {
  catalogShoes,
  defaultReviewFamilyKey,
  getDefaultReviewShoeId,
  getHiddenShoeById,
  getPublicCatalogShoes,
  getPublicShoeById,
  launchFamilyRegistry
} = ((shoesModule as unknown as { default?: typeof import("../data/shoes") }).default ?? shoesModule) as typeof import("../data/shoes");

type ExpectedRegistryRow = {
  familyKey: string;
  displayName: string;
  representativeCatalogId: string;
  representativeRouteId: string;
  fitInsightTarget: boolean;
  siblingHint: string;
};

const expectedRegistryRows: ExpectedRegistryRow[] = [
  {
    familyKey: "gel-nimbus-28",
    displayName: "젤 님버스 28",
    representativeCatalogId: "asics-젤-님버스-28-men",
    representativeRouteId: "asics-20944",
    fitInsightTarget: true,
    siblingHint: "님버스 28"
  },
  {
    familyKey: "gel-kayano-32",
    displayName: "젤 카야노 32",
    representativeCatalogId: "asics-젤-카야노-32-men",
    representativeRouteId: "asics-21550",
    fitInsightTarget: true,
    siblingHint: "카야노 32"
  },
  {
    familyKey: "novablast-5",
    displayName: "노바블라스트 5",
    representativeCatalogId: "asics-노바블라스트-5-2e-men",
    representativeRouteId: "asics-21559",
    fitInsightTarget: true,
    siblingHint: "노바블라스트 5"
  },
  {
    familyKey: "magic-speed-5",
    displayName: "매직 스피드 5",
    representativeCatalogId: "asics-매직-스피드-5-2e-unisex",
    representativeRouteId: "asics-21340",
    fitInsightTarget: true,
    siblingHint: "매직 스피드 5"
  },
  {
    familyKey: "trabuco-14",
    displayName: "트라부코 14",
    representativeCatalogId: "asics-트라부코-14-men",
    representativeRouteId: "asics-21741",
    fitInsightTarget: true,
    siblingHint: "트라부코 14"
  },
  {
    familyKey: "fujispeed-4",
    displayName: "후지스피드 4",
    representativeCatalogId: "asics-후지스피드-4-unisex",
    representativeRouteId: "asics-21828",
    fitInsightTarget: false,
    siblingHint: "후지스피드 4"
  }
];

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

const publicShoes = getPublicCatalogShoes();
expectEqual(publicShoes.length, 6, "public catalog size");

const publicFamilyKeys = publicShoes.map((shoe) => shoe.familyKey);
expectEqual(publicFamilyKeys.join(","), expectedRegistryRows.map((row) => row.familyKey).join(","), "public family order");

for (const expected of expectedRegistryRows) {
  const registryEntry = launchFamilyRegistry.find((entry) => entry.familyKey === expected.familyKey);
  assert(registryEntry, `Missing registry entry for ${expected.familyKey}`);

  expectEqual(registryEntry.displayName, expected.displayName, `${expected.familyKey} displayName`);
  expectEqual(registryEntry.representativeCatalogId, expected.representativeCatalogId, `${expected.familyKey} catalog id`);
  expectEqual(registryEntry.representativeRouteId, expected.representativeRouteId, `${expected.familyKey} route id`);
  expectEqual(registryEntry.fitInsightTarget, expected.fitInsightTarget, `${expected.familyKey} fitInsightTarget`);

  const publicShoe = publicShoes.find((shoe) => shoe.familyKey === expected.familyKey);
  assert(publicShoe, `Missing public shoe for ${expected.familyKey}`);

  expectEqual(publicShoe.id, expected.representativeCatalogId, `${expected.familyKey} public id`);
  expectEqual(publicShoe.routeId, expected.representativeRouteId, `${expected.familyKey} public routeId`);
  expectEqual(publicShoe.modelName, expected.displayName, `${expected.familyKey} public displayName`);
  expectEqual(Boolean(publicShoe.isPublicRepresentative), true, `${expected.familyKey} public representative flag`);
  expectEqual(publicShoe.catalogVisibility, "public", `${expected.familyKey} visibility`);
  expectEqual(publicShoe.catalogFamily, "asics-launch", `${expected.familyKey} catalog family`);

  const byId = getPublicShoeById(expected.representativeCatalogId);
  const byRoute = getPublicShoeById(expected.representativeRouteId);
  assert(byId, `Public lookup failed for representative id ${expected.representativeCatalogId}`);
  assert(byRoute, `Public lookup failed for representative route ${expected.representativeRouteId}`);

  const familyRows = catalogShoes.filter(
    (shoe) => shoe.brand === "ASICS" && shoe.modelName.includes(expected.siblingHint)
  );
  assert(familyRows.length >= 1, `No raw catalog rows found for ${expected.familyKey}`);
  assert(
    familyRows.some((shoe) => shoe.id === expected.representativeCatalogId),
    `Representative raw row missing from raw catalog for ${expected.familyKey}`
  );
  for (const row of familyRows) {
    if (row.id !== expected.representativeCatalogId) {
      assert(!getPublicShoeById(row.id), `Sibling raw row leaked into public selector for ${expected.familyKey}: ${row.id}`);
    }
  }
}

const hiddenAsicsRows = catalogShoes.filter((shoe) => shoe.brand === "ASICS" && !shoe.isLaunchTarget);
assert(hiddenAsicsRows.length > 0, "Expected hidden ASICS rows for regression coverage");

for (const row of hiddenAsicsRows) {
  assert(!getPublicShoeById(row.id), `Hidden ASICS row leaked into public selector: ${row.id}`);

  const hiddenLookupKey = row.routeId ?? row.id;
  assert(
    !getPublicShoeById(hiddenLookupKey),
    `Hidden ASICS route leaked into public selector: ${hiddenLookupKey}`
  );

  assert(getHiddenShoeById(row.id), `Hidden ASICS row should resolve through hidden lookup: ${row.id}`);
}

const defaultReviewShoeId = getDefaultReviewShoeId();
expectEqual(defaultReviewFamilyKey, "gel-nimbus-28", "default review family key");
expectEqual(defaultReviewShoeId, "asics-젤-님버스-28-men", "default review shoe id");

const hiddenChecks = [
  "nb-990v6",
  "nike-pegasus-41",
  "adidas-samba-og",
  "hoka-clifton-9",
  "salomon-xt6",
  "converse-chuck-70",
  "vans-old-skool",
  "reebok-nano-x4",
  "nike-metcon-9",
  "new-balance-2002r"
];

for (const id of hiddenChecks) {
  assert(!getPublicShoeById(id), `Hidden row resolved through public selector: ${id}`);
}

assert(getHiddenShoeById("asics-gt-2160-unisex"), "Hidden legacy ASICS detail should remain resolvable in hidden lookup");

console.log(
  JSON.stringify(
    {
      publicCount: publicShoes.length,
      publicFamilies: publicFamilyKeys,
      defaultReviewFamilyKey,
      defaultReviewShoeId,
      hiddenChecks: hiddenChecks.length
    },
    null,
    2
  )
);
