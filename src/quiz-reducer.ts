import { QuizQuestion } from "./App";

type PointsActionWithPayload = {
  type: "setPoints";
  payload: number;
};

type LoadingActionWithPayload = {
  type: "setLoading";
  payload: boolean;
};

type QuestionActionWithPayload = {
  type: "setNewQuestion";
  payload: QuizQuestion;
};

type ActionWithPayload =
  | PointsActionWithPayload
  | LoadingActionWithPayload
  | QuestionActionWithPayload;

type QuizState = {
  question: QuizQuestion | undefined;
  points: number;
  isLoadingQuestion: boolean;
};

export const quizInitialState: QuizState = {
  isLoadingQuestion: false,
  points: 0,
  question: undefined,
};

export function quizReducer(
  state: QuizState = quizInitialState,
  action: ActionWithPayload
) {
  if (action.type === "setNewQuestion") {
    return { ...state, question: action.payload };
  } else if (action.type === "setPoints") {
    return { ...state, points: action.payload };
  } else if (action.type === "setLoading") {
    return { ...state, isLoadingQuestion: action.payload };
  }

  return state;
}
