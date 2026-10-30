import test from "node:test";
import assert from "node:assert/strict";
import { sections, lessons, alphabet, keyboardRows } from "../assets/lessons.js";

test("alphabet contains exactly the 33 Cyrillic letters", () => {
  assert.equal(alphabet.length, 33);
  assert.equal(new Set(alphabet).size, 33);
  assert.ok(alphabet.includes("Ё"));
  assert.ok(alphabet.includes("Ъ"));
  assert.ok(alphabet.includes("Ь"));
});
test("Russian on-screen keyboard can enter all 33 letters", () => {
  const keys = new Set(keyboardRows.join(""));
  const missing = alphabet.filter(letter => !keys.has(letter));
  assert.deepEqual(missing, []);
});
test("every lesson has unique ID, bilingual educational text and valid quiz", () => {
  assert.ok(lessons.length >= 12);
  assert.equal(new Set(lessons.map(l => l.id)).size, lessons.length);
  for (const lesson of lessons) {
    assert.ok(sections.some(s => s.id === lesson.section), lesson.id + " section");
    for (const key of ["en", "tl"]) {
      assert.ok(lesson.title[key], lesson.id + " title " + key);
      assert.ok(lesson.goal[key], lesson.id + " goal " + key);
      assert.ok(lesson.quiz.prompt[key], lesson.id + " prompt " + key);
    }
    assert.ok(lesson.cards.length >= 3, lesson.id + " has >=3 cards");
    for (const card of lesson.cards) {
      for (const key of ["ru", "en", "tl"]) assert.ok(card[key], lesson.id + " card " + key);
    }
    assert.ok(["choice", "type", "dictation"].includes(lesson.quiz.type), lesson.id);
    assert.ok(lesson.quiz.answer, lesson.id + " answer");
    if (lesson.quiz.type === "choice") {
      assert.ok(lesson.quiz.choices.includes(lesson.quiz.answer), lesson.id + " answer in choices");
      assert.equal(new Set(lesson.quiz.choices).size, lesson.quiz.choices.length, lesson.id + " unique choices");
    }
    if (lesson.quiz.type === "dictation") assert.ok(lesson.quiz.speak, lesson.id + " audio word");
  }
});
test("each path has useful lessons", () => {
  assert.equal(new Set(sections.map(s=>s.id)).size, sections.length);
  for (const section of sections) {
    assert.ok(section.title.en && section.title.tl && section.subtitle.en && section.subtitle.tl);
    assert.ok(lessons.filter(l => l.section === section.id).length >= 3);
  }
});
