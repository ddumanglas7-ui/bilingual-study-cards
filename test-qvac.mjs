import {
  loadModel,
  translate,
  unloadModel,
  BERGAMOT_EN_ES,
} from "@qvac/sdk";

try {
  console.log("Loading QVAC translation model...");

  const modelId = await loadModel({
    modelSrc: BERGAMOT_EN_ES,
    modelConfig: {
      engine: "Bergamot",
      from: "en",
      to: "es",
    },
  });

  console.log(`Model loaded: ${modelId}`);
  console.log("Translating on-device...");

  const result = translate({
    modelId,
    text: "Hello, how are you today?",
    modelType: "nmtcpp-translation",
    stream: true,
  });

  process.stdout.write("Translation: ");

  for await (const token of result.tokenStream) {
    process.stdout.write(token);
  }

  console.log();

  await unloadModel({
    modelId,
    clearStorage: false,
  });

  console.log("QVAC test completed successfully.");
} catch (error) {
  console.error("QVAC test failed:");
  console.error(error);
  process.exit(1);
}