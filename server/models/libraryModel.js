const mongoose = require("mongoose");

// Scoring
const criteriumScore = mongoose.Schema({
  criterium_id: String,
  positive: Number,
  negative: Number,
  notDecided: Number,
  agreementScore: Number,
});

const aggregatedScore = mongoose.Schema({
  positive: Number,
  negative: Number,
  notDecided: Number,
  amountOfTests: Number,
});

// Testresultdata
const criteriumSchema = mongoose.Schema({
  criterium_id: String,
  text: String,
  help: String,
  choice: String,
  comment: String,
});

const testSchema = mongoose.Schema({
  // TODO connect to userschema
  testedBy: {
    type: String,
    required: true,
  },
  criteria: [criteriumSchema],
  testScore: aggregatedScore,
  scorePerCriterium: [criteriumScore],
});

const modeSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  tests: [testSchema],
  testScores: aggregatedScore,
  scoresPerCriterium: [criteriumScore],
  accessibilityScore: Number,
  agreementScore: Number,
});

const componentSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  modes: [modeSchema],
  accessibilityScore: Number,
  agreementScore: Number,
  amountOfTests: Number,
});

const versionSchema = mongoose.Schema({
  version: String,
  components: [componentSchema],
  accessibilityScore: Number,
  agreementScore: Number,
  amountOfComponentsTested: Number,
});

const librarySchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    linkHome: {
      type: String,
      required: true,
    },
    linkDocs: {
      type: String,
      required: true,
    },
    currentVersion: {
      type: String,
      required: true,
    },
    versions: [versionSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = {
  Library: mongoose.model("Library", librarySchema),
  Version: mongoose.model("Version", versionSchema),
  Criterium: mongoose.model("Criterium", criteriumSchema),
};
