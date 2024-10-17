import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

import * as schema from "../db/schema";

const sql = neon(process.env.DATABASE_URL!);

const db = drizzle(sql, { schema });

const main = async () => {
  try {
    console.log("seeding database");

    // Clear previous data
    await db.delete(schema.courses);
    await db.delete(schema.userProgress);
    await db.delete(schema.units);
    await db.delete(schema.lessons);
    await db.delete(schema.challenges);
    await db.delete(schema.challengeOptions);
    await db.delete(schema.challengeProgress);
    await db.delete(schema.userSubscription);

    // Insert courses
    await db.insert(schema.courses).values([
      { id: 1, title: "JavaScript", imageSrc: "/js.svg" },
      { id: 2, title: "Node Js", imageSrc: "/node.svg" },
      { id: 3, title: "Android", imageSrc: "/android.svg" },
      { id: 4, title: "React js", imageSrc: "/react.svg" },
    ]);

    // Insert units
    await db.insert(schema.units).values([
      {
        id: 1,
        courseId: 1,
        title: "JavaScript Basics",
        description: "Learn the basics of JavaScript",
        order: 1,
      },
      {
        id: 2,
        courseId: 1,
        title: "Advanced JavaScript",
        description: "Go deeper into JavaScript concepts",
        order: 2,
      },
      {
        id: 3,
        courseId: 2,
        title: "Node Js Basics",
        description: "Learn the basics of Node Js",
        order: 1,
      },
      {
        id: 4,
        courseId: 2,
        title: "Node Js Advanced Topics",
        description: "Advanced Node Js Topics",
        order: 2,
      },
    ]);

    // Insert lessons
    await db.insert(schema.lessons).values([
      { id: 1, unitId: 1, order: 1, title: "Introduction to JavaScript" },
      { id: 2, unitId: 1, order: 2, title: "JavaScript Variables and Types" },
      { id: 3, unitId: 2, order: 1, title: "Closures and Scope" },
      { id: 4, unitId: 2, order: 2, title: "Async/Await" },
      { id: 5, unitId: 3, order: 1, title: "Introduction to Node.js" },
      { id: 6, unitId: 3, order: 2, title: "Node.js Modules" },
      { id: 7, unitId: 4, order: 1, title: "Node.js Streams" },
      { id: 8, unitId: 4, order: 2, title: "Building APIs with Node.js" },
    ]);

    // Insert challenges
    await db.insert(schema.challenges).values([
      { id: 1, lessonId: 1, order: 1, question: "Which engine powers Node.js?", type: "SELECT" },
      { id: 2, lessonId: 1, order: 2, question: "Which Programming language is Node.js based on?", type: "SELECT" },
      { id: 3, lessonId: 1, order: 3, question: "Which Protocol is primarily used in Node.js for communication?", type: "ASSIST" },
      { id: 4, lessonId: 2, order: 1, question: "What is the purpose of 'const' in JavaScript?", type: "SELECT" },
      { id: 5, lessonId: 2, order: 2, question: "What is the correct syntax for declaring a function in JavaScript?", type: "SELECT" },
      { id: 6, lessonId: 3, order: 1, question: "What are closures in JavaScript?", type: "ASSIST" },
      { id: 7, lessonId: 3, order: 2, question: "What is the difference between 'var', 'let', and 'const'?", type: "ASSIST" },
      { id: 8, lessonId: 5, order: 1, question: "What is the role of package.json in Node.js?", type: "SELECT" },
      { id: 9, lessonId: 5, order: 2, question: "Which of the following is used to manage dependencies in Node.js?", type: "SELECT" },
    ]);

    // Insert challenge options
    await db.insert(schema.challengeOptions).values([
      { id: 1, challengeId: 1, correct: true, text: "V8" },
      { id: 2, challengeId: 1, correct: false, text: "SpiderMonkey" },
      { id: 3, challengeId: 1, correct: false, text: "Chakra" },
      { id: 4, challengeId: 2, correct: false, text: "Python" },
      { id: 5, challengeId: 2, correct: true, text: "JavaScript" },
      { id: 6, challengeId: 2, correct: false, text: "Ruby" },
      { id: 7, challengeId: 3, correct: false, text: "FTP" },
      { id: 8, challengeId: 3, correct: true, text: "HTTP" },
      { id: 9, challengeId: 3, correct: false, text: "SMTP" },
      { id: 10, challengeId: 4, correct: true, text: "'const' declares a block-scoped constant" },
      { id: 11, challengeId: 4, correct: false, text: "'const' allows reassignment of values" },
      { id: 12, challengeId: 5, correct: true, text: "function name() {}" },
      { id: 13, challengeId: 5, correct: false, text: "def name() {}" },
      { id: 14, challengeId: 8, correct: true, text: "Defines project metadata and dependencies" },
      { id: 15, challengeId: 9, correct: true, text: "npm" },
      { id: 16, challengeId: 9, correct: false, text: "pip" },
    ]);

    console.log("seeding finished");
  } catch (error) {
    console.error(error);
    throw new Error("failed to seed database");
  }
};

main();
