import React from "react";
import keyword_extractor from "keyword-extractor";

type Props = {
  answer: string;
  setBlankAnswer: React.Dispatch<React.SetStateAction<string>>;
};

const BLANKS = "_____";

const BlankAnswerInput = ({ answer, setBlankAnswer }: Props) => {
  const [userInput, setUserInput] = React.useState("");

  // Extract the first important keyword to blank out
  const blankKeyword = React.useMemo(() => {
    const keywords = keyword_extractor.extract(answer, {
      language: "english",
      remove_digits: true,
      return_changed_case: false,
      remove_duplicates: false,
    });
    return keywords[0]; // Just use the first important keyword
  }, [answer]);

  // Create the question with blank
  const questionWithBlank = React.useMemo(() => {
    return answer.replace(blankKeyword, BLANKS);
  }, [answer, blankKeyword]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUserInput(value);
    // Update the full answer with user's input
    setBlankAnswer(answer.replace(blankKeyword, value));
  };

  return (
    <div className="flex justify-start w-full mt-4">
      <h1 className="text-xl font-semibold">
        {questionWithBlank.split(BLANKS).map((part, index) => (
          <React.Fragment key={index}>
            {part}
            {index < questionWithBlank.split(BLANKS).length - 1 && (
              <input
                value={userInput}
                onChange={handleInputChange}
                className="text-center border-b-2 border-black dark:border-white w-28 focus:border-2 focus:border-b-4 focus:outline-none"
              />
            )}
          </React.Fragment>
        ))}
      </h1>
    </div>
  );
};

export default BlankAnswerInput;