import { useState } from "react";
import "./App.css";
import QuestionCard from "./components/QuestionCard";

type QuestionDifficulty = 'easy' | 'medium' | 'hard';

export type QuizQuestion = {
  type: "boolean" | "multiple";
  difficulty: QuestionDifficulty;
  category: string;
  question: string;
  correct_answer: string;
  incorrect_answers: [string, string, string];
};

type QuizResponse = {
  response_code: number;
  results: QuizQuestion[];
};

export type HandleUserResponse =
  | { isAnswerCorrect: true; difficulty: QuestionDifficulty }
  | { isAnswerCorrect: false };

async function fetchQuestion(numberOfQuestions: number = 1) {
  const response = await fetch(
    `https://opentdb.com/api.php?amount=${numberOfQuestions}`
  );
  const responseData: QuizResponse = await response.json();

  return responseData;
}

function difficultyToPointMapper(difficulty: QuestionDifficulty) {
  switch (difficulty) {
    case "easy":
      return 1;
    case "medium":
      return 2;
    case "hard":
      return 3;
    default:
      return 0;
  }
}

function App() {
  const [question, setQuestion] = useState<QuizQuestion>();
  const [points, setPoints] = useState(0);

  async function handleNextQuestion() {
    const question = await fetchQuestion();
    if (question.results.length > 0) {
      setQuestion(question.results[0]);
    }
  }

  function handleUserResponse(response: HandleUserResponse) {
    if (response.isAnswerCorrect) {
      setPoints(points + difficultyToPointMapper(response.difficulty));
    } else if (points > 0) {
      setPoints(points - 1);
    }

    handleNextQuestion();
  }

  return (
    <div className="App">
      <h1>Welcome to the Quiz App!</h1>
      {!question && <button onClick={handleNextQuestion}>Start</button>}
      {question && (
        <div>
          <div>{points}</div>
          <QuestionCard
            questionInfo={question}
            questionAnsweredCallback={handleUserResponse}
          />
        </div>
      )}
    </div>
  );
}

export default App;
