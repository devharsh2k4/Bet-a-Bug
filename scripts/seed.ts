import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

import * as schema from "../db/schema";

const sql = neon(process.env.DATABASE_URL!);

const db = drizzle(sql, { schema });

const main = async () => {
  try {
    console.log("seeding database");

    await db.delete(schema.courses);
    await db.delete(schema.userProgress);
    await db.delete(schema.units);
    await db.delete(schema.lessons);
    await db.delete(schema.challenges);
    await db.delete(schema.challengeOptions);
    await db.delete(schema.challengeProgress);
    await db.delete(schema.userSubscription);

    await db.insert(schema.courses).values([
      { id: 1, title: "Node Js", imageSrc: "/node.svg" },
      { id: 2, title: "Android", imageSrc: "/android.svg" },
      { id: 3, title: "JavaScript", imageSrc: "/js.svg" },
      { id: 4, title: "React js", imageSrc: "/react.svg" },
    ]);

    await db.insert(schema.units).values([
      {
        id: 1,
        courseId: 1,
        title: "Unit 1",
        description: "Learn the basics of Node Js",
        order: 1,
      },
    ]);

    await db.insert(schema.lessons).values([
      {
        id: 1,
        unitId: 1,
        order: 1,
        title: "Basics",
      },
      {
        id: 2,
        unitId: 1,
        order: 2,
        title: "Basics",
      },
      {
        id: 3,
        unitId: 1,
        order: 3,
        title: "basics",
      },
      {
        id: 4,
        unitId: 1,
        order: 4,
        title: "basics",
      },
    ]);

    await db.insert(schema.challenges).values([
      {
        id: 1,
        lessonId: 1,
        order: 1,
        question: 'Which engine powers Node.js"?',
        type: "SELECT",
      },
      {
        id: 2,
        lessonId: 1,
        order: 2,
        question: ' "Which Programming language is Node.js based on"?"',
        type: "SELECT",
      },
      {
        id: 3,
        lessonId: 1,
        order: 3,
        question: ' "Which Protocol is primarily used in Node.js for communication?',
        type: "ASSIST",
      },

    ]);

    await db.insert(schema.challengeOptions).values([
      {
        id: 1,
        challengeId: 1,
        correct: true,
        text: "v8",
      },
      {
        id: 2,
        challengeId: 1,
        correct: false,
        text: "SpiderMonkey",
      },
      {
        id: 3,
        challengeId: 1,
        correct: false,
        text: "Chakra",
      },
    ]);
    await db.insert(schema.challengeOptions).values([
      {
        id: 4,
        challengeId: 2,
        correct: false,
        text: "python",
      },
      {
        id: 5,
        challengeId: 2,
        correct: true,
        text: "javascript",

      },
      {
        id: 6,
        challengeId: 2,
        correct: false,
        text: "Ruby",
      },
    ]);
    await db.insert(schema.challengeOptions).values([
      {
        id: 7,
        challengeId: 3,
        correct: false,
        text: "fttp",
      },
      {
        id: 8,
        challengeId: 3,
        correct: true,
        text: "http",
      },
      {
        id: 9,
        challengeId: 3,
        correct: false,
        text: "smtp",
      },
    ]);

    await db.insert(schema.challenges).values([
      {
        id: 4,
        lessonId: 2,
        order: 1,
        question: 'Which one of these is the "the man"?',
        type: "SELECT",
      },
      {
        id: 5,
        lessonId: 2,
        order: 2,
        question: ' "the man"',
        type: "SELECT",
      },
      {
        id: 6,
        lessonId: 2,
        order: 3,
        question: ' "which one of these is the "the robot"?',
        type: "ASSIST",
      },
      
    ]);


    console.log("seeding finished");
  } catch (error) {
    console.error(error);
    throw new Error("failed to seed database");
  }
};

main();
