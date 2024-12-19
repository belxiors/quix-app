import { HandleUserResponse, QuizQuestion } from "../App";
type QuestionCardProps = {
  isLoadingQuestion: boolean;
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
      {!props.isLoadingQuestion ? (
        <div>
          <h2>{props.questionInfo.question}</h2>
          {possibleAnswers.map((value) => (
            <button key={value} onClick={() => handleAnswer(value)}>{value}</button>
          ))}
        </div>
      ) : <div>loading</div>}
    </div>
  );
};

export default QuestionCard;
