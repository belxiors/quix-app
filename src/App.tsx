import { useReducer, useState } from "react";
import "./App.css";
import QuestionCard from "./components/QuestionCard";
import { quizInitialState, quizReducer } from "./quiz-reducer";

type QuestionDifficulty = "easy" | "medium" | "hard";

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
  try {
    const response = await fetch(
      `https://opentdb.com/api.php?amount=${numberOfQuestions}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const responseData: QuizResponse = await response.json();
    return responseData;
  } catch (error) {
    console.error("Error fetching questions:", error);
    return null;
  }
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
  const [{ question, points, isLoadingQuestion }, dispatch] = useReducer(
    quizReducer,
    quizInitialState
  );

  async function handleNextQuestion() {
    dispatch({ type: "setLoading", payload: true });
    try {
      const question = await fetchQuestion();
      if (question !== null && question.results.length > 0) {
        dispatch({ type: "setNewQuestion", payload: question.results[0] });
      }
    } catch (error) {
      console.log(error);
    } finally {
      dispatch({ type: "setLoading", payload: false });
    }
  }

  function handleUserResponse(response: HandleUserResponse) {
    if (response.isAnswerCorrect) {
      dispatch({
        type: "setPoints",
        payload: points + difficultyToPointMapper(response.difficulty),
      });
    } else if (points > 0) {
      dispatch({ type: "setPoints", payload: points - 1 });
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
            isLoadingQuestion={isLoadingQuestion}
            questionInfo={question}
            questionAnsweredCallback={handleUserResponse}
          />
        </div>
      )}
    </div>
  );
}

export default App;
