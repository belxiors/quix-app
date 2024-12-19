import { HandleUserResponse, QuizQuestion } from "../App";
type QuestionCardProps = {
  questionInfo: QuizQuestion;
  questionAnsweredCallback: (response: HandleUserResponse) => void;
};

const QuestionCard = (props: QuestionCardProps) => {
  const possibleAnswers = [
    ...props.questionInfo.incorrect_answers,
    props.questionInfo.correct_answer,
  ];

  function handleAnswer(answer: string) {
    if (answer === props.questionInfo.correct_answer) {
      props.questionAnsweredCallback({
        isAnswerCorrect: true,
        difficulty: props.questionInfo.difficulty,
      });
    } else {
      props.questionAnsweredCallback({ isAnswerCorrect: false });
    }
  }

  return (
    <div>
      <h2>{props.questionInfo.question}</h2>
      {possibleAnswers.map((value) => (
        <button onClick={() => handleAnswer(value)}>{value}</button>
      ))}
    </div>
  );
};

export default QuestionCard;
